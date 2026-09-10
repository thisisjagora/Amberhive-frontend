<?php
declare(strict_types=1);

const AMBERHIVE_API = 'https://test.amber-hive.com/api/v1/all-books';
const AMBERHIVE_SITE = 'https://amber-hive.com';
const AMBERHIVE_STORAGE = 'https://test.amber-hive.com/storage/';

function escape_html(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function plain_text(string $value): string
{
    $value = html_entity_decode(strip_tags($value), ENT_QUOTES | ENT_HTML5, 'UTF-8');
    return trim((string) preg_replace('/\s+/', ' ', $value));
}

function fetch_json(string $url): ?array
{
    $curl = curl_init($url);
    curl_setopt_array($curl, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 10,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_HTTPHEADER => ['Accept: application/json'],
    ]);

    $body = curl_exec($curl);
    $status = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
    curl_close($curl);

    if ($body === false || $status < 200 || $status >= 300) {
        return null;
    }

    $decoded = json_decode($body, true);
    return is_array($decoded) ? $decoded : null;
}

function find_book(string $slug): ?array
{
    $firstPage = fetch_json(AMBERHIVE_API . '?page=1');
    $data = $firstPage['data'] ?? null;
    if (!is_array($data)) {
        return null;
    }

    $pages = [$data['data'] ?? []];
    $lastPage = max(1, (int) ($data['last_page'] ?? 1));

    for ($page = 2; $page <= $lastPage; $page++) {
        $payload = fetch_json(AMBERHIVE_API . '?page=' . $page);
        $pages[] = $payload['data']['data'] ?? [];
    }

    foreach ($pages as $books) {
        foreach ($books as $book) {
            if (($book['slug'] ?? '') === $slug) {
                return $book;
            }
        }
    }

    return null;
}

$slug = trim(rawurldecode((string) ($_GET['slug'] ?? '')));
if (!preg_match('/^[a-z0-9-]+$/', $slug)) {
    http_response_code(400);
    exit('Invalid book link.');
}

$book = find_book($slug);
$title = $book ? ($book['title'] . ' | AmberHive') : 'Book | AmberHive';
$description = $book
    ? mb_substr(plain_text((string) ($book['description'] ?? '')), 0, 200)
    : 'Discover books on AmberHive.';
$canonicalUrl = AMBERHIVE_SITE . '/book/' . rawurlencode($slug);
$coverPath = (string) ($book['cover_image'] ?? '');
$imageUrl = $coverPath !== ''
    ? AMBERHIVE_STORAGE . implode('/', array_map('rawurlencode', explode('/', $coverPath)))
    : AMBERHIVE_SITE . '/Amber_Hive.png';

header('Content-Type: text/html; charset=UTF-8');
header('Cache-Control: public, max-age=0, s-maxage=600, stale-while-revalidate=86400');
http_response_code($book ? 200 : 404);
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title><?= escape_html($title) ?></title>
  <meta name="description" content="<?= escape_html($description) ?>">
  <link rel="canonical" href="<?= escape_html($canonicalUrl) ?>">
  <meta property="og:type" content="book">
  <meta property="og:site_name" content="AmberHive">
  <meta property="og:title" content="<?= escape_html($title) ?>">
  <meta property="og:description" content="<?= escape_html($description) ?>">
  <meta property="og:url" content="<?= escape_html($canonicalUrl) ?>">
  <meta property="og:image" content="<?= escape_html($imageUrl) ?>">
  <meta property="og:image:alt" content="<?= escape_html((string) ($book['title'] ?? 'AmberHive book')) ?>">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="<?= escape_html($title) ?>">
  <meta name="twitter:description" content="<?= escape_html($description) ?>">
  <meta name="twitter:image" content="<?= escape_html($imageUrl) ?>">
</head>
<body></body>
</html>
