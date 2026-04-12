<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

function generar_numero_tiquete(PDO $pdo): string
{
    for ($i = 0; $i < 8; $i++) {
        $n = 'TKT-' . bin2hex(random_bytes(4)) . '-' . (string) random_int(100, 999);
        $st = $pdo->prepare('SELECT id FROM pedidos WHERE numero_tiquete = :n LIMIT 1');
        $st->execute(['n' => $n]);
        if (!$st->fetch()) {
            return $n;
        }
    }
    return 'TKT-' . uniqid('', true);
}

function validar_pedido(array $b): ?string
{
    $req = [
        'origen', 'destino', 'fecha_viaje', 'servicio', 'pasajeros',
        'empresa', 'horario', 'precio_unitario', 'nombre_pasajero', 'tipo_documento',
        'numero_documento', 'correo', 'telefono',
    ];
    foreach ($req as $k) {
        if (!isset($b[$k]) || $b[$k] === '') {
            return "Campo obligatorio: {$k}";
        }
    }
    $pas = (int) $b['pasajeros'];
    if ($pas < 1 || $pas > 30) {
        return 'pasajeros debe estar entre 1 y 30';
    }
    return null;
}

try {
    if ($method === 'GET') {
        if (isset($_GET['id'])) {
            $id = (int) $_GET['id'];
            $st = db()->prepare('SELECT * FROM pedidos WHERE id = :id');
            $st->execute(['id' => $id]);
            $row = $st->fetch();
            if (!$row) {
                json_out(404, ['ok' => false, 'error' => 'No encontrado']);
            }
            json_out(200, ['ok' => true, 'data' => $row]);
        }
        $stmt = db()->query('SELECT * FROM pedidos ORDER BY creado_en DESC');
        json_out(200, ['ok' => true, 'data' => $stmt->fetchAll()]);
    }

    if ($method === 'POST') {
        $b = read_json_body();
        $err = validar_pedido($b);
        if ($err !== null) {
            json_out(400, ['ok' => false, 'error' => $err]);
        }

        $pdo = db();
        $precioUnit = round((float) $b['precio_unitario'], 2);
        $pas = (int) $b['pasajeros'];
        $total = round($precioUnit * $pas, 2);
        $numero = generar_numero_tiquete($pdo);

        $st = $pdo->prepare(
            'INSERT INTO pedidos (
                numero_tiquete, origen, destino, fecha_viaje, servicio, pasajeros,
                empresa, horario, precio_unitario, descuento_porcentaje, total,
                nombre_pasajero, tipo_documento, numero_documento, correo, telefono, direccion
            ) VALUES (
                :numero, :origen, :destino, :fecha, :servicio, :pasajeros,
                :empresa, :horario, :precio_u, 0, :total,
                :nombre, :tdoc, :ndoc, :correo, :tel, :dir
            )'
        );
        $st->execute([
            'numero' => $numero,
            'origen' => (string) $b['origen'],
            'destino' => (string) $b['destino'],
            'fecha' => (string) $b['fecha_viaje'],
            'servicio' => (string) $b['servicio'],
            'pasajeros' => $pas,
            'empresa' => (string) $b['empresa'],
            'horario' => (string) $b['horario'],
            'precio_u' => $precioUnit,
            'total' => $total,
            'nombre' => (string) $b['nombre_pasajero'],
            'tdoc' => (string) $b['tipo_documento'],
            'ndoc' => (string) $b['numero_documento'],
            'correo' => (string) $b['correo'],
            'tel' => (string) $b['telefono'],
            'dir' => isset($b['direccion']) ? (string) $b['direccion'] : null,
        ]);

        json_out(201, [
            'ok' => true,
            'id' => (int) $pdo->lastInsertId(),
            'numero_tiquete' => $numero,
            'subtotal_sin_descuento' => $total,
            'descuento_porcentaje' => 0.0,
            'total' => $total,
        ]);
    }

    if ($method === 'PUT' || $method === 'PATCH') {
        $b = read_json_body();
        $id = isset($b['id']) ? (int) $b['id'] : 0;
        if ($id <= 0) {
            json_out(400, ['ok' => false, 'error' => 'id inválido']);
        }
        $err = validar_pedido($b);
        if ($err !== null) {
            json_out(400, ['ok' => false, 'error' => $err]);
        }
        $precioUnit = round((float) $b['precio_unitario'], 2);
        $pas = (int) $b['pasajeros'];
        $total = round($precioUnit * $pas, 2);

        $st = db()->prepare(
            'UPDATE pedidos SET
                origen=:origen, destino=:destino, fecha_viaje=:fecha, servicio=:servicio, pasajeros=:pasajeros,
                empresa=:empresa, horario=:horario, precio_unitario=:precio_u, descuento_porcentaje=0, total=:total,
                nombre_pasajero=:nombre, tipo_documento=:tdoc, numero_documento=:ndoc, correo=:correo, telefono=:tel, direccion=:dir
             WHERE id=:id'
        );
        $st->execute([
            'id' => $id,
            'origen' => (string) $b['origen'],
            'destino' => (string) $b['destino'],
            'fecha' => (string) $b['fecha_viaje'],
            'servicio' => (string) $b['servicio'],
            'pasajeros' => $pas,
            'empresa' => (string) $b['empresa'],
            'horario' => (string) $b['horario'],
            'precio_u' => $precioUnit,
            'total' => $total,
            'nombre' => (string) $b['nombre_pasajero'],
            'tdoc' => (string) $b['tipo_documento'],
            'ndoc' => (string) $b['numero_documento'],
            'correo' => (string) $b['correo'],
            'tel' => (string) $b['telefono'],
            'dir' => isset($b['direccion']) ? (string) $b['direccion'] : null,
        ]);
        json_out(200, ['ok' => true, 'afectados' => $st->rowCount(), 'total' => $total, 'descuento_porcentaje' => 0.0]);
    }

    if ($method === 'DELETE') {
        $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
        if ($id <= 0) {
            json_out(400, ['ok' => false, 'error' => 'id requerido']);
        }
        $st = db()->prepare('DELETE FROM pedidos WHERE id = :id');
        $st->execute(['id' => $id]);
        json_out(200, ['ok' => true, 'afectados' => $st->rowCount()]);
    }

    json_out(405, ['ok' => false, 'error' => 'Método no permitido']);
} catch (Throwable $e) {
    json_out(500, ['ok' => false, 'error' => 'Error en el servidor']);
}
