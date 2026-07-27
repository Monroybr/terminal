<?php
declare(strict_types=1);

header('Content-Type: application/json');

use Dompdf\Dompdf;
use Dompdf\Options;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/config.php';

$config = require __DIR__ . '/config.php';

/**
 * HTML del tiquete para convertir a PDF (estilos embebidos; UTF-8 con DejaVu Sans).
 *
 * @param array<string, string> $d
 */
function html_tiquete_pdf(array $d): string
{
    $e = static function (string $s): string {
        return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    };

    return <<<HTML
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <style>
    * { box-sizing: border-box; }
    body { font-family: DejaVu Sans, sans-serif; font-size: 11pt; color: #1e293b; margin: 0; padding: 24px; }
    .header { background: #2563eb; color: #fff; padding: 16px 20px; border-radius: 8px 8px 0 0; display: table; width: 100%; }
    .header h1 { margin: 0; font-size: 18pt; }
    .header p { margin: 4px 0 0; font-size: 10pt; opacity: 0.95; }
    .header .icon { text-align: right; font-size: 20pt; vertical-align: middle; }
    .card { border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; padding: 16px 20px; }
    .row { display: table; width: 100%; margin-bottom: 14px; }
    .col { display: table-cell; width: 50%; vertical-align: top; padding-right: 12px; }
    h2 { font-size: 10pt; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin: 0 0 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
    table.fila { width: 100%; font-size: 10pt; margin-bottom: 6px; }
    table.fila td:first-child { color: #64748b; width: 38%; }
    .footer { display: table; width: 100%; margin-top: 16px; padding-top: 12px; border-top: 1px solid #e2e8f0; }
    .footer .total { display: table-cell; width: 55%; }
    .footer .total .label { font-size: 9pt; color: #64748b; margin: 0; }
    .footer .total .amount { font-size: 16pt; font-weight: bold; color: #2563eb; margin: 4px 0 0; }
    .footer .emision { display: table-cell; text-align: right; vertical-align: top; }
    .footer .emision .label { font-size: 9pt; color: #64748b; margin: 0; }
    .footer .emision .date { font-size: 10pt; margin: 4px 0 0; }
    .nota { font-size: 9pt; color: #64748b; margin-top: 14px; line-height: 1.4; }
    .numero { font-size: 9pt; margin-top: 6px; }
  </style>
</head>
<body>
  <div class="header">
    <div style="display:table-cell;width:88%;vertical-align:middle;">
      <h1>Tiquete Electrónico</h1>
      <p>Terminal Central</p>
    </div>
    <div class="icon" style="display:table-cell;">&#128196;</div>
  </div>
  <div class="card">
    <div class="row">
      <div class="col">
        <h2>Información del viaje</h2>
        <table class="fila"><tr><td>Empresa</td><td><strong>{$e($d['empresa'])}</strong></td></tr></table>
        <table class="fila"><tr><td>Origen</td><td><strong>{$e($d['origen'])}</strong></td></tr></table>
        <table class="fila"><tr><td>Destino</td><td><strong>{$e($d['destino'])}</strong></td></tr></table>
        <table class="fila"><tr><td>Fecha</td><td><strong>{$e($d['fecha'])}</strong></td></tr></table>
        <table class="fila"><tr><td>Salida</td><td><strong>{$e($d['salida'])}</strong></td></tr></table>
        <table class="fila"><tr><td>Clase</td><td><strong>{$e($d['clase'])}</strong></td></tr></table>
      </div>
      <div class="col">
        <h2>Información del pasajero</h2>
        <table class="fila"><tr><td>Nombre</td><td><strong>{$e($d['nombre'])}</strong></td></tr></table>
        <table class="fila"><tr><td>Documento</td><td><strong>{$e($d['documento'])}</strong></td></tr></table>
        <table class="fila"><tr><td>Email</td><td><strong>{$e($d['correo'])}</strong></td></tr></table>
        <table class="fila"><tr><td>Teléfono</td><td><strong>{$e($d['telefono'])}</strong></td></tr></table>
        <table class="fila"><tr><td>N° Pasajeros</td><td><strong>{$e($d['pasajeros'])}</strong></td></tr></table>
      </div>
    </div>
    <div class="footer">
      <div class="total">
        <p class="label">Total pagado</p>
        <p class="amount">{$e($d['total_fmt'])}</p>
      </div>
      <div class="emision">
        <p class="label">Fecha de emisión</p>
        <p class="date">{$e($d['fecha_emision'])}</p>
      </div>
    </div>
    <p class="nota">Presenta este tiquete en el terminal 30 minutos antes de la salida.</p>
    <p class="numero"><strong>Número de tiquete:</strong> {$e($d['numero_tiquete'])}</p>
  </div>
</body>
</html>
HTML;
}

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
$documento = trim((string)($data['documento'] ?? ''));
$telefono = trim((string)($data['telefono'] ?? ''));
$fecha_emision = trim((string)($data['fecha_emision'] ?? ''));

if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['ok' => false, 'error' => 'Correo inválido']);
    exit;
}

$mail = new PHPMailer(true);
$tmpPdf = null;

try {
    $mail->isSMTP();
    $mail->Host = $config['smtp']['host'];
    $mail->SMTPAuth = true;

    $mail->Username = $config['smtp']['user'];
    $mail->Password = $config['smtp']['pass'];

    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = $config['smtp']['port'];
    $mail->CharSet = 'UTF-8';

    $mail->setFrom($config['smtp']['from'], $config['smtp']['from_name']);
    $mail->addAddress($correo, $nombre);

    $mail->isHTML(true);
    $mail->Subject = "Tiquete Electrónico - {$numero}";

    $e = static function (string $s): string {
        return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    };

    $mail->Body = "
        <h2>Tiquete Electrónico - Terminal</h2>
        <p>Hola <strong>{$e($nombre)}</strong>, tu compra fue realizada correctamente.</p>

        <h3>Información del viaje</h3>
        <p><strong>Número de tiquete:</strong> {$e($numero)}</p>
        <p><strong>Empresa:</strong> {$e($empresa)}</p>
        <p><strong>Ruta:</strong> {$e($origen)} → {$e($destino)}</p>
        <p><strong>Fecha:</strong> {$e($fecha)}</p>
        <p><strong>Salida:</strong> {$e($salida)}</p>
        <p><strong>Clase:</strong> {$e($clase)}</p>
        <p><strong>Pasajeros:</strong> {$e($pasajeros)}</p>
        <p><strong>Total pagado:</strong> $ " . number_format($total, 0, ',', '.') . "</p>

        <hr>
        <p>Presenta este tiquete en el terminal 30 minutos antes de la salida.</p>
        <p>Gracias por comprar en Terminal.</p>
    ";

    $mail->AltBody = "Tiquete {$numero}. Ruta {$origen} a {$destino}. Fecha {$fecha}. Salida {$salida}. Total {$total}.";

    $total_fmt = '$ ' . number_format($total, 0, ',', '.');
    $pdfPayload = [
        'nombre' => $nombre,
        'numero_tiquete' => $numero,
        'empresa' => $empresa,
        'origen' => $origen,
        'destino' => $destino,
        'fecha' => $fecha,
        'salida' => $salida,
        'clase' => $clase,
        'pasajeros' => $pasajeros,
        'correo' => $correo,
        'documento' => $documento !== '' ? $documento : '-',
        'telefono' => $telefono !== '' ? $telefono : '-',
        'fecha_emision' => $fecha_emision !== '' ? $fecha_emision : '-',
        'total_fmt' => $total_fmt,
    ];

    $options = new Options();
    $options->set('isRemoteEnabled', false);
    $options->set('defaultFont', 'DejaVu Sans');

    $dompdf = new Dompdf($options);
    $dompdf->loadHtml(html_tiquete_pdf($pdfPayload));
    $dompdf->setPaper('A4', 'portrait');
    $dompdf->render();
    $pdfBinary = $dompdf->output();
    if (!is_string($pdfBinary) || $pdfBinary === '') {
        throw new \RuntimeException('No se pudo generar el PDF del tiquete.');
    }

    $tmpPdf = tempnam(sys_get_temp_dir(), 'tktpdf');
    if ($tmpPdf === false || file_put_contents($tmpPdf, $pdfBinary) === false) {
        throw new \RuntimeException('No se pudo preparar el archivo PDF.');
    }

    $adjuntoNombre = 'Tiquete-' . preg_replace('/[^A-Za-z0-9._-]+/', '-', $numero) . '.pdf';
    $mail->addAttachment($tmpPdf, $adjuntoNombre, PHPMailer::ENCODING_BASE64, 'application/pdf');

    $mail->send();

    echo json_encode(['ok' => true]);
} catch (Exception $e) {
    $detalle = $mail->ErrorInfo !== '' ? $mail->ErrorInfo : $e->getMessage();
    echo json_encode([
        'ok' => false,
        'error' => 'No se pudo enviar el correo: ' . $detalle
    ], JSON_UNESCAPED_UNICODE);
} finally {
    if (is_string($tmpPdf) && $tmpPdf !== '' && is_file($tmpPdf)) {
        @unlink($tmpPdf);
    }
}