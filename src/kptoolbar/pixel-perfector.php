<?php

$locals = array('::1', '127.0.0.1', 'localhost');

if (in_array($_SERVER["REMOTE_ADDR"], $locals)) {
	$dir = __DIR__ . '/../../src/kptoolbar/uploads/pixelPerfector/';
} else {
	$dir = __DIR__ . '/uploads/pixelPerfector/';
}

$action = $_POST['action'];

if ($action == 'upload') {
	if ($_FILES['image']['error'] == UPLOAD_ERR_OK) {
		move_uploaded_file($_FILES['image']['tmp_name'], $dir . $_POST['name']);
	}
} elseif ($action == 'remove') {
	if (file_exists($dir . $_POST['name'])) {
		unlink($dir . $_POST['name']);
	}
}