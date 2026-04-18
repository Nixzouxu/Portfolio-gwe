<?php
/**
 * GET Comments API
 * 
 * Endpoint: /api/comments.php
 * Method: GET
 * Returns: List of all approved comments
 */

require_once __DIR__ . '/config.php';

setCorsHeaders();

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    $pdo = getDbConnection();
    
    // Optional: Pagination
    $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
    $limit = isset($_GET['limit']) ? min(50, max(1, intval($_GET['limit']))) : 20;
    $offset = ($page - 1) * $limit;
    
    // Get total count
    $countStmt = $pdo->prepare("
        SELECT COUNT(*) as total 
        FROM comments 
        WHERE is_approved = TRUE
    ");
    $countStmt->execute();
    $total = $countStmt->fetch()['total'];
    
    // Get comments
    $stmt = $pdo->prepare("
        SELECT 
            id,
            name,
            email,
            message,
            created_at,
            TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as formatted_date
        FROM comments
        WHERE is_approved = TRUE
        ORDER BY created_at DESC
        LIMIT :limit OFFSET :offset
    ");
    
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    
    $comments = $stmt->fetchAll();
    
    // Format response
    $response = [
        'success' => true,
        'data' => $comments,
        'pagination' => [
            'total' => (int)$total,
            'page' => $page,
            'limit' => $limit,
            'pages' => ceil($total / $limit)
        ]
    ];
    
    http_response_code(200);
    echo json_encode($response);
    
} catch (Exception $e) {
    error_log("Get comments error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to fetch comments'
    ]);
}
?>
