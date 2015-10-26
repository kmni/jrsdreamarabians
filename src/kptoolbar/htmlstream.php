<?php

$scriptDir = __DIR__ . '/../';

header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');

ini_set("max_execution_time", 60);

function sendMessage($id, $html) {
	echo 'retry: 1000' . PHP_EOL;
	echo 'id: $id' . PHP_EOL;
	echo 'data: {' . "\n";
	echo 'data: "html": ' . json_encode($html) . ", \n";
	echo 'data: "hash": ' . json_encode(md5($html)) . ", \n";
	echo 'data: "id": ' . $id . " \n";
	echo 'data: }' . "\n";
	echo PHP_EOL;
	ob_flush();
	flush();
}

function addIncludes($script, &$scripts) {
	preg_match_all('~(include|require)(_once)? [\'"]([^\'"]+)[\'"]~', $script, $matches);
	foreach ($matches[3] as $path) {
		$scripts[] = $path;
	}
}

$id = time();

$mainScript = $_GET['script'];
$fullScript = $_GET['fullscript'];
if ($mainScript == '') {
	if (file_exists($scriptDir . 'index.php')) {
		$mainScript = 'index.php';
	} elseif (file_exists($scriptDir . 'index.html')) {
		$mainScript = 'index.html';
	}
}

if (file_exists($scriptDir . $mainScript)) {
	$scriptsPath = array($mainScript);
	
	addIncludes(file_get_contents($scriptDir . $mainScript), $scriptsPath);
}

$scriptsPath = array_unique($scriptsPath);

$scripts = array();
foreach ($scriptsPath as $scriptPath) {
	$scripts[] = array(
		'name' => $scriptPath,
		'lastModification' => 0,
		'lastSize' => 0
	);
}

//var_dump($scripts);

do {
	clearstatcache();
	
	$sendMessage = FALSE;
	foreach ($scripts as $index => $script) {
		$stats = stat($scriptDir . $script['name']);
		if ($stats['size'] != $script['lastSize'] || $stats['mtime'] != $script['lastModification']) {
			$sendMessage = TRUE;
			$scripts[$index]['lastModification'] = $stats['mtime'];
			$scripts[$index]['lastSize'] = $stats['size'];
		}
	}
	
	if ($sendMessage) {
		//get HTML
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $fullScript);
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$html = curl_exec($ch);
		curl_close($ch);
		
		//remove header
		$html = substr($html, strpos($html, '</head>') + 7);
		
		//remove closing html tag
		$html = substr($html, 0, strpos($html, '</html>'));
		
		//remove white spaces
		$html = trim($html);
		
//		//replace body with div
//		$html = preg_replace(array('~<body[^>]*>~', '~</body>~'), array('<div>', '</div>'), $html);
		
		//remove body
		$html = preg_replace(array('~<body[^>]*>~', '~</body>~'), array('', ''), $html);
		
		//TODO: remove useless white spaces inside string
		
		sendMessage($id, $html);
	}
	
	usleep(500000); //0.5 s
} while (true);
