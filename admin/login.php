<?php
declare(strict_types=1);

require_once __DIR__ . '/auth.php';

if (admin_is_logged()) {
    header('Location: index.php');
    exit;
}

$error = '';
$bloqueado = false;

// Rate limiting simple: máximo 5 intentos por 15 minutos
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$intentos = $_SESSION['login_intentos'] ?? 0;
$ultimo_intentos = $_SESSION['login_ultimo_intento'] ?? 0;
$tiempo_actual = time();

// Resetear contador si pasaron más de 15 minutos
if ($tiempo_actual - $ultimo_intentos > 900) {
    $_SESSION['login_intentos'] = 0;
    $intentos = 0;
}

if ($intentos >= 5) {
    $tiempo_restante = 900 - ($tiempo_actual - $ultimo_intentos);
    $minutos = ceil($tiempo_restante / 60);
    $error = "Demasiados intentos. Intenta de nuevo en {$minutos} minuto(s).";
    $bloqueado = true;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$bloqueado) {
    $user = trim($_POST['usuario'] ?? '');
    $pass = $_POST['clave'] ?? '';

    if ($user === '' || $pass === '') {
        $error = 'Completa todos los campos.';
    } elseif (admin_login($user, $pass)) {
        // Login exitoso: resetear contadores
        $_SESSION['login_intentos'] = 0;
        header('Location: index.php');
        exit;
    } else {
        // Login fallido: incrementar contador
        $_SESSION['login_intentos'] = $intentos + 1;
        $_SESSION['login_ultimo_intento'] = $tiempo_actual;
        $restantes = 5 - ($_SESSION['login_intentos']);
        if ($restantes > 0) {
            $error = "Usuario o contraseña incorrectos. Te quedan {$restantes} intento(s).";
        } else {
            $error = "Demasiados intentos fallidos. Bloqueado por 15 minutos.";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Admin — Iniciar sesión</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: Lexend, system-ui, sans-serif;
      background: #f0f2f5;
      display: flex; align-items: center; justify-content: center;
      min-height: 100vh; padding: 1rem;
    }
    .login {
      background: #fff; border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,.08);
      padding: 2.5rem 2rem; width: 100%; max-width: 380px;
    }
    .login h1 { font-size: 1.3rem; color: #1e3a5f; margin-bottom: .25rem; }
    .login p { font-size: .85rem; color: #64748b; margin-bottom: 1.5rem; }
    .login label { display: block; font-size: .8rem; color: #334155; margin-bottom: .25rem; }
    .login input {
      width: 100%; padding: .6rem .75rem; border: 1px solid #cbd5e1; border-radius: 6px;
      font-size: .9rem; margin-bottom: 1rem; outline: none; transition: border .2s;
    }
    .login input:focus { border-color: #2563eb; }
    .login button {
      width: 100%; padding: .65rem; background: #1e3a5f; color: #fff; border: none;
      border-radius: 6px; font-size: .95rem; cursor: pointer; transition: background .2s;
    }
    .login button:hover { background: #2563eb; }
    .login button:disabled { background: #94a3b8; cursor: not-allowed; }
    .login__error {
      background: #fce8e6; color: #5f1a1a; padding: .6rem .75rem; border-radius: 6px;
      font-size: .82rem; margin-bottom: 1rem;
    }
    .login__volver { display: block; text-align: center; margin-top: 1rem; font-size: .8rem; color: #64748b; }
    .login__volver a { color: #2563eb; text-decoration: none; }
  </style>
</head>
<body>
  <form class="login" method="POST" action="">
    <h1>Panel de Administración</h1>
    <p>Inicia sesión para continuar</p>

    <?php if ($error !== ''): ?>
      <div class="login__error"><?php echo htmlspecialchars($error, ENT_QUOTES, 'UTF-8'); ?></div>
    <?php endif; ?>

    <label for="usuario">Usuario</label>
    <input type="text" id="usuario" name="usuario" required autofocus
           value="<?php echo htmlspecialchars($_POST['usuario'] ?? '', ENT_QUOTES, 'UTF-8'); ?>"
           <?php echo $bloqueado ? 'disabled' : ''; ?>>

    <label for="clave">Contraseña</label>
    <input type="password" id="clave" name="clave" required
           <?php echo $bloqueado ? 'disabled' : ''; ?>>

    <button type="submit" <?php echo $bloqueado ? 'disabled' : ''; ?>>Ingresar</button>

    <div class="login__volver">
      <a href="../index.php">← Volver al sitio</a>
    </div>
  </form>
</body>
</html>
