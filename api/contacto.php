<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'POST') {
        $b = read_json_body();

        $nombre = trim((string) ($b['nombre'] ?? ''));
        $email = trim((string) ($b['email'] ?? ''));
        $telefono = trim((string) ($b['telefono'] ?? ''));
        $asunto = trim((string) ($b['asunto'] ?? ''));
        $mensaje = trim((string) ($b['mensaje'] ?? ''));

        if ($nombre === '' || $email === '' || $asunto === '' || $mensaje === '') {
            json_out(400, ['ok' => false, 'error' => 'Todos los campos son obligatorios.']);
        }

        if (strlen($nombre) < 3 || strlen($nombre) > 100) {
            json_out(400, ['ok' => false, 'error' => 'El nombre debe tener entre 3 y 100 caracteres.']);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            json_out(400, ['ok' => false, 'error' => 'El correo electrónico no es válido.']);
        }

        if ($telefono !== '' && !preg_match('/^[0-9]{10}$/', $telefono)) {
            json_out(400, ['ok' => false, 'error' => 'El teléfono debe tener exactamente 10 dígitos.']);
        }

        if (strlen($asunto) < 3 || strlen($asunto) > 100) {
            json_out(400, ['ok' => false, 'error' => 'El asunto debe tener entre 3 y 100 caracteres.']);
        }

        if (strlen($mensaje) < 10 || strlen($mensaje) > 500) {
            json_out(400, ['ok' => false, 'error' => 'El mensaje debe tener entre 10 y 500 caracteres.']);
        }

        log_error("Contacto recibido: {$nombre} ({$email}) - {$asunto}");

        json_out(200, ['ok' => true, 'mensaje' => 'Mensaje recibido correctamente.']);
    }

    json_out(405, ['ok' => false, 'error' => 'Método no permitido']);
} catch (Throwable $e) {
    log_error('Error en contacto', $e);
    json_out(500, ['ok' => false, 'error' => 'Error en el servidor']);
}
