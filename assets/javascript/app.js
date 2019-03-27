
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

var questionLapse;
var timerIsUp;
var timeRemainingId;
var isAnswered = false;
var isWin = false;
var score;
var currentQuestionIdx = 0;
var currentQuestion;


function resestGame() {
    currentQuestionIdx = 0;
    score = new Score(0, 0, 0);
    $("#playbtn").css('display', 'none');
}

function resetQuestion() {
    isWin = false;
    isAnswered = false;
    questionLapse = 15;
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

    var btnGroup = new $('<div>', {
        class: 'btn-group-vertical'
    });
    $('#triviaQuestion').append(btnGroup);

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
                    // you win!
                } else {
                    score.addLoss();
                    isWin = false;
                    // you loose
                }

                showAnswer();
            }
        });

        btnGroup.append(optionBtn);

    }
    timerIsUp = setInterval(showAnswer, questionLapse*1000);
}

function showAnswer() {

    clearInterval(timeRemainingId);
    //clean question
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


$(document).ready(function () {
    startGame();
});


