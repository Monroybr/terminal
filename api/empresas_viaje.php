<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        if (isset($_GET['id'])) {
            $id = (int) $_GET['id'];
            $st = db()->prepare('SELECT id, nombre, horario, salida, llegada, duracion, precio_unitario FROM empresas_viaje WHERE id = :id');
            $st->execute(['id' => $id]);
            $row = $st->fetch();
            if (!$row) {
                json_out(404, ['ok' => false, 'error' => 'No encontrado']);
            }
            json_out(200, ['ok' => true, 'data' => $row]);
        }
        $stmt = db()->query('SELECT id, nombre, horario, salida, llegada, duracion, precio_unitario FROM empresas_viaje ORDER BY id ASC');
        json_out(200, ['ok' => true, 'data' => $stmt->fetchAll()]);
    }

    if ($method === 'POST') {
        $b = read_json_body();
        $nombre = isset($b['nombre']) ? trim((string) $b['nombre']) : '';
        $horario = isset($b['horario']) ? trim((string) $b['horario']) : '';
        $salida = isset($b['salida']) ? trim((string) $b['salida']) : '';
        $llegada = isset($b['llegada']) ? trim((string) $b['llegada']) : '';
        $duracion = isset($b['duracion']) ? trim((string) $b['duracion']) : '';
        $precio = isset($b['precio_unitario']) ? (float) $b['precio_unitario'] : 0.0;
        if ($nombre === '' || $precio <= 0) {
            json_out(400, ['ok' => false, 'error' => 'nombre y precio_unitario válidos son obligatorios']);
        }
        $st = db()->prepare(
            'INSERT INTO empresas_viaje (nombre, horario, salida, llegada, duracion, precio_unitario)
             VALUES (:nombre, :horario, :salida, :llegada, :duracion, :precio)'
        );
        $st->execute([
            'nombre' => $nombre,
            'horario' => $horario !== '' ? $horario : '-',
            'salida' => $salida !== '' ? $salida : '-',
            'llegada' => $llegada !== '' ? $llegada : '-',
            'duracion' => $duracion !== '' ? $duracion : '-',
            'precio' => $precio,
        ]);
        json_out(201, ['ok' => true, 'id' => (int) db()->lastInsertId()]);
    }

    if ($method === 'PUT' || $method === 'PATCH') {
        $b = read_json_body();
        $id = isset($b['id']) ? (int) $b['id'] : 0;
        if ($id <= 0) {
            json_out(400, ['ok' => false, 'error' => 'id inválido']);
        }
        $nombre = isset($b['nombre']) ? trim((string) $b['nombre']) : '';
        $horario = isset($b['horario']) ? trim((string) $b['horario']) : '';
        $salida = isset($b['salida']) ? trim((string) $b['salida']) : '';
        $llegada = isset($b['llegada']) ? trim((string) $b['llegada']) : '';
        $duracion = isset($b['duracion']) ? trim((string) $b['duracion']) : '';
        $precio = isset($b['precio_unitario']) ? (float) $b['precio_unitario'] : 0.0;
        if ($nombre === '' || $precio <= 0) {
            json_out(400, ['ok' => false, 'error' => 'Datos incompletos']);
        }
        $st = db()->prepare(
            'UPDATE empresas_viaje SET nombre=:nombre, horario=:horario, salida=:salida, llegada=:llegada, duracion=:duracion, precio_unitario=:precio WHERE id=:id'
        );
        $st->execute([
            'id' => $id,
            'nombre' => $nombre,
            'horario' => $horario,
            'salida' => $salida,
            'llegada' => $llegada,
            'duracion' => $duracion,
            'precio' => $precio,
        ]);
        json_out(200, ['ok' => true, 'afectados' => $st->rowCount()]);
    }

    if ($method === 'DELETE') {
        $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
        if ($id <= 0) {
            json_out(400, ['ok' => false, 'error' => 'id requerido']);
        }
        $st = db()->prepare('DELETE FROM empresas_viaje WHERE id = :id');
        $st->execute(['id' => $id]);
        json_out(200, ['ok' => true, 'afectados' => $st->rowCount()]);
    }

    json_out(405, ['ok' => false, 'error' => 'Método no permitido']);
} catch (Throwable $e) {
    json_out(500, ['ok' => false, 'error' => 'Error en el servidor']);
}
