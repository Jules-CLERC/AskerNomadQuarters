<?php

$textDepot = $_POST['textDepot'];
$questionId = $_POST['questionId'];
$url = '../questions-file.json';
$json = file_get_contents($url);
$json = json_decode($json);

$array = Array (
    "depot" => $textDepot,
    "questionRedirectionId" => ""
);

foreach ($json->questions as $question) {
    if ($question->questionId == $questionId) {
        break;
    }
}

$key = array_search($question, $json->questions);

array_push($json->questions[$key]->answers, $array);

$json = json_encode($json);
$bytes = file_put_contents($url, $json);
?>
