var asker;

$(document).ready(function(){
    asker = new Asker();
});

function changeQuestion(questionRedirectionId, questionId, color) {
    asker.addAnswer(questionId, questionRedirectionId, color);
    asker.showQuestion(questionRedirectionId);
    asker.historyContainer.scrollTop = asker.historyContainer.scrollHeight;
}

function addHtmlCode(container, txt) {
    container.innerHTML = container.innerHTML + txt;
}

function test() {
    console.log("oui");
}

class Asker {

    questionsJSON;
    firstQuestionId;
    askerContainer;
    historyContainer;
    answersContainer;
    tabColors;

    constructor() {
        this.tabColors = ["answer-red", "answer-blue", "answer-green", "answer-yellow"];
        this.loadQuestionsFile();
        this.createDivs();
        this.startAsker();
    }

    createDivs() {
        this.askerContainer = $('#asker-container');
        this.askerContainer.append('<div id="history-container"></div><div id="answers-container"></div>');
        this.historyContainer = document.getElementById('history-container');
        this.answersContainer = document.getElementById('answers-container');
    }

    loadQuestionsFile() {
        //search the json file
        let self = $(this);
        $.ajax({
            async: false,
            dataType: "json",
            url: "questions-file.json",
            method: "post"
        }).done(function (data) {
            self[0].questionsJSON = data.questions;
            self[0].firstQuestionId = data.firstQuestion;
        }).fail(function () {
            alert("impossible de charger les questions pour le moment.");
        });
    }

    startAsker() {
        this.showQuestion(this.firstQuestionId);
    }

    showQuestion(questionId) {
        this.answersContainer.innerHTML = "";
        //search the question by the id
        let questionJSON = this.searchQuestion(questionId);
        if(questionJSON === undefined) {
            alert("question introuvable");
            return 0;
        }
        //display the question
        this.addQuestion(questionJSON.question);
        //display the answers
        let self = $(this);
        let color = 0;
        questionJSON.answers.forEach(function (item) {
            let inputAnswer = '<div><input class="' + self[0].tabColors[color%4] + '" onclick="changeQuestion(' + item.questionRedirectionId + ', ' + questionId + ', ' + color%4 + ')" type="button" value="' + item.answer + '"></div>';
            addHtmlCode(self[0].answersContainer, inputAnswer);
            color++;
        });
    }

    searchQuestion(questionId) {
        let questionResult;
        this.questionsJSON.forEach(function (question) {
            if (question.questionId == questionId) {
                questionResult = question;
            }
        });
        return questionResult;
    }

    searchAnswer(question, questionRedirectionId) {
        let answer;
        question.answers.forEach(function (item) {
            if (item.questionRedirectionId == questionRedirectionId) {
                answer = item;
            }
        })
        return answer;
    }

    addQuestion(questionText) {
        let question = '<div class="container asker">\n' +
            '    <img src="profil.png">' +
            '    <p>' + questionText + '</p>\n' +
            '</div>';
        addHtmlCode(this.historyContainer, question);
    }

    addAnswer(questionId, questionRedirectionId, color) {
        //search answer text
        let question = this.searchQuestion(questionId);
        let answerText = this.searchAnswer(question, questionRedirectionId).answer;

        let answer = '<div class="container answer ' + this.tabColors[color] + '">\n' +
            '    <p>' + answerText + '</p>\n' +
            '</div>';
        addHtmlCode(this.historyContainer, answer);
    }
}
