<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/lib/precios_cotizacion.php';

try {
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        $data = [
            'precios' => precios_servicio_cotizacion(),
            'empresas' => empresas_cotizacion_catalogo(),
        ];
        json_out(200, ['ok' => true, 'data' => $data]);
    }

    json_out(405, ['ok' => false, 'error' => 'Método no permitido']);
} catch (Throwable $e) {
    log_error('Error en precios', $e);
    json_out(500, ['ok' => false, 'error' => 'Error en el servidor']);
}
