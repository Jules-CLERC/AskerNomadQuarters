<?php

$idQuestion = $_POST['idQuestion'];
$url = '../questions-file.json';
$json = file_get_contents($url);
$json = json_decode($json);

$json->firstQuestion = $idQuestion;

$json = json_encode($json);
$bytes = file_put_contents($url, $json);
?>
