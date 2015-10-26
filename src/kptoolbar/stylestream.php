<?php

$styleDir = __DIR__ . '/../css/';

header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');

ini_set("max_execution_time", 60);

function sendMessage($id, $name, $styles) {
	echo 'retry: 1000' . PHP_EOL;
	echo 'id: $id' . PHP_EOL;
	echo 'data: {' . "\n";
	echo 'data: "styles": ' . json_encode($styles) . ", \n";
	echo 'data: "hash": ' . json_encode(md5($styles)) . ", \n";
	echo 'data: "id": ' . $id . ", \n";
	echo 'data: "name": "' . $name . "\" \n";
	echo 'data: }' . "\n";
	echo PHP_EOL;
	ob_flush();
	flush();
}

function rewriteUrl($source, $path) {
	$source = preg_replace_callback('~url\\(("|\')?([^\)"\']+)("|\')?\\)~', function($matches) use ($path) {
		$url = $matches[2];
		
		if (substr($url, 0, 4) != 'http' && substr($url, 0, 1) != '/') {
			return "url('" . $path . '/' . $url . "')";
		} else {
			return $matches[0];
		}
	}, $source);
	
	return $source;
}

$id = time();

$sheetsInput = $_GET['sheets'];
$sheets = array();

foreach ($sheetsInput as $s) {
	$name = basename($s);
	if (file_exists($styleDir . $name)) {
		$sheets[] = array(
			'href' => $s,
			'name' => $name,
			'lastModification' => 0,
			'lastSize' => 0
		);
	}
}

do {
	clearstatcache();
	
	foreach ($sheets as $index => $sheet) {
		$stats = stat($styleDir . $sheet['name']);
		if ($stats['size'] != $sheet['lastSize'] || $stats['mtime'] != $sheet['lastModification']) {
			sendMessage($id, $sheet['name'], rewriteUrl(file_get_contents($styleDir . $sheet['name']), dirname($sheet['href'])));
			$sheets[$index]['lastModification'] = $stats['mtime'];
			$sheets[$index]['lastSize'] = $stats['size'];
		}
	}
	
	usleep(500000); //0.5 s
} while (true);
