
class Score {
    constructor(wins, loses, unanswered) {
        this.wins = wins;
        this.loses = loses;
        this.unanswered = unanswered;
    }

    addWin() {
        this.wins++;
    }

    addLoss() {
        this.loses++;
    }

    addUnanswered() {
        this.unanswered++;
    }
}


var timerIsUp;
var isAnswered = false;
var currentQuestionIdx = 0;
var score;
var isWin = false;
var currentQuestion;
var questionLapse = 10;
var timeRemainingId;


function resestGame() {
    currentQuestionIdx = 0;
    questionLapse = 10;
    score = new Score(0, 0, 0);
    $("#playbtn").css('display', 'none');
}

function resetQuestion() {
    isWin = false;
    isAnswered = false;
    questionLapse = 10;
    $('#timer').text("Time Remaining: "+ questionLapse + " seconds");
    $('#triviaQuestion').empty();
    timeRemainingId = setInterval(count, 1000);
}

function count() {
    questionLapse--;
    $('#timer').text("Time Remaining: "+ questionLapse + " seconds");
}

function startGame() {
    resestGame();
    showQuestion();
}

function showScore() {
    resetQuestion();
    clearInterval(timeRemainingId);
    $('#timer').empty();

    var questionDiv = new $('<h5>', {
        class: 'card-title',
        id: 'scoreTxt',
        text: 'Final Score'
    });

    $('#triviaQuestion').append(questionDiv);

    var winsTxt = $('<p>', {
        id: 'wins',
        text: 'Wins: ' + score.wins
    });
    var losesTxt = $('<p>', {
        id: 'loses',
        text: 'Loses: ' + score.loses
    });
    var unansTxt = $('<p>', {
        id: 'unans',
        text: 'Unanswered: ' + score.unanswered
    });

    $('#triviaQuestion').append(winsTxt);
    $('#triviaQuestion').append(losesTxt);
    $('#triviaQuestion').append(unansTxt);

    $("#playbtn").css('display', 'block');
}

function showQuestion() {

    if(currentQuestionIdx == 10) {
        showScore();
        return;
    }

    //show current question
    currentQuestion = arrQuestions[currentQuestionIdx];
    resetQuestion();

    var questionDiv = new $('<h5>', {
        class: 'card-title',
        id: 'questionTxt',
        text: currentQuestion.question
    });

    $('#triviaQuestion').append(questionDiv);

    for (var i = 0; i < 4; i++) {

        var optionBtn = new $('<button>', {
            class: "btn btn-dark option",
            id: "#option" + i,
            value: i,
            text: currentQuestion.options[i],
            click: function () {
                isAnswered = true;
                clearInterval(timerIsUp);

                var userOption = $(this).val();

                //evaluate answer, modify score
                if (+userOption == currentQuestion.answerIndex) {
                    score.addWin();
                    isWin = true;
                    //show you win!
                } else {
                    score.addLoss();
                    isWin = false;
                    //show you loose
                }

                showAnswer();
            }
        });

        $('#triviaQuestion').append(optionBtn);

    }
    timerIsUp = setInterval(showAnswer, 10000);
}

function showAnswer() {

    clearInterval(timeRemainingId);
    //empty
    $('#triviaQuestion').empty();
    var ansText = "";
    if (!isAnswered) {
        score.addUnanswered();
        clearInterval(timerIsUp);
        ansText = "Time Is Up! The correct answer is: " +  currentQuestion.options[currentQuestion.answerIndex];
    }else if (isWin) {
        ansText = "Correct!"
    } else {
        ansText = "Incorrect! The correct answer is: " +  currentQuestion.options[currentQuestion.answerIndex];
    }

    //show correct answer - picture..
    var answerDiv = new $('<h4>', {
        class: 'card-title',
        id: 'answerTxt',
        text: ansText
    });

    var imgDiv = new $('<img>', {
        id: 'answerImg',
        src: 'assets/images/' + currentQuestion.answerImg
    });

    $('#triviaQuestion').append(answerDiv);
    $('#triviaQuestion').append(imgDiv);


    currentQuestionIdx++;
    setTimeout(showQuestion, 2000);
}


function clearView() {
    $("#playbtn").css('display', 'none');
}

$(document).ready(function () {

    clearView();
    startGame();
});


