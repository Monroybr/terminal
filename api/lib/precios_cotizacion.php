<?php
declare(strict_types=1);

/**
 * Precios de cada servicio y catálogo de empresas.
 * NOTA: Estos datos están duplicados en src/js/cotizaciones.js (para vista previa en UI).
 * El servidor es la fuente de verdad para los cálculos.
 * Endpoint disponible: GET api/precios.php retorna este catálogo en JSON.
 */
function precios_servicio_cotizacion(): array
{
    return [
        'economico' => 40000,
        'ejecutivo' => 52000,
        'premium' => 68000,
    ];
}

function empresas_cotizacion_catalogo(): array
{
    return [
        ['nombre' => 'Cootranshuila', 'multiplicador' => 1.00],
        ['nombre' => 'Coomotor Huila', 'multiplicador' => 1.15],
        ['nombre' => 'Taxis Verdes', 'multiplicador' => 1.10],
        ['nombre' => 'Express Bolivariano', 'multiplicador' => 1.20],
        ['nombre' => 'Expreso Palmira', 'multiplicador' => 1.00],
        ['nombre' => 'Velotax', 'multiplicador' => 1.00],
    ];
}

function cotizacion_totales(string $servicio, int $pasajeros): array
{
    $map = precios_servicio_cotizacion();
    if (!isset($map[$servicio]) || $pasajeros < 1) {
        return ['subtotal' => 0.0, 'descuento_pct' => 0.0, 'total' => 0.0];
    }

    $base = $map[$servicio];
    $minSubtotal = PHP_FLOAT_MAX;

    foreach (empresas_cotizacion_catalogo() as $e) {
        $porPersona = (int) round($base * (float) $e['multiplicador']);
        $sub = $porPersona * $pasajeros;
        if ($sub < $minSubtotal) {
            $minSubtotal = $sub;
        }
    }

    if ($minSubtotal === PHP_FLOAT_MAX) {
        $minSubtotal = 0.0;
    }

    $sub = round($minSubtotal, 2);

    return [
        'subtotal' => $sub,
        'descuento_pct' => 0.0,
        'total' => $sub,
    ];
}
