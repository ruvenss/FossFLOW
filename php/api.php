<?php
/**
 * FossFLOW PHP API
 * Replicates the functionality of fossflow-backend/server.js
 */

// Configuration
$STORAGE_ENABLED = true;
$STORAGE_PATH = __DIR__ . '/diagrams';
$ENABLE_GIT_BACKUP = false; // Not implemented yet

// CORS Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

// Handle OPTIONS request for CORS preflight
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

// Get action and ID from query string or path
$action = $_GET['action'] ?? '';
$id = $_GET['id'] ?? '';

// Basic routing based on request method and action
$method = $_SERVER['REQUEST_METHOD'];

// Health check / Storage status
if ($action === 'status') {
    echo json_encode([
        'enabled' => $STORAGE_ENABLED,
        'gitBackup' => $ENABLE_GIT_BACKUP,
        'version' => '1.0.0-php'
    ]);
    exit;
}

if (!$STORAGE_ENABLED) {
    http_response_code(503);
    echo json_encode(['error' => 'Server storage is disabled']);
    exit;
}

// Ensure storage directory exists
if (!is_dir($STORAGE_PATH)) {
    mkdir($STORAGE_PATH, 0777, true);
}

try {
    switch ($method) {
        case 'GET':
            if ($action === 'list' || ($action === '' && !$id)) {
                // List diagrams
                $diagrams = [];
                $files = scandir($STORAGE_PATH);
                foreach ($files as $file) {
                    if (str_ends_with($file, '.json') && $file !== 'metadata.json') {
                        $filePath = $STORAGE_PATH . '/' . $file;
                        $content = file_get_contents($filePath);
                        $data = json_decode($content, true);
                        
                        $name = $data['name'] ?? $data['title'] ?? 'Untitled Diagram';
                        
                        $diagrams[] = [
                            'id' => str_replace('.json', '', $file),
                            'name' => $name,
                            'lastModified' => date('c', filemtime($filePath)),
                            'size' => filesize($filePath)
                        ];
                    }
                }
                echo json_encode($diagrams);
            } elseif ($id) {
                // Get specific diagram
                $filePath = $STORAGE_PATH . '/' . $id . '.json';
                if (file_exists($filePath)) {
                    echo file_get_contents($filePath);
                } else {
                    http_response_code(404);
                    echo json_encode(['error' => 'Diagram not found']);
                }
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Missing ID or action']);
            }
            break;

        case 'PUT':
        case 'POST':
            if ($action === 'create' || ($method === 'POST' && !$id && $action !== 'delete')) {
                // Create new diagram
                $input = file_get_contents('php://input');
                $data = json_decode($input, true);
                $newId = $data['id'] ?? 'diagram_' . time();
                $filePath = $STORAGE_PATH . '/' . $newId . '.json';
                
                if (file_exists($filePath)) {
                    http_response_code(409);
                    echo json_encode(['error' => 'Diagram already exists']);
                    exit;
                }
                
                $data['id'] = $newId;
                $data['created'] = date('c');
                $data['lastModified'] = date('c');
                
                file_put_contents($filePath, json_encode($data, JSON_PRETTY_PRINT));
                http_response_code(201);
                echo json_encode(['success' => true, 'id' => $newId]);
            } elseif ($id) {
                if ($action === 'delete' || ($method === 'POST' && isset($_GET['delete']))) {
                    // Delete diagram
                    $filePath = $STORAGE_PATH . '/' . $id . '.json';
                    if (file_exists($filePath)) {
                        unlink($filePath);
                        echo json_encode(['success' => true]);
                    } else {
                        http_response_code(404);
                        echo json_encode(['error' => 'Diagram not found']);
                    }
                } else {
                    // Save or update diagram
                    $filePath = $STORAGE_PATH . '/' . $id . '.json';
                    $input = file_get_contents('php://input');
                    $data = json_decode($input, true);
                    
                    $data['id'] = $id;
                    $data['lastModified'] = date('c');
                    
                    file_put_contents($filePath, json_encode($data, JSON_PRETTY_PRINT));
                    echo json_encode(['success' => true, 'id' => $id]);
                }
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Missing ID or action']);
            }
            break;

        case 'DELETE':
            if ($id) {
                $filePath = $STORAGE_PATH . '/' . $id . '.json';
                if (file_exists($filePath)) {
                    unlink($filePath);
                    echo json_encode(['success' => true]);
                } else {
                    http_response_code(404);
                    echo json_encode(['error' => 'Diagram not found']);
                }
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Missing ID']);
            }
            break;

        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error', 'details' => $e->getMessage()]);
}
