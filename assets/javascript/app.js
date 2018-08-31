/**
 * Metal-Trivica is a trivia game that will test a players knowledge of metal bands,
 * past and present
 */

// GLOBAL VARIABLES
// -------------------------------------------------->
// Quiz questions and answers -->
const quiz = [{
    question: "When did Metallica release their first album?",
    answer: "April 4, 1982",
    image: "assets/images/power-metal.jpg",
    incorrect: [
        "March 30, 1983",
        "November 6, 1983",
        "August 10, 1982"
    ]
}, {
    question: "Who was Metallica's first bass player?",
    answer: "Cliff Burton",
    image: "assets/images/cliff-burton.jpg",
    incorrect: [
        "Jason Newsted",
        "Robert Trujillo",
        "Steve Harris"
    ]
}, {
    question: "What band came out with the album, Powerslave in 1984?",
    answer: "Iron Maiden",
    image: "assets/images/iron-maiden-powerslave.jpg",
    incorrect: [
        "Black Sabbath",
        "Metallica",
        "Slayer"
    ]
}, {
    question: "Who is the lead singer for Iron Maiden",
    answer: "Bruce Dickinson",
    image: "assets/images/bruce-dickinson.png",
    incorrect: [
        "James Hetfield",
        "Paul Di' Anno",
        "Paul Day"
    ]
}, {
    question: "Metallica's song, 'The Four Horsemen' was composed by which Megadeth member?",
    answer: "Dave Mustaine",
    image: "assets/images/dave-mustaine.jpg",
    incorrect: [
        "Nick Menza",
        "Chris Poland",
        "Marty Friedman"
    ]
}, {
    question: "Megadeth's song, 'Dread and the Fugitive Mind' is on what album?",
    answer: "The World Needs a Hero",
    image: "assets/images/the-world-needs-a-hero.jpg",
    incorrect: [
        "Rust in Peace",
        "The System has Failed",
        "Killing Is My Business... and Business Is Good!"
    ]
}, {
    question: "What Metallica song was played at Cliff Burton's ceremony?",
    answer: "Orion",
    image: "assets/images/metallica-orion.jpg",
    incorrect: [
        "Fade to Black",
        "Creeping Death",
        "Welcome Home (Sanitarium)"
    ]
}],
game = {
    correctAnswers: 0,
    incorrectAnswers: 0,
    unansweredQuestions: 0,
    questionIndex: 0,
    questionTime: 30,
    intervalId: null,
    over: false,
    currentAnswer: null,
    currentImage: null
};

// DOM SELECTIONS
// -------------------------------------------------->
const gameDisplay = $(".game"),
startButton = $(".start"),
timer = $(".timer");

// FUNCTIONS
// -------------------------------------------------->
// Get random array index -->
function getRandomInd(arr) {
    return Math.floor(Math.random() * arr.length);
}

// Reset game state -->
function gameReset() {
    game.correctAnswers = 0;
    game.incorrectAnswers = 0;
    game.unansweredQuestions = 0;
    game.questionIndex = 0;
    game.currentAnswer = null;
    game.currentImage = null;
    game.intervalId = null;
    game.over = false;
}

// Check game end -->
function checkGameEnd() {
    if (game.questionIndex === quiz.length) {
        game.over = true;
    }
}

// Show game end results -->
function showGameEndResults() {
    gameDisplay.empty();
    gameDisplay.html(`
        <h3>Correct Answers: ${game.correctAnswers}</h3>
        <h3>Incorrect Answers: ${game.incorrectAnswers}</h3>
        <h3>Unanswered: ${game.unansweredQuestions}</h3>
        <button class="btn btn-lg btn-danger mt-3 play-again" type="button">Play Again</button>
    `);
}

// Randomize array order & return new array -->
function randomizeArr(arr) {
    const clone = arr.slice(0);
    let randomized = [];
    while (clone.length !== 0) {
        const randInd = getRandomInd(clone);
        randomized = randomized.concat(clone.splice(randInd, 1));
    }
    return randomized;
}

// Create & display question & answers -->
function createAndDisplay(question) {
    gameDisplay.empty();
    const $questionH3 = $(`<h3 class="mb-4 question">${question.question}</h3>`),
    $answersGroup = $("<ul class='list-group'></ul>"),
    randomIndex = getRandomInd(question.incorrect);
    answers = randomizeArr(question.incorrect);
    answers.splice(randomIndex, 0, question.answer);
    answers.forEach(answer => {
        $answersGroup.append(
            `<li class="list-group-item answer" data-answer="${answer}">${answer}</li>`
        );
    });
    gameDisplay.append($questionH3, $answersGroup);
}

// Display next question in five seconds -->
function displayQuestionInFive() {
    setTimeout(() => {
        createAndDisplay(quiz[game.questionIndex]);
        startAndUpdateTimer(game);
        game.currentAnswer = quiz[game.questionIndex].answer;
        game.currentImage = quiz[game.questionIndex].image;
        game.questionIndex += 1;
    }, 4000);
}

// Start & update timer -->
function startAndUpdateTimer() {
    game.questionTime = 30;
    timer.text(game.questionTime);
    game.intervalId = setInterval(function() {
        if (game.questionTime > 0) {
            game.questionTime -= 1;
            timer.text(game.questionTime);
        } else {
            clearInterval(game.intervalId);
            game.unansweredQuestions += 1;
            gameDisplay.empty();
            gameDisplay.html(`
                <h3 class="mb-3">Times Up!</h3>
                <img 
                    class="img-fluid rounded answer-image" 
                    src="${game.currentImage}" 
                    alt="${game.currentAnswer}" />
            `);
            checkGameEnd();
            if (!game.over) {
                displayQuestionInFive();                
            } else {
                setTimeout(showGameEndResults, 4000);
            }
        }
    }, 1000);
}

// Evaluate answer -->
function evaluateAnswer(answer) {
    let message;
    clearInterval(game.intervalId);
    if (answer === game.currentAnswer) {
        game.correctAnswers += 1;
        message = "Correct";
    } else {
        game.incorrectAnswers += 1;
        message = "Incorrect";
    }
    gameDisplay.empty();
    gameDisplay.html(`
        <h3 class="mb-3">${message}</h3>
        <img
            class="img-fluid rounded answer-image"
            src="${game.currentImage}" 
            alt="${game.currentAnswer}" />
    `);
    checkGameEnd();
    if (!game.over) {        
        displayQuestionInFive();
    } else {
        setTimeout(showGameEndResults, 4000);
    }
}

// PROCESS
// -------------------------------------------------->
// Start trivia game event -->
startButton.on("click", function(e) {
    $(this).hide();
    timer.show();
    createAndDisplay(quiz[game.questionIndex]);
    startAndUpdateTimer(game);
    game.currentAnswer = quiz[game.questionIndex].answer;
    game.currentImage = quiz[game.questionIndex].image;
    game.questionIndex += 1;
});

// Click answer event -->
gameDisplay.on("click", ".answer", function(e) {
    if (!game.over) {
        evaluateAnswer($(this).attr("data-answer"));
    }
});

// Click play again event -->
gameDisplay.on("click", ".play-again", function(e) {
    gameReset();
    createAndDisplay(quiz[game.questionIndex]);
    startAndUpdateTimer(game);
    game.currentAnswer = quiz[game.questionIndex].answer;
    game.currentImage = quiz[game.questionIndex].image;
    game.questionIndex += 1;
});
