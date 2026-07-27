<?php
declare(strict_types=1);

/**
 * Carga variables de un archivo .env en $_ENV y devuelve un array.
 */
function load_env(string $path): array
{
    if (!is_file($path)) {
        return [];
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $env = [];

    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#') {
            continue;
        }

        $pos = strpos($line, '=');
        if ($pos === false) {
            continue;
        }

        $key = trim(substr($line, 0, $pos));
        $value = trim(substr($line, $pos + 1));

        // Quitar comillas envolventes
        if (strlen($value) >= 2 && $value[0] === '"' && $value[strlen($value) - 1] === '"') {
            $value = substr($value, 1, -1);
        } elseif (strlen($value) >= 2 && $value[0] === "'" && $value[strlen($value) - 1] === "'") {
            $value = substr($value, 1, -1);
        }

        $env[$key] = $value;
        $_ENV[$key] = $value;
    }

    return $env;
}

/**
 * Obtiene una variable de entorno con valor por defecto.
 */
function env(string $key, string $default = ''): string
{
    return $_ENV[$key] ?? $default;
}
