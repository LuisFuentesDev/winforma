<?php

$configPath = __DIR__ . '/api/config.php';
if (!file_exists($configPath)) {
    http_response_code(500);
    echo 'Missing API config';
    exit;
}

require_once $configPath;
require_once __DIR__ . '/api/supabase.php';

$slug = isset($_GET['slug']) ? trim((string) $_GET['slug']) : '';
if ($slug === '') {
    header('Location: /', true, 302);
    exit;
}

function escape_content(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function normalize_summary(string $summary): string
{
    $summary = preg_replace('/\s+/', ' ', trim($summary));
    return mb_substr($summary, 0, 180);
}

try {
    $query = http_build_query([
        'select' => 'slug,title,summary,image_url',
        'status' => 'eq.published',
        'slug' => 'eq.' . $slug,
    ], '', '&', PHP_QUERY_RFC3986);

    $response = supabase_json_request('GET', '/rest/v1/articles?' . $query, [
        'headers' => ['Accept: application/vnd.pgrst.object+json'],
    ]);

    if ($response['status'] === 404 || $response['status'] === 406 || !is_array($response['json'])) {
        header('Location: /', true, 302);
        exit;
    }

    if ($response['status'] < 200 || $response['status'] >= 300) {
        throw new RuntimeException('Supabase share lookup failed with status ' . $response['status']);
    }

    $article = $response['json'];
} catch (Throwable $exception) {
    http_response_code(500);
    echo 'Failed to load article';
    exit;
}

$title = $article['title'] ?: 'WINFORMA - Noticias que importan';
$summary = normalize_summary($article['summary'] ?: 'Noticias de Winforma');
$image = $article['image_url'] ?: 'https://winforma.cl/og-winforma.png';
$articleUrl = 'https://winforma.cl/articulo/' . rawurlencode($article['slug']);
?>
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><?= escape_content($title) ?></title>
    <meta name="description" content="<?= escape_content($summary) ?>" />

    <meta property="og:type" content="article" />
    <meta property="og:title" content="<?= escape_content($title) ?>" />
    <meta property="og:description" content="<?= escape_content($summary) ?>" />
    <meta property="og:url" content="<?= escape_content($articleUrl) ?>" />
    <meta property="og:image" content="<?= escape_content($image) ?>" />
    <meta property="og:image:alt" content="<?= escape_content($title) ?>" />
    <meta property="og:site_name" content="Winforma" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="<?= escape_content($title) ?>" />
    <meta name="twitter:description" content="<?= escape_content($summary) ?>" />
    <meta name="twitter:image" content="<?= escape_content($image) ?>" />

    <meta http-equiv="refresh" content="0;url=<?= escape_content($articleUrl) ?>" />
    <script>
      window.location.replace(<?= json_encode($articleUrl, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) ?>);
    </script>
  </head>
  <body>
    <p>Redirigiendo a <a href="<?= escape_content($articleUrl) ?>"><?= escape_content($articleUrl) ?></a></p>
  </body>
</html>
