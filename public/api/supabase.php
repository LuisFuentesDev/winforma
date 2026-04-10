<?php

function get_supabase_url(): string
{
    if (!defined('SUPABASE_URL') || trim((string) SUPABASE_URL) === '') {
        throw new RuntimeException('Missing SUPABASE_URL');
    }

    return rtrim((string) SUPABASE_URL, '/');
}

function get_supabase_publishable_key(): string
{
    if (!defined('SUPABASE_PUBLISHABLE_KEY') || trim((string) SUPABASE_PUBLISHABLE_KEY) === '') {
        throw new RuntimeException('Missing SUPABASE_PUBLISHABLE_KEY');
    }

    return trim((string) SUPABASE_PUBLISHABLE_KEY);
}

function get_supabase_write_key(): string
{
    if (defined('SUPABASE_SERVICE_ROLE_KEY') && trim((string) SUPABASE_SERVICE_ROLE_KEY) !== '') {
        return trim((string) SUPABASE_SERVICE_ROLE_KEY);
    }

    return get_supabase_publishable_key();
}

function supabase_request(string $method, string $path, array $options = []): array
{
    $url = get_supabase_url() . $path;
    $apiKey = $options['api_key'] ?? get_supabase_publishable_key();
    $headers = [
        'apikey: ' . $apiKey,
        'Authorization: Bearer ' . $apiKey,
    ];

    if (!empty($options['headers']) && is_array($options['headers'])) {
        foreach ($options['headers'] as $header) {
            $headers[] = $header;
        }
    }

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        if ($ch === false) {
            throw new RuntimeException('Failed to initialize cURL');
        }

        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => strtoupper($method),
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_TIMEOUT => 20,
        ]);

        if (array_key_exists('body', $options)) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, (string) $options['body']);
        }

        $rawBody = curl_exec($ch);
        $status = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);

        if ($rawBody === false) {
            $error = curl_error($ch);
            curl_close($ch);
            throw new RuntimeException('Supabase request failed: ' . $error);
        }

        curl_close($ch);

        return [
            'status' => $status,
            'body' => $rawBody,
        ];
    }

    $context = stream_context_create([
        'http' => [
            'method' => strtoupper($method),
            'header' => implode("\r\n", $headers),
            'timeout' => 20,
            'ignore_errors' => true,
            'content' => array_key_exists('body', $options) ? (string) $options['body'] : '',
        ],
    ]);

    $rawBody = @file_get_contents($url, false, $context);
    if ($rawBody === false) {
        throw new RuntimeException('Supabase request failed');
    }

    $status = 0;
    $responseHeaders = $http_response_header ?? [];
    if (!empty($responseHeaders[0]) && preg_match('#HTTP/\S+\s+(\d{3})#', $responseHeaders[0], $matches)) {
        $status = (int) $matches[1];
    }

    return [
        'status' => $status,
        'body' => $rawBody,
    ];
}

function supabase_json_request(string $method, string $path, array $options = []): array
{
    $headers = $options['headers'] ?? [];
    $headers[] = 'Accept: application/json';

    if (array_key_exists('json', $options)) {
        $headers[] = 'Content-Type: application/json';
        $options['body'] = json_encode($options['json'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

    $options['headers'] = $headers;

    $response = supabase_request($method, $path, $options);
    $decoded = json_decode($response['body'], true);

    return [
        'status' => $response['status'],
        'body' => $response['body'],
        'json' => $decoded,
    ];
}
