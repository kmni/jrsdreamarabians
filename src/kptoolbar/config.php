<?php

$locals = array('::1', '127.0.0.1', 'localhost');

if (in_array($_SERVER["REMOTE_ADDR"], $locals)) {
	$file = __DIR__ . '/../../src/kptoolbar/uploads/config/config.json';
} else {
	$file = __DIR__ . '/uploads/config/config.json';
}

$action = $_POST['action'];

if ($action == 'save') {
	file_put_contents($file, $_POST['config']);
} elseif ($action == 'load') {
	if (file_exists($file)) {
		echo file_get_contents($file);
	} else {
		echo '{}';
	}
}
