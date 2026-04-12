<?php
/**
 * Ajusta host, usuario y contraseña según tu instalación (XAMPP/WAMP: suele ser root sin contraseña).
 */
declare(strict_types=1);

return [
    'db' => [
        'host' => '127.0.0.1',
        'port' => '3306',
        'name' => 'terminal',
        'user' => 'root',
        'pass' => '',
        'charset' => 'utf8mb4',
    ],
];
