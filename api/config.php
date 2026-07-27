<?php
declare(strict_types=1);

require_once __DIR__ . '/env_loader.php';

load_env(__DIR__ . '/.env');

return [
    'db' => [
        'host'    => env('DB_HOST', '127.0.0.1'),
        'port'    => env('DB_PORT', '3306'),
        'name'    => env('DB_NAME', 'terminal'),
        'user'    => env('DB_USER', 'root'),
        'pass'    => env('DB_PASS', ''),
        'charset' => env('DB_CHARSET', 'utf8mb4'),
    ],
    'smtp' => [
        'host'       => env('SMTP_HOST', 'smtp.gmail.com'),
        'port'       => (int) env('SMTP_PORT', '587'),
        'user'       => env('SMTP_USER', ''),
        'pass'       => env('SMTP_PASS', ''),
        'from'       => env('SMTP_FROM', ''),
        'from_name'  => env('SMTP_FROM_NAME', 'Terminal'),
    ],
];
