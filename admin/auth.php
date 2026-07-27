<?php
declare(strict_types=1);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/../api/env_loader.php';
load_env(__DIR__ . '/../api/.env');

function admin_login(string $usuario, string $clave): bool
{
    $cfg_user = $_ENV['ADMIN_USER'] ?? 'admin';
    $cfg_pass = $_ENV['ADMIN_PASS'] ?? 'admin123';

    if (hash_equals($cfg_user, $usuario) && hash_equals($cfg_pass, $clave)) {
        $_SESSION['admin_logged'] = true;
        $_SESSION['admin_user']   = $usuario;
        session_regenerate_id(true);
        return true;
    }

    return false;
}

function admin_logout(): void
{
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $p = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $p['path'], $p['domain'], $p['secure'], $p['httponly']
        );
    }
    session_destroy();
}

function admin_is_logged(): bool
{
    return !empty($_SESSION['admin_logged']);
}

function admin_require_login(): void
{
    if (!admin_is_logged()) {
        header('Location: login.php');
        exit;
    }
}
