<?php
declare(strict_types=1);

header('Content-Type: application/json');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/../vendor/autoload.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['ok' => false, 'error' => 'Datos inválidos']);
    exit;
}

$correo = trim($data['correo'] ?? '');
$nombre = trim($data['nombre'] ?? '');
$numero = trim($data['numero_tiquete'] ?? '');
$empresa = trim($data['empresa'] ?? '');
$origen = trim($data['origen'] ?? '');
$destino = trim($data['destino'] ?? '');
$fecha = trim($data['fecha'] ?? '');
$salida = trim($data['salida'] ?? '');
$clase = trim($data['clase'] ?? '');
$pasajeros = trim((string)($data['pasajeros'] ?? ''));
$total = (float)($data['total'] ?? 0);

if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['ok' => false, 'error' => 'Correo inválido']);
    exit;
}

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;

    $mail->Username = 'liseth052009@gmail.com';
    $mail->Password = 'cocy afkt wais ajiq';

    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;
    $mail->CharSet = 'UTF-8';

    $mail->setFrom('liseth052009@gmail.com', 'Terminal');
    $mail->addAddress($correo, $nombre);

    $mail->isHTML(true);
    $mail->Subject = "Tiquete Electrónico - {$numero}";

    $mail->Body = "
        <h2>Tiquete Electrónico - Terminal</h2>
        <p>Hola <strong>{$nombre}</strong>, tu compra fue realizada correctamente.</p>

        <h3>Información del viaje</h3>
        <p><strong>Número de tiquete:</strong> {$numero}</p>
        <p><strong>Empresa:</strong> {$empresa}</p>
        <p><strong>Ruta:</strong> {$origen} → {$destino}</p>
        <p><strong>Fecha:</strong> {$fecha}</p>
        <p><strong>Salida:</strong> {$salida}</p>
        <p><strong>Clase:</strong> {$clase}</p>
        <p><strong>Pasajeros:</strong> {$pasajeros}</p>
        <p><strong>Total pagado:</strong> $ " . number_format($total, 0, ',', '.') . "</p>

        <hr>
        <p>Presenta este tiquete en el terminal 30 minutos antes de la salida.</p>
        <p>Gracias por comprar en Terminal.</p>
    ";

    $mail->AltBody = "Tiquete {$numero}. Ruta {$origen} a {$destino}. Fecha {$fecha}. Salida {$salida}. Total {$total}.";

    $mail->send();

    echo json_encode(['ok' => true]);
} catch (Exception $e) {
    echo json_encode([
        'ok' => false,
        'error' => 'No se pudo enviar el correo: ' . $mail->ErrorInfo
    ]);
}