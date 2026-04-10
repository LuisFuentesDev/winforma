<?php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-API-Token');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
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

$token = '';
$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
if (preg_match('/Bearer\s+(.+)/i', $authHeader, $matches)) {
    $token = trim($matches[1]);
} elseif (!empty($_SERVER['HTTP_X_API_TOKEN'])) {
    $token = trim($_SERVER['HTTP_X_API_TOKEN']);
}

$rawBody = file_get_contents('php://input');
$payload = json_decode($rawBody ?: '', true);

if (!is_array($payload) || !$payload) {
    $payload = $_POST;
}

if (empty($token) && !empty($payload['token'])) {
    $token = trim((string) $payload['token']);
}

if (!defined('PUBLISH_API_TOKEN') || $token === '' || !hash_equals(PUBLISH_API_TOKEN, $token)) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON payload']);
    exit;
}

if (!empty($payload['content_b64'])) {
    $decodedContent = base64_decode((string) $payload['content_b64'], true);
    if ($decodedContent === false) {
        http_response_code(422);
        echo json_encode(['error' => 'Invalid content_b64']);
        exit;
    }
    $payload['content'] = $decodedContent;
}

if (!empty($payload['summary_b64'])) {
    $decodedSummary = base64_decode((string) $payload['summary_b64'], true);
    if ($decodedSummary === false) {
        http_response_code(422);
        echo json_encode(['error' => 'Invalid summary_b64']);
        exit;
    }
    $payload['summary'] = $decodedSummary;
}

$requiredFields = ['slug', 'title', 'summary', 'content', 'author', 'category', 'status', 'published_at'];
foreach ($requiredFields as $field) {
    if (!array_key_exists($field, $payload) || trim((string) $payload[$field]) === '') {
        http_response_code(422);
        echo json_encode(['error' => "Missing required field: {$field}"]);
        exit;
    }
}

$breaking = !empty($payload['breaking']);
$publicBaseUrl = rtrim((isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . ($_SERVER['HTTP_HOST'] ?? 'www.winforma.cl'), '/');

try {
    $writeKey = get_supabase_write_key();
    $upsertPayload = [[
        'slug' => $payload['slug'],
        'title' => $payload['title'],
        'summary' => $payload['summary'],
        'content' => $payload['content'],
        'author' => $payload['author'],
        'category' => $payload['category'],
        'image_url' => $payload['image_url'] ?? null,
        'source_url' => $payload['source_url'] ?? null,
        'breaking' => $breaking,
        'status' => $payload['status'],
        'published_at' => $payload['published_at'],
    ]];

    $response = supabase_json_request(
        'POST',
        '/rest/v1/articles?on_conflict=slug',
        [
            'api_key' => $writeKey,
            'headers' => [
                'Prefer: resolution=merge-duplicates,return=representation',
            ],
            'json' => $upsertPayload,
        ]
    );

    if ($response['status'] < 200 || $response['status'] >= 300 || !is_array($response['json']) || empty($response['json'][0])) {
        throw new RuntimeException('Supabase publish failed with status ' . $response['status']);
    }

    $article = $response['json'][0];

    echo json_encode([
        'ok' => true,
        'id' => $article['id'] ?? null,
        'slug' => $article['slug'] ?? $payload['slug'],
        'url' => $publicBaseUrl . '/articulo/' . ($article['slug'] ?? $payload['slug']),
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $exception) {
    error_log('publish.php failed: ' . $exception->getMessage());
    http_response_code(500);
    echo json_encode([
        'error' => 'Publish failed',
        'details' => $apiDebug ? $exception->getMessage() : null,
    ]);
}
