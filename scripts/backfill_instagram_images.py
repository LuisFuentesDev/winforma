import mimetypes
import os
import sys
from pathlib import Path
from typing import Any
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

import requests


def load_env_file(path: Path) -> dict[str, str]:
  values: dict[str, str] = {}
  for raw_line in path.read_text().splitlines():
    line = raw_line.strip()
    if not line or line.startswith("#") or "=" not in line:
      continue
    key, value = line.split("=", 1)
    values[key.strip()] = value.strip().strip('"').strip("'")
  return values


def normalize_url(url: str) -> str:
  parsed = urlsplit(url)
  disallow = {"utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "fbclid"}
  query = [(k, v) for k, v in parse_qsl(parsed.query, keep_blank_values=True) if k not in disallow]
  return urlunsplit((parsed.scheme, parsed.netloc.lower(), parsed.path or "/", urlencode(query), ""))


def supabase_headers(service_role_key: str, *, json_content: bool = True) -> dict[str, str]:
  headers = {
    "apikey": service_role_key,
    "Authorization": f"Bearer {service_role_key}",
  }
  if json_content:
    headers["Content-Type"] = "application/json"
  return headers


def fetch_published_articles(base_url: str, service_role_key: str) -> list[dict[str, Any]]:
  response = requests.get(
    f"{base_url}/rest/v1/articles",
    headers=supabase_headers(service_role_key, json_content=False),
    params={
      "select": "id,slug,source_url,image_url",
      "status": "eq.published",
      "source_url": "not.is.null",
      "order": "published_at.desc",
    },
    timeout=30,
  )
  response.raise_for_status()
  return response.json()


def fetch_instagram_media(access_token: str, page_limit: int = 20) -> list[dict[str, Any]]:
  items: list[dict[str, Any]] = []
  url = "https://graph.instagram.com/me/media"
  params = {
    "fields": "id,media_type,media_url,thumbnail_url,permalink,timestamp",
    "access_token": access_token,
    "limit": "100",
  }

  for _ in range(page_limit):
    response = requests.get(url, params=params, timeout=30)
    response.raise_for_status()
    payload = response.json()
    items.extend(payload.get("data", []))

    next_url = payload.get("paging", {}).get("next")
    if not next_url:
      break

    url = next_url
    params = None

  return items


def guess_extension(content_type: str | None, url: str) -> str:
  if content_type:
    guessed = mimetypes.guess_extension(content_type.split(";", 1)[0].strip().lower())
    if guessed:
      return guessed
  _, ext = os.path.splitext(urlsplit(url).path)
  return ext.lower() or ".jpg"


def upload_image(base_url: str, service_role_key: str, bucket: str, slug: str, remote_url: str) -> str:
  image_response = requests.get(remote_url, timeout=45)
  image_response.raise_for_status()

  content_type = image_response.headers.get("Content-Type", "image/jpeg")
  extension = guess_extension(content_type, remote_url)
  object_path = f"articles/{slug}{extension}"

  upload_response = requests.post(
    f"{base_url}/storage/v1/object/{bucket}/{object_path}",
    headers={
      "apikey": service_role_key,
      "Authorization": f"Bearer {service_role_key}",
      "Content-Type": content_type,
      "x-upsert": "true",
    },
    data=image_response.content,
    timeout=60,
  )
  upload_response.raise_for_status()
  return f"{base_url}/storage/v1/object/public/{bucket}/{object_path}"


def update_article_image(base_url: str, service_role_key: str, slug: str, image_url: str) -> None:
  response = requests.patch(
    f"{base_url}/rest/v1/articles",
    headers={
      **supabase_headers(service_role_key),
      "Prefer": "return=minimal",
    },
    params={"slug": f"eq.{slug}"},
    json={"image_url": image_url},
    timeout=30,
  )
  response.raise_for_status()


def main() -> int:
  env_path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("/Users/luisfuentes/BDWI/news-bot/.env")
  if not env_path.exists():
    print(f"No existe el archivo de entorno: {env_path}")
    return 1

  env = load_env_file(env_path)
  base_url = env.get("BASE_URL", "").rstrip("/")
  service_role_key = env.get("BASE_SERVICE_ROLE_KEY", "")
  access_token = env.get("INSTAGRAM_ACCESS_TOKEN", "")
  bucket = env.get("STORAGE_BUCKET", "article-images").strip() or "article-images"

  if not base_url or not service_role_key or not access_token:
    print("Faltan BASE_URL, BASE_SERVICE_ROLE_KEY o INSTAGRAM_ACCESS_TOKEN en el .env")
    return 1

  articles = fetch_published_articles(base_url, service_role_key)
  media_items = fetch_instagram_media(access_token)
  media_by_permalink = {
    normalize_url(item.get("permalink", "")): item
    for item in media_items
    if item.get("permalink")
  }

  recovered = 0
  skipped = 0

  for article in articles:
    source_url = normalize_url(article.get("source_url") or "")
    if not source_url:
      skipped += 1
      continue

    current_image = article.get("image_url") or ""
    if f"/storage/v1/object/public/{bucket}/" in current_image:
      skipped += 1
      continue

    media = media_by_permalink.get(source_url)
    if not media:
      print(f"[SKIP] Sin match en Instagram: {article.get('slug')}")
      skipped += 1
      continue

    remote_url = media.get("thumbnail_url") or media.get("media_url")
    if not remote_url:
      print(f"[SKIP] Sin URL de imagen en Instagram: {article.get('slug')}")
      skipped += 1
      continue

    try:
      public_url = upload_image(base_url, service_role_key, bucket, article["slug"], remote_url)
      update_article_image(base_url, service_role_key, article["slug"], public_url)
      recovered += 1
      print(f"[OK] {article['slug']} -> {public_url}")
    except Exception as exc:
      print(f"[ERROR] {article.get('slug')}: {exc}")

  print(f"Recuperadas: {recovered}")
  print(f"Omitidas: {skipped}")
  return 0


if __name__ == "__main__":
  raise SystemExit(main())
