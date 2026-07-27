<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_out(405, ['ok' => false, 'error' => 'Método no permitido']);
}

$q = isset($_GET['q']) ? sanitize_input($_GET['q'], 100) : '';
$destino = isset($_GET['destino']) ? sanitize_input($_GET['destino'], 100) : '';

/** Normaliza para buscar "bogota" y encontrar "Bogotá" */
function normalizar_busqueda(string $s): string
{
    $from = ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ', 'Á', 'É', 'Í', 'Ó', 'Ú', 'Ü', 'Ñ'];
    $to = ['a', 'e', 'i', 'o', 'u', 'u', 'n', 'a', 'e', 'i', 'o', 'u', 'u', 'n'];
    return mb_strtolower(str_replace($from, $to, $s));
}

try {
    $sql = 'SELECT id, destino, hora_salida, hora_llegada, empresa, plataforma, estado
            FROM horarios_salida WHERE 1=1';
    $params = [];

    if ($destino !== '') {
        $sql .= ' AND destino = :destino';
        $params['destino'] = $destino;
    }

    $sql .= ' ORDER BY hora_salida ASC, destino ASC';

    $st = db()->prepare($sql);
    $st->execute($params);
    $rows = $st->fetchAll();

    if ($q !== '') {
        $nq = normalizar_busqueda($q);
        $rows = array_values(array_filter(
            $rows,
            static function (array $r) use ($nq): bool {
                return str_contains(normalizar_busqueda((string) $r['destino']), $nq)
                    || str_contains(normalizar_busqueda((string) $r['empresa']), $nq);
            }
        ));
    }

    json_out(200, ['ok' => true, 'data' => $rows]);
} catch (Throwable $e) {
    log_error('Error en horarios', $e);
    json_out(500, ['ok' => false, 'error' => 'Error en el servidor']);
}
