<?php
declare(strict_types=1);

function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $cfg = require __DIR__ . '/config.php';
    $d = $cfg['db'];
    $dsn = sprintf(
        'mysql:host=%s;port=%s;dbname=%s;charset=%s',
        $d['host'],
        $d['port'],
        $d['name'],
        $d['charset']
    );

    $pdo = new PDO($dsn, $d['user'], $d['pass'], [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);

    return $pdo;
}

/**
 * Escapa un valor para usarlo de forma segura en contexto de texto.
 */
function sanitize_string(string $value): string
{
    return htmlspecialchars(trim($value), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/**
 * Limita la longitud de un string y lo sanitiza.
 */
function sanitize_input(?string $value, int $max = 255): string
{
    if ($value === null || $value === '') {
        return '';
    }
    return sanitize_string(substr(trim($value), 0, $max));
}
