<?php
/**
 * Portfolio API - Landing Page
 * 
 * This shows available endpoints
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');

$response = [
    'status' => 'ok',
    'message' => 'Portfolio Comment API is running! ',
    'version' => '1.0.0',
    'endpoints' => [
        [
            'method' => 'GET',
            'path' => '/comments.php',
            'description' => 'Get all approved comments',
            'params' => ['page' => 'optional', 'limit' => 'optional (max 50)']
        ],
        [
            'method' => 'POST',
            'path' => '/submit.php',
            'description' => 'Submit a new comment',
            'body' => ['name' => 'required', 'email' => 'required', 'message' => 'required']
        ],
        [
            'method' => 'DELETE',
            'path' => '/delete.php',
            'description' => 'Delete a comment (admin only)',
            'headers' => ['Authorization' => 'Bearer YOUR_API_KEY'],
            'body' => ['id' => 'required']
        ]
    ],
    'database' => extension_loaded('pdo_pgsql') ? 'PostgreSQL driver loaded ✓' : 'PostgreSQL driver NOT loaded ✗',
    'php_version' => phpversion(),
    'server_time' => date('Y-m-d H:i:s')
];

echo json_encode($response, JSON_PRETTY_PRINT);
?>
