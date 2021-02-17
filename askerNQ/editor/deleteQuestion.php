<?php

$idQuestion = $_POST['id'];
$url = '../questions-file.json';
$json = file_get_contents($url);
$json = json_decode($json);

foreach ($json->questions as $question) {
    if ($question->questionId == $idQuestion) {
        break;
    }
}

$key = array_search($question, $json->questions);
unset($json->questions[$key]);
$json->questions = array_values($json->questions);

$json = json_encode($json);
$bytes = file_put_contents($url, $json);

?>
