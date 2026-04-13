<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/lib/precios_cotizacion.php';

$method = $_SERVER['REQUEST_METHOD'];

function validar_cotizacion_payload(array $b): ?string
{
    $req = ['origen', 'destino', 'fecha_ida', 'pasajeros', 'servicio'];
    foreach ($req as $k) {
        if (!isset($b[$k]) || $b[$k] === '') {
            return "Campo obligatorio: {$k}";
        }
    }
    $pas = (int) $b['pasajeros'];
    if ($pas < 1 || $pas > 30) {
        return 'pasajeros debe estar entre 1 y 30';
    }
    $srv = (string) $b['servicio'];
    if (!isset(precios_servicio_cotizacion()[$srv])) {
        return 'servicio no válido';
    }
    return null;
}

try {
    if ($method === 'GET') {
        if (isset($_GET['id'])) {
            $id = (int) $_GET['id'];
            $st = db()->prepare('SELECT * FROM cotizaciones WHERE id = :id');
            $st->execute(['id' => $id]);
            $row = $st->fetch();
            if (!$row) {
                json_out(404, ['ok' => false, 'error' => 'No encontrado']);
            }
            json_out(200, ['ok' => true, 'data' => $row]);
        }
        $stmt = db()->query('SELECT * FROM cotizaciones ORDER BY creado_en DESC');
        json_out(200, ['ok' => true, 'data' => $stmt->fetchAll()]);
    }

    if ($method === 'POST') {
        $b = read_json_body();
        $err = validar_cotizacion_payload($b);
        if ($err !== null) {
            json_out(400, ['ok' => false, 'error' => $err]);
        }

        $pas = (int) $b['pasajeros'];
        $srv = (string) $b['servicio'];
        $tot = cotizacion_totales($srv, $pas);

        $fechaRegreso = null;
        if (!empty($b['fecha_regreso'])) {
            $fechaRegreso = (string) $b['fecha_regreso'];
        }

        $st = db()->prepare(
            'INSERT INTO cotizaciones (
                origen, destino, fecha_ida, fecha_regreso, pasajeros, servicio
            ) VALUES (
                :origen, :destino, :fecha_ida, :fecha_regreso, :pasajeros, :servicio
            )'
        );

        $st->execute([
            'origen' => (string) $b['origen'],
            'destino' => (string) $b['destino'],
            'fecha_ida' => (string) $b['fecha_ida'],
            'fecha_regreso' => $fechaRegreso,
            'pasajeros' => $pas,
            'servicio' => $srv,
        ]);

        $newId = (int) db()->lastInsertId();
        json_out(201, ['ok' => true, 'id' => $newId, 'calculo' => $tot]);
    }

    if ($method === 'PUT' || $method === 'PATCH') {
        $b = read_json_body();
        $id = isset($b['id']) ? (int) $b['id'] : 0;
        if ($id <= 0) {
            json_out(400, ['ok' => false, 'error' => 'id inválido']);
        }

        $err = validar_cotizacion_payload($b);
        if ($err !== null) {
            json_out(400, ['ok' => false, 'error' => $err]);
        }

        $pas = (int) $b['pasajeros'];
        $srv = (string) $b['servicio'];
        $tot = cotizacion_totales($srv, $pas);
        $fechaRegreso = !empty($b['fecha_regreso']) ? (string) $b['fecha_regreso'] : null;

        $st = db()->prepare(
            'UPDATE cotizaciones SET
                origen=:origen,
                destino=:destino,
                fecha_ida=:fecha_ida,
                fecha_regreso=:fecha_regreso,
                pasajeros=:pasajeros,
                servicio=:servicio
             WHERE id=:id'
        );

        $st->execute([
            'id' => $id,
            'origen' => (string) $b['origen'],
            'destino' => (string) $b['destino'],
            'fecha_ida' => (string) $b['fecha_ida'],
            'fecha_regreso' => $fechaRegreso,
            'pasajeros' => $pas,
            'servicio' => $srv,
        ]);

        json_out(200, ['ok' => true, 'afectados' => $st->rowCount(), 'calculo' => $tot]);
    }

    if ($method === 'DELETE') {
        $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
        if ($id <= 0) {
            json_out(400, ['ok' => false, 'error' => 'id requerido']);
        }
        $st = db()->prepare('DELETE FROM cotizaciones WHERE id = :id');
        $st->execute(['id' => $id]);
        json_out(200, ['ok' => true, 'afectados' => $st->rowCount()]);
    }

    json_out(405, ['ok' => false, 'error' => 'Método no permitido']);
} catch (Throwable $e) {
    json_out(500, ['ok' => false, 'error' => 'Error en el servidor']);
}