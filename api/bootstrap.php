<?php
declare(strict_types=1);

require_once __DIR__ . '/env_loader.php';
load_env(__DIR__ . '/.env');

// ── CORS ─────────────────────────────────────────────────────────
$allowed_origins = [
    'http://localhost',
    'http://localhost:80',
    'http://localhost:8080',
    'http://127.0.0.1',
    'http://127.0.0.1:80',
    'http://127.0.0.1:8080',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if ($origin !== '' && in_array($origin, $allowed_origins, true)) {
    header("Access-Control-Allow-Origin: {$origin}");
}

header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 86400');

// ── Responder preflight inmediatamente ──────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ── Content-Type por defecto ────────────────────────────────────
header('Content-Type: application/json; charset=utf-8');

// ── Helpers ─────────────────────────────────────────────────────
function json_out(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function read_json_body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return [];
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

// ── CSRF ────────────────────────────────────────────────────────
function csrf_generate(): string
{
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    $token = bin2hex(random_bytes(32));
    $_SESSION['csrf_token'] = $token;
    return $token;
}

function csrf_field(): string
{
    $token = csrf_generate();
    return '<input type="hidden" name="_csrf_token" value="' . htmlspecialchars($token, ENT_QUOTES, 'UTF-8') . '">';
}

function csrf_validate(?string $token = null): bool
{
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    $submitted = $token ?? ($_POST['_csrf_token'] ?? $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '');
    $stored    = $_SESSION['csrf_token'] ?? '';

    if ($submitted === '' || $stored === '') {
        return false;
    }

    return hash_equals($stored, $submitted);
}

function csrf_require(): void
{
    $method = $_SERVER['REQUEST_METHOD'];

    if (in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE'], true)) {
        if (!csrf_validate()) {
            json_out(403, ['ok' => false, 'error' => 'Token CSRF inválido. Recarga la página.']);
        }
    }
}

// ── Logging ─────────────────────────────────────────────────────
function log_error(string $message, ?Throwable $e = null): void
{
    $log_dir  = __DIR__ . '/logs';
    $log_file = $log_dir . '/error_' . date('Y-m-d') . '.log';

    if (!is_dir($log_dir)) {
        mkdir($log_dir, 0755, true);
    }

    $line = '[' . date('Y-m-d H:i:s') . '] '
          . $message
          . ($_SERVER['REQUEST_URI'] ?? '')
          . PHP_EOL;

    if ($e !== null) {
        $line .= '  Exception: ' . $e->getMessage() . PHP_EOL;
        $line .= '  File: ' . $e->getFile() . ':' . $e->getLine() . PHP_EOL;
    }

    file_put_contents($log_file, $line, FILE_APPEND | LOCK_EX);
}
