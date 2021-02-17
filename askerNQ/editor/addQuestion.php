<?php

$textQuestion = $_POST['textQuestion'];
$url = '../questions-file.json';
$json = file_get_contents($url);
$json = json_decode($json);

$array = Array (
    "questionId" => $json->countId++,
    "question" => $textQuestion,
    "answers" => Array ()
);
array_push($json->questions, $array);

$json = json_encode($json);
$bytes = file_put_contents($url, $json);
?>
