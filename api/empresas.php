<?php
declare(strict_types=1);

/**
 * tabla empresas.
 */
require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_out(405, ['ok' => false, 'error' => 'Método no permitido']);
}

try {
    $stmt = db()->query('SELECT id, nombre FROM empresas ORDER BY nombre ASC');
    json_out(200, ['ok' => true, 'data' => $stmt->fetchAll()]);
} catch (Throwable $e) {
    json_out(500, ['ok' => false, 'error' => 'Error en el servidor']);
}
