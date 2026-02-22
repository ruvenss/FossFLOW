<?php
/**
 * FossFLOW index.php
 * Serves the frontend and routes API requests to api.php if needed
 */

// If request is for api, include api.php
if (isset($_GET['action']) || isset($_GET['id'])) {
    include 'api.php';
    exit;
}

// Otherwise serve the HTML
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <link rel="icon" href="favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#2563eb" />
    <meta name="description" content="NIZU FLOW - A powerful open-source diagramming tool" />
    <title>NIZU FLOW - Isometric Diagramming Tool</title>
    
    <!-- We expect the build artifacts to be in the same directory -->
    <link rel="stylesheet" href="assets/index.css">
    
    <style>
        body { margin: 0; padding: 0; overflow: hidden; }
        #root { width: 100vw; height: 100vh; }
    </style>
</head>
<body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    
    <!-- Load bundled JS -->
    <script src="assets/index.js"></script>
</body>
</html>
