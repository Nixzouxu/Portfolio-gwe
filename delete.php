<?php
/**
 * Delete Comment API (Admin only)
 * 
 * Endpoint: /api/delete.php
 * Method: DELETE
 * Headers: Authorization: Bearer YOUR_SECRET_KEY
 * Body: { id }
 */

require_once __DIR__ . '/config.php';

setCorsHeaders();

// Only allow DELETE requests
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Simple API key authentication
// TODO: Use environment variable in production
$api_key = getenv('ADMIN_API_KEY') ?: 'your-secret-key-here'; // CHANGE THIS!

$auth_header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
$provided_key = str_replace('Bearer ', '', $auth_header);

if ($provided_key !== $api_key) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Comment ID is required']);
        exit;
    }
    
    $id = intval($input['id']);
    
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid comment ID']);
        exit;
    }
    
    // Delete comment
    $pdo = getDbConnection();
    
    $stmt = $pdo->prepare("DELETE FROM comments WHERE id = :id");
    $stmt->execute([':id' => $id]);
    
    $deleted = $stmt->rowCount();
    
    if ($deleted > 0) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Comment deleted successfully'
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'error' => 'Comment not found'
        ]);
    }
    
} catch (Exception $e) {
    error_log("Delete comment error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to delete comment'
    ]);
}
?>
