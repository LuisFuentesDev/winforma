<?php

header('Content-Type: application/xml; charset=utf-8');

$configPath = __DIR__ . '/api/config.php';
if (!file_exists($configPath)) {
    http_response_code(500);
    echo '<?xml version="1.0" encoding="UTF-8"?><error>Missing API config</error>';
    exit;
}

require_once $configPath;
require_once __DIR__ . '/api/supabase.php';

$siteUrl = 'https://winforma.cl';

function xml_escape(string $value): string
{
    return htmlspecialchars($value, ENT_XML1 | ENT_QUOTES, 'UTF-8');
}

function format_lastmod(?string $value): ?string
{
    if (!$value) {
        return null;
    }

    try {
        return (new DateTimeImmutable($value))->format(DateTimeInterface::ATOM);
    } catch (Throwable $exception) {
        return null;
    }
}

try {
    $query = http_build_query([
        'select' => 'slug,published_at,updated_at',
        'status' => 'eq.published',
        'order' => 'published_at.desc',
    ], '', '&', PHP_QUERY_RFC3986);

    $response = supabase_json_request('GET', '/rest/v1/articles?' . $query);

    if ($response['status'] < 200 || $response['status'] >= 300 || !is_array($response['json'])) {
        throw new RuntimeException('Supabase sitemap lookup failed with status ' . $response['status']);
    }

    $articles = $response['json'];
} catch (Throwable $exception) {
    http_response_code(500);
    echo '<?xml version="1.0" encoding="UTF-8"?><error>Failed to load sitemap</error>';
    exit;
}

echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
echo "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n";

foreach ($articles as $article) {
    $slug = trim((string) ($article['slug'] ?? ''));
    if ($slug === '') {
        continue;
    }

    $url = $siteUrl . '/articulo/' . rawurlencode($slug);
    $lastmod = format_lastmod($article['updated_at'] ?? $article['published_at'] ?? null);

    echo "  <url>\n";
    echo '    <loc>' . xml_escape($url) . "</loc>\n";
    if ($lastmod) {
        echo '    <lastmod>' . xml_escape($lastmod) . "</lastmod>\n";
    }
    echo "    <changefreq>daily</changefreq>\n";
    echo "    <priority>0.7</priority>\n";
    echo "  </url>\n";
}

echo "</urlset>\n";
