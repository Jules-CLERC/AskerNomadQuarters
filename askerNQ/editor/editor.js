var jsonFile;
var listQuestionsContainer;
var listAnswersContainer;
var questionRedirectionContainer;
var popUpContainer;
var actualQuestionId;
var actualAnswerKey;

$(document).ready(function(){
    loadQuestionsFile();
    listQuestionsContainer = new ListQuestionsContainer();
    listAnswersContainer = new  ListAnswersContainer();
    questionRedirectionContainer = new QuestionRedirectionContainer();
    popUpContainer = new PopUpContainer();
    listQuestionsContainer.showList();
});

function isEmpty( el ){
    return !$.trim(el.html())
}

function reload() {
    closePopUp();
    loadQuestionsFile();
    listQuestionsContainer.showList();
}

function closePopUp() {
    popUpContainer.hidePopUp();
}

function chooseFirstQuestion(idQuestion) {
    $.ajax({
        async: false,
        url: "chooseFirstQuestion.php",
        method: "post",
        data: { 'idQuestion': idQuestion }
    }).done(function () {
        reload();
    }).fail(function () {
        alert("impossible de choisir la question par défaut.");
    });
}

function deleteQuestionRedirection() {
    $.ajax({
        async: false,
        url: "addQuestionRedirection.php",
        method: "post",
        data: { 'idQuestionRedirection': "",'keyAnswer': actualAnswerKey, 'idQuestion': actualQuestionId }
    }).done(function () {
        reload();
        listAnswersContainer.showList(actualQuestionId);
        questionRedirectionContainer.showList(null);
    }).fail(function () {
        alert("impossible de supprimer la question de redirection.");
    });
}

function createQuestionRedirection(idQuestionRedirection) {
    $.ajax({
        async: false,
        url: "addQuestionRedirection.php",
        method: "post",
        data: { 'idQuestionRedirection': idQuestionRedirection,'keyAnswer': actualAnswerKey, 'idQuestion': actualQuestionId }
    }).done(function () {
        reload();
        listAnswersContainer.showList(actualQuestionId);
        questionRedirectionContainer.showList(idQuestionRedirection);
    }).fail(function () {
        alert("impossible de créer la question de redirection.");
    });
}

function deleteAnswer(key) {
    $.ajax({
        async: false,
        url: "deleteAnswer.php",
        method: "post",
        data: { 'keyAnswer': key, 'idQuestion': actualQuestionId }
    }).done(function () {
        reload();
        listAnswersContainer.showList(actualQuestionId);
    }).fail(function () {
        alert("impossible de supprimer la réponse.");
    });
}

function createAnswer() {
    let textArea = document.getElementById("pop-up-textarea-createAnswer").value;
    if (textArea.length === 0) {
        alert("Votre réponse ne contient aucun caractère.");
    }
    else {
        $.ajax({
            async: false,
            url: "addAnswer.php",
            method: "post",
            data: { 'textAnswer': textArea, 'questionId': actualQuestionId }
        }).done(function () {
            reload();
            listAnswersContainer.showList(actualQuestionId);
        }).fail(function () {
            alert("impossible d'ajouter la réponse.");
        });
    }
}

function deleteQuestion(id) {
    $.ajax({
        async: false,
        url: "deleteQuestion.php",
        method: "post",
        data: { 'id': id }
    }).done(function () {
        reload();
        actualQuestionId = undefined;
    }).fail(function () {
        alert("impossible de supprimer la question.");
    });
}

function createQuestion() {
    let textArea = document.getElementById("pop-up-textarea-createQuestion").value;
    if (textArea.length === 0) {
        alert("Votre question ne contient aucun caractère.");
    }
    else {
        $.ajax({
            async: false,
            url: "addQuestion.php",
            method: "post",
            data: { 'textQuestion': textArea }
        }).done(function () {
            reload();
            actualQuestionId = undefined;
        }).fail(function () {
            alert("impossible d'ajouter la question.");
        });
    }
}

function searchQuestion(questionId) {
    let questionResult;
    jsonFile.questions.forEach(function (question) {
        if (question.questionId === questionId) {
            questionResult = question;
        }
    });
    return questionResult;
}

function viewAnswers(questionId) {
    actualQuestionId = questionId;
    listAnswersContainer.showList(questionId);
}

function viewQuestionRedirection(answerKey, questionRedirectionId) {
    actualAnswerKey = answerKey;
    questionRedirectionContainer.showList(questionRedirectionId);
}

function loadQuestionsFile() {
    //search the json file
    $.ajax({
        async: false,
        dataType: "json",
        url: "../questions-file.json",
        method: "post"
    }).done(function (data) {
        jsonFile = data;
    }).fail(function () {
        alert("impossible de charger les questions pour le moment.");
    });
}

class ListQuestionsContainer {

    container;

    constructor() {
        this.container = $('#container-list-questions > .container-boxs');
    }

    showList() {
        this.container.empty();
        listAnswersContainer.container.empty();
        questionRedirectionContainer.container.empty();
        let self = $(this);
        if(jsonFile.questions.length === 0) {
            let box = $('<div class="box">\n' +
                '           <p class="box-text">Aucune question</p>\n' +
                '      </div>');
            this.container.append(box);
        }
        else {
            jsonFile.questions.forEach(function (item) {
                let box = $('<div class="box">\n' +
                    '       <div class="box-id-container">\n' +
                    '           <div><input type="button" value="supprimer" onclick="popUpContainer.showPopUpConfirmDeleteQuestion(' + item.questionId + ')"></div>\n' +
                    '           <div><p> id : ' + item.questionId + '</p></div>\n' +
                    '       </div>\n' +
                    '           <p class="box-text">' + item.question + '</p>\n' +
                    '           <input type="button" value="voir les réponses" onclick="viewAnswers(' + item.questionId + ')">\n' +
                    '      </div>');
                self[0].container.append(box);
            });
        }
    }
}

class ListAnswersContainer {
    container;

    constructor() {
        this.container = $('#container-list-answers > .container-boxs');
    }

    showList(questionId) {
        this.container.empty();
        questionRedirectionContainer.container.empty();
        let self = $(this);
        let jsonQuestion = searchQuestion(questionId);
        let key = 0;
        jsonQuestion.answers.forEach(function (item) {
            let box = $('<div class="box">\n' +
                '           <input type="button" value="supprimer" onclick="popUpContainer.showPopUpConfirmDeleteAnswer(' + key + ')">\n' +
                '           <p class="box-text">' + item.answer + '</p>\n' +
                '           <input type="button" value="voir la question de redirection" onclick="viewQuestionRedirection(' + key + ', ' + item.questionRedirectionId + ')">\n' +
                '      </div>');
            self[0].container.append(box);
            key++;
        });
        if (isEmpty(this.container)) {
            let box = $('<div class="box">\n' +
                '           <p class="box-text">Aucune réponse</p>\n' +
                '      </div>');
            self[0].container.append(box);
        }
    }
}

class QuestionRedirectionContainer {
    container;

    constructor() {
        this.container = $('#container-question-redirection > .container-boxs');
    }

    showList(questionRedirectionId) {
        this.container.empty();
        let jsonQuestion = searchQuestion(questionRedirectionId);
        if (jsonQuestion === undefined) {
            let box = $('<div class="box">\n' +
                '           <p class="box-text">Aucune question de redirection</p>\n' +
                '      </div>');
            this.container.append(box);
        }
        else {
            let box = $('<div class="box">\n' +
                '           <div class="box-id-container">\n' +
                '           <div><input type="button" value="supprimer" onclick="popUpContainer.showPopUpConfirmDeleteRedirectionQuestion()"></div>\n' +
                '           <div><p>id: ' + questionRedirectionId + '</p></div>\n' +
                '           </div>\n' +
                '           <p class="box-text">' + jsonQuestion.question + '</p>\n' +
                '      </div>');
            this.container.append(box);
        }
    }
}

class PopUpContainer {
    container;

    showPopUpChooseFirstQuestion() {
        this.showPopUp();
        let box = $('<h1> Choisir question par défaut </h1>\n' +
            '        <div id="list-questions"></div>\n' +
            '        <div id="container-pop-up-buttons">\n' +
            '            <input type="button" value="Retour" onclick="closePopUp()">\n' +
            '        </div>');
        this.container.append(box);

        let listQuestions = $('#list-questions');
        jsonFile.questions.forEach(function (item) {
            let boxQuestion = $('<div class="box">\n' +
                '<div class="box-id-container">\n' +
                '           <div><p class="box-text">' + item.question + '</p></div>\n' +
                '           <div><p>id :' + item.questionId + '</p></div>\n' +
                '</div>\n' +
                '           <input type="button" value="Sélectionner" onclick="chooseFirstQuestion(' + item.questionId + ')">\n' +
                '      </div>');
            listQuestions.append(boxQuestion);
        });
    }

    showPopUpConfirmDeleteRedirectionQuestion() {
        this.showPopUp();
        let box = $('<h1> Souhaitez-vous vraiment supprimer cette question de redirection ? </h1>\n' +
            '        <div id="container-pop-up-buttons">\n' +
            '            <input type="button" value="Valider" onclick="deleteQuestionRedirection()">\n' +
            '            <input type="button" value="Retour" onclick="closePopUp()">\n' +
            '        </div>');
        this.container.append(box);
    }

    showPopUpCreateRedirectionQuestion() {
        if (actualAnswerKey === undefined || actualQuestionId === undefined) {
            alert("vous devez sélectionner une réponse");
        }
        else {
            this.showPopUp();
            let box = $('<h1> Création d\'une question de redirection </h1>\n' +
                '        <div id="list-questions-redirection"></div>\n' +
                '        <div id="container-pop-up-buttons">\n' +
                '            <input type="button" value="Retour" onclick="closePopUp()">\n' +
                '        </div>');
            this.container.append(box);

            let listQuestionsRedirection = $('#list-questions-redirection');
            jsonFile.questions.forEach(function (item) {
                let boxQuestion = $('<div class="box">\n' +
                    '           <div>\n' +
                    '           <div><p class="box-text">' + item.question + '</p></div>\n' +
                    '           <div><p>id :' + item.questionId + '</p></div>\n' +
                    '           </div>\n' +
                    '           <input type="button" value="Sélectionner" onclick="createQuestionRedirection(' + item.questionId + ')">\n' +
                    '      </div>');
                listQuestionsRedirection.append(boxQuestion);
            });
        }
    }

    showPopUpConfirmDeleteAnswer(key) {
        this.showPopUp();
        let box = $('<h1> Souhaitez-vous vraiment supprimer cette réponse ? </h1>\n' +
            '        <div id="container-pop-up-buttons">\n' +
            '            <input type="button" value="Valider" onclick="deleteAnswer(' + key + ')">\n' +
            '            <input type="button" value="Retour" onclick="closePopUp()">\n' +
            '        </div>');
        this.container.append(box);
    }

    showPopUpCreateAnswer() {
        if (actualQuestionId === undefined) {
            alert("Vous devez sélectionner une question");
        }
        else {
            this.showPopUp();
            let box = $('<h1> Création d\'une réponse </h1>\n' +
                '        <div>\n' +
                '            <textarea id="pop-up-textarea-createAnswer"></textarea>\n' +
                '        </div>\n' +
                '        <div id="container-pop-up-buttons">\n' +
                '            <input type="button" value="Valider" onclick="createAnswer()">\n' +
                '            <input type="button" value="Retour" onclick="closePopUp()">\n' +
                '        </div>');
            this.container.append(box);
        }
    }

    showPopUpConfirmDeleteQuestion(id) {
        this.showPopUp();
        let box = $('<h1> Souhaitez-vous vraiment supprimer cette question ? </h1>\n' +
            '        <div id="container-pop-up-buttons">\n' +
            '            <input type="button" value="Valider" onclick="deleteQuestion(' + id + ')">\n' +
            '            <input type="button" value="Retour" onclick="closePopUp()">\n' +
            '        </div>');
        this.container.append(box);
    }

    showPopUpCreateQuestion() {
        this.showPopUp();
        let box = $('<h1> Création d\'une question </h1>\n' +
            '        <div>\n' +
            '            <textarea id="pop-up-textarea-createQuestion"></textarea>\n' +
            '        </div>\n' +
            '        <div id="container-pop-up-buttons">\n' +
            '            <input type="button" value="Valider" onclick="createQuestion()">\n' +
            '            <input type="button" value="Retour" onclick="closePopUp()">\n' +
            '        </div>');
        this.container.append(box);
    }

    hidePopUp() {
        this.container.empty();
        this.container[0].style.display = "none";
    }

    showPopUp() {
        this.container.empty();
        this.container[0].style.display = "block";
    }

    constructor() {
        this.container = $('#container-pop-up');
        this.hidePopUp();
    }
}
