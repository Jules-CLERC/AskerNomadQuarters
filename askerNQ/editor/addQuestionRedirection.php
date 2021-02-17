<?php

$idQuestionRedirection = $_POST['idQuestionRedirection'];
$keyAnswer = $_POST['keyAnswer'];
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
$json->questions[$keyQuestion]->answers[$keyAnswer]->questionRedirectionId = $idQuestionRedirection;

$json = json_encode($json);
$bytes = file_put_contents($url, $json);
?>
