<?php
/**
 * Test script for api.php
 * Run with: php php/test_api.php
 */

$baseUrl = 'http://localhost:8000/api.php';
$testDiagramId = 'test_diagram_' . time();

function logTest($name, $success, $details = '') {
    $status = $success ? "PASSED" : "FAILED";
    echo "[$status] $name" . ($details ? ": $details" : "") . "\n";
}

// 1. Test Status
$statusJson = file_get_contents($baseUrl . '?action=status');
$status = json_decode($statusJson, true);
logTest("Status Check", isset($status['enabled']) && $status['enabled'] === true, "Version: " . ($status['version'] ?? 'unknown'));

// 2. Test Create
$createData = [
    'id' => $testDiagramId,
    'name' => 'Test Diagram',
    'items' => [],
    'icons' => []
];

$options = [
    'http' => [
        'method'  => 'POST',
        'header'  => "Content-Type: application/json\r\n",
        'content' => json_encode($createData)
    ]
];
$context  = stream_context_create($options);
$createResultJson = file_get_contents($baseUrl . '?action=create', false, $context);
$createResult = json_decode($createResultJson, true);
logTest("Create Diagram", ($createResult['success'] ?? false) && $createResult['id'] === $testDiagramId);

// 3. Test List
$listJson = file_get_contents($baseUrl . '?action=list');
$list = json_decode($listJson, true);
$found = false;
foreach ($list as $diagram) {
    if ($diagram['id'] === $testDiagramId) {
        $found = true;
        break;
    }
}
logTest("List Diagrams", $found);

// 4. Test Get
$getJson = file_get_contents($baseUrl . '?id=' . $testDiagramId);
$get = json_decode($getJson, true);
logTest("Get Diagram", ($get['id'] ?? '') === $testDiagramId && ($get['name'] ?? '') === 'Test Diagram');

// 5. Test Update
$updateData = $get;
$updateData['name'] = 'Updated Test Diagram';
$options['http']['method'] = 'PUT';
$options['http']['content'] = json_encode($updateData);
$context  = stream_context_create($options);
$updateResultJson = file_get_contents($baseUrl . '?id=' . $testDiagramId, false, $context);
$updateResult = json_decode($updateResultJson, true);
logTest("Update Diagram", ($updateResult['success'] ?? false));

// Verify update
$verifyJson = file_get_contents($baseUrl . '?id=' . $testDiagramId);
$verify = json_decode($verifyJson, true);
logTest("Verify Update", ($verify['name'] ?? '') === 'Updated Test Diagram');

// 6. Test Delete
$options['http']['method'] = 'DELETE';
$context  = stream_context_create($options);
$deleteResultJson = file_get_contents($baseUrl . '?id=' . $testDiagramId, false, $context);
$deleteResult = json_decode($deleteResultJson, true);
logTest("Delete Diagram", ($deleteResult['success'] ?? false));

// Verify delete
$headers = get_headers($baseUrl . '?id=' . $testDiagramId);
logTest("Verify Delete (404)", strpos($headers[0], '404') !== false);
