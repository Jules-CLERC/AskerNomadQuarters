<?php

$keyDepot = $_POST['keyDepot'];
$idQuestion = $_POST['idQuestion'];
$url = '../questions-file.json';
$json = file_get_contents($url);
$json = json_decode($json);

//search question by questionId
foreach ($json->questions as $question) {
    if ($question->questionId == $idQuestion) {
        break;
    }
}

$keyQuestion = array_search($question, $json->questions);
unset($json->questions[$keyQuestion]->answers[$keyDepot]);
$json->questions[$keyQuestion]->answers = array_values($json->questions[$keyQuestion]->answers);

$json = json_encode($json);
$bytes = file_put_contents($url, $json);
?>
