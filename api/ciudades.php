<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];
csrf_require();

try {
    if ($method === 'GET') {
        $stmt = db()->query('SELECT id, nombre FROM ciudades ORDER BY nombre ASC');
        json_out(200, ['ok' => true, 'data' => $stmt->fetchAll()]);
    }

    if ($method === 'POST') {
        $b = read_json_body();
        $id = isset($b['id']) ? trim((string) $b['id']) : '';
        $nombre = isset($b['nombre']) ? trim((string) $b['nombre']) : '';
        if ($id === '' || $nombre === '') {
            json_out(400, ['ok' => false, 'error' => 'id y nombre son obligatorios']);
        }
        $st = db()->prepare('INSERT INTO ciudades (id, nombre) VALUES (:id, :nombre)');
        $st->execute(['id' => $id, 'nombre' => $nombre]);
        json_out(201, ['ok' => true, 'id' => $id]);
    }

    if ($method === 'PUT' || $method === 'PATCH') {
        $b = read_json_body();
        $id = isset($b['id']) ? trim((string) $b['id']) : '';
        $nombre = isset($b['nombre']) ? trim((string) $b['nombre']) : '';
        if ($id === '' || $nombre === '') {
            json_out(400, ['ok' => false, 'error' => 'id y nombre son obligatorios']);
        }
        $st = db()->prepare('UPDATE ciudades SET nombre = :nombre WHERE id = :id');
        $st->execute(['id' => $id, 'nombre' => $nombre]);
        json_out(200, ['ok' => true, 'afectados' => $st->rowCount()]);
    }

    if ($method === 'DELETE') {
        $id = isset($_GET['id']) ? trim((string) $_GET['id']) : '';
        if ($id === '') {
            json_out(400, ['ok' => false, 'error' => 'Parámetro id requerido']);
        }
        $st = db()->prepare('DELETE FROM ciudades WHERE id = :id');
        $st->execute(['id' => $id]);
        json_out(200, ['ok' => true, 'afectados' => $st->rowCount()]);
    }

    json_out(405, ['ok' => false, 'error' => 'Método no permitido']);
} catch (Throwable $e) {
    log_error('Error en ciudades', $e);
    json_out(500, ['ok' => false, 'error' => 'Error en el servidor']);
}
