<?php
/**
 * Database Configuration
 * 
 * IMPORTANT: 
 * - For Railway/Heroku: Use environment variables
 * - For local dev: Fill in your PostgreSQL credentials
 */

// Railway/Heroku will set DATABASE_URL automatically
if (getenv('DATABASE_URL')) {
    // Parse Railway/Heroku DATABASE_URL
    $db = parse_url(getenv('DATABASE_URL'));
    
    define('DB_HOST', $db['host']);
    define('DB_PORT', $db['port'] ?? 5432);
    define('DB_NAME', ltrim($db['path'], '/'));
    define('DB_USER', $db['user']);
    define('DB_PASS', $db['pass']);
} else {
    // Local development settings
    define('DB_HOST', 'localhost');
    define('DB_PORT', 5432);
    define('DB_NAME', 'portfolio_db');
    define('DB_USER', 'postgres');
    define('DB_PASS', 'your_password_here');
}

/**
 * Get database connection
 */
function getDbConnection() {
    try {
        $dsn = sprintf(
            "pgsql:host=%s;port=%d;dbname=%s;sslmode=require",
            DB_HOST,
            DB_PORT,
            DB_NAME
        );
        
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        
        return $pdo;
    } catch (PDOException $e) {
        // Log error (don't expose to client)
        error_log("Database connection error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed']);
        exit;
    }
}

/**
 * CORS Headers
 */
function setCorsHeaders() {
    // Allow your Netlify domain
    $allowed_origins = [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://your-portfolio.netlify.app', // CHANGE THIS!
    ];
    
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
    }
    
    header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Max-Age: 3600");
    header("Content-Type: application/json; charset=UTF-8");
    
    // Handle preflight OPTIONS request
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

/**
 * Sanitize input
 */
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

/**
 * Validate email
 */
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Rate limiting (simple implementation)
 */
function checkRateLimit($ip, $limit = 5, $window = 3600) {
    // TODO: Implement with Redis or database
    // For now, just return true
    return true;
}
?>
