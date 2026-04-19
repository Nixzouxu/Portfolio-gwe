<?php
/**
 * Submit Comment API
 * 
 * Endpoint: /api/submit.php
 * Method: POST
 * Body: { name, email, message }
 */

require_once __DIR__ . '/config.php';

setCorsHeaders();

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON']);
        exit;
    }
    
    // Validate required fields
    $required = ['name', 'email', 'message'];
    foreach ($required as $field) {
        if (empty($input[$field])) {
            http_response_code(400);
            echo json_encode(['error' => "Field '$field' is required"]);
            exit;
        }
    }
    
    // Sanitize inputs
    $name = sanitizeInput($input['name']);
    $email = sanitizeInput($input['email']);
    $message = sanitizeInput($input['message']);
    
    // Validate name length
    if (strlen($name) < 2 || strlen($name) > 100) {
        http_response_code(400);
        echo json_encode(['error' => 'Name must be between 2 and 100 characters']);
        exit;
    }
    
    // Validate email
    if (!validateEmail($email)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid email address']);
        exit;
    }
    
    // Validate message length
    if (strlen($message) < 5 || strlen($message) > 1000) {
        http_response_code(400);
        echo json_encode(['error' => 'Message must be between 5 and 1000 characters']);
        exit;
    }
    
    // Rate limiting (optional)
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    if (!checkRateLimit($ip)) {
        http_response_code(429);
        echo json_encode(['error' => 'Too many requests. Please try again later.']);
        exit;
    }
    
    // Insert comment
    $pdo = getDbConnection();
    
    $stmt = $pdo->prepare("
        INSERT INTO comments (name, email, message, ip_address, user_agent)
        VALUES (:name, :email, :message, :ip, :user_agent)
        RETURNING id, created_at
    ");
    
    $stmt->execute([
        ':name' => $name,
        ':email' => $email,
        ':message' => $message,
        ':ip' => $ip,
        ':user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
    ]);
    
    $result = $stmt->fetch();
    
    // Success response
    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Comment submitted successfully',
        'data' => [
            'id' => $result['id'],
            'created_at' => $result['created_at']
        ]
    ]);
    
} catch (PDOException $e) {
    error_log("Submit comment DB error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to submit comment'
    ]);
} catch (Exception $e) {
    error_log("Submit comment error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Server error'
    ]);
}
?>
