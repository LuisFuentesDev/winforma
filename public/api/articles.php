<?php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$configPath = __DIR__ . '/config.php';
if (!file_exists($configPath)) {
    http_response_code(500);
    echo json_encode(['error' => 'Missing api config']);
    exit;
}

require_once $configPath;
require_once __DIR__ . '/supabase.php';

$apiDebug = defined('API_DEBUG') && API_DEBUG;

try {
    $query = [
        'select' => 'id,slug,title,summary,content,author,category,image_url,source_url,breaking,status,published_at,created_at,updated_at',
        'status' => 'eq.published',
        'order' => 'published_at.desc',
    ];

    if (!empty($_GET['slug'])) {
        $query['slug'] = 'eq.' . (string) $_GET['slug'];
        $response = supabase_json_request('GET', '/rest/v1/articles?' . http_build_query($query, '', '&', PHP_QUERY_RFC3986), [
            'headers' => ['Accept: application/vnd.pgrst.object+json'],
        ]);

        if ($response['status'] === 404 || $response['status'] === 406) {
            http_response_code(404);
            echo json_encode(['error' => 'Article not found']);
            exit;
        }

        if ($response['status'] < 200 || $response['status'] >= 300 || !is_array($response['json'])) {
            throw new RuntimeException('Supabase read failed with status ' . $response['status']);
        }

        $article = $response['json'];
        $article['breaking'] = (bool) ($article['breaking'] ?? false);
        echo json_encode($article, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    if (!empty($_GET['category'])) {
        $query['category'] = 'ilike.' . (string) $_GET['category'];
    }

    $response = supabase_json_request('GET', '/rest/v1/articles?' . http_build_query($query, '', '&', PHP_QUERY_RFC3986));

    if ($response['status'] < 200 || $response['status'] >= 300 || !is_array($response['json'])) {
        throw new RuntimeException('Supabase read failed with status ' . $response['status']);
    }

    $articles = array_map(
        static function ($row) {
            $row['breaking'] = (bool) ($row['breaking'] ?? false);
            return $row;
        },
        $response['json']
    );

    echo json_encode($articles, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $exception) {
    error_log('articles.php failed: ' . $exception->getMessage());
    http_response_code(500);
    echo json_encode([
        'error' => 'Database query failed',
        'details' => $apiDebug ? $exception->getMessage() : null,
    ]);
}
