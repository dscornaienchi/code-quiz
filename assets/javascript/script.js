
// Get references to various DOM elements
var startButton = document.getElementById('start-button');
var viewScoresButton = document.getElementById('view-scores-button');
var timerElement = document.getElementById('timer');
var quizScreen = document.getElementById('quiz-screen');
var questionResultElement = document.getElementById('question-result');
var questionElement = document.getElementById('question');
var choicesElement = document.getElementById('choices');
var resultScreen = document.getElementById('result-screen');
var resultElement = document.getElementById('result');
var finalScoreElement = document.getElementById('final-score');
var initialsInput = document.getElementById('initials');
var submitScoreButton = document.getElementById('submit-score');
var backButton = document.getElementById('back-button');
var clearButton = document.getElementById('clear-button');
var scoreScreen = document.getElementById('score-screen');
var scoresList = document.getElementById('scores');

// Define the quiz questions with their choices and correct answers
var questions = [
    {
        question: 'Which of the following is NOT a valid way to comment in JavaScript?',
        choices: ['// Single-line comment', '/* Multi-line comment /', '<!-- Comment -->', '/* JSDoc-style comment */'],
        correct: 2
    },
    {
        question: 'Which property is used in CSS to control the spacing between element content and their border?',
        choices: ['Margin', 'Padding', 'Border-spacing', 'Gap'],
        correct: 1
    },
    {
        question: 'Which of the following is used to declare a variable in JavaScript?',
        choices: ['vble', 'vari', 'let', 'varia'],
        correct: 2
    },
    {
        question: 'Which HTML element is used to link an external CSS file to an HTML document?',
        choices: ['<link>', '<style>', '<css>', '<external>'],
        correct: 0
    },
];

//Initialize global variables
let currentQuestionIndex = 0;
let timeLeft = 60;
let score = 0;
let timerInterval;
let highScores =[];

// add event listeners to buttons and elements so clicking them calls a function
startButton.addEventListener('click', startQuiz);
viewScoresButton.addEventListener('click', viewHighScores);
choicesElement.addEventListener('click', checkAnswer);
submitScoreButton.addEventListener('click', saveScore);
backButton.addEventListener('click', goBack);
clearButton.addEventListener('click', clearHighScores);

function startQuiz() {
    // Hides Start quiz button
    startButton.style.display = 'none';
    // Display the questions once quiz starts 
    quizScreen.style.display = 'block';
    // Hides "Coding Quiz Challenge" and instructions
    const hideOnStartElements = document.querySelectorAll('.hide-on-start');
    hideOnStartElements.forEach(element => {
        element.style.display = 'none';
    });
    // Functions to run once startQuiz is called by the event listener
    startTimer();
    updateTimerDisplay();
    showQuestion();
}

function startTimer() {
    //interval that decrements the time left variable every second
    timerInterval = setInterval(() => {
        timeLeft--;
    // if the time reaches or goes below zero, the interval timer is stopped and the quiz ends
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endQuiz();
        }
    // timer goes every 1000 milliseconds, aka 1 second 
    }, 1000);
}

function updateTimerDisplay() {
    //shows how much time remains by using a DOM element and then inserting the timeLeft variable
    timerElement.textContent = `Time: ${timeLeft}`;
}

function showQuestion() {
    //if the current question index is lesss than the number of questions, code in the block will execute 
    if (currentQuestionIndex < questions.length) {
        // question result element is cleared to remove previous question results 
        questionResultElement.textContent = '';
        // current question retrieved from the questions array using the index, and the text is displayed using question.element, with the previous choices being cleared with choicesElement
        const question = questions[currentQuestionIndex];
        questionElement.textContent = question.question;
        choicesElement.innerHTML = '';
        // for each choice, a new button element is created, the text content is set to choice text, and the data-index attribute is added to associate the choice with its index. created buttons are appended to display on the screen
        question.choices.forEach((choice, index) => {
            const choiceButton = document.createElement('button');
            choiceButton.textContent = choice;
            choiceButton.setAttribute('data-index', index);
            choicesElement.appendChild(choiceButton);
        });
        // If 
        if (currentQuestionIndex > 0) {
            const previousQuestion = questions[currentQuestionIndex - 1];
            const previousQuestionResult = previousQuestion.correct === previousQuestion.userChoice ? 'Correct' : 'Incorrect';
            questionResultElement.textContent = `Previous question: ${previousQuestionResult}`;
        }
    } else {
        endQuiz();
    }
}

function checkAnswer(event) {
    //if a choice button is clicked, retrieve the selected choice from the data-index attribute. 
    if (event.target.tagName === 'BUTTON') {
        const selectedChoiceIndex = parseInt(event.target.getAttribute('data-index'));
        //retrieve the current question using the currentQuestionIndex and store the user's choice in the current question object 
        const currentQuestion = questions[currentQuestionIndex];
        currentQuestion.userChoice = selectedChoiceIndex;
        // if the selected choice index matches the correct answer index of the current question, mark as correct. if not, mark as incorrect and deduct 10 seconds from the timer 
        if (selectedChoiceIndex === currentQuestion.correct) {
            score++;
            resultElement.textContent = 'Correct!';
        } else {
            timeLeft -= 10;
            resultElement.textContent = 'Incorrect!';
        }
        //update timer, move on to next question, and show the next question
        updateTimerDisplay();
        currentQuestionIndex++;
        showQuestion();
    }
}

// when endQuiz runs, clear the timer, remove the quizScreen, display the resultScreen, and display the final score element
function endQuiz() {
    clearInterval(timerInterval);
    quizScreen.style.display = 'none';
    resultScreen.style.display = 'block';
    finalScoreElement.textContent = score;
}


function saveScore() {
    //add the enterted initials as the variable value
    const initials = initialsInput.value.trim();
    // if the initials length is equal to 2, this runs, if not, an alert is displayed to only enter two initials
    if (initials.length === 2) {
        // create a newScore object that contains initials and score
        const newScore = { initials, score};
        // add new score to high scores array, sorting them in descending order based on score, and storing them in local storage as a JSON string. Display an alert confirming score is saved, then hide the result screen and bring up the score screen. Lastly, the updated list of high scores is displayed on the score screen
        highScores.push(newScore);
        highScores.sort((a, b) => b.score - a.score);
        localStorage.setItem('highScores',JSON.stringify(highScores));
        alert(`Score saved! Initials: ${initials}, Score: ${score}`);
        resultScreen.style.display = 'none';
        scoreScreen.style.display = 'block';
        showHighScores();
    } else {
        alert("Please enter exactly two initials.");
    }
}

//When the High Scores button is clicked, start button, view scores button, quiz screen, and result screen are removed. Score screen is displayed, and the high scores are shown
function viewHighScores() {
    startButton.style.display = 'none';
    viewScoresButton.style.display = 'none';
    quizScreen.style.display = 'none';
    resultScreen.style.display = 'none';
    scoreScreen.style.display = 'block';
    showHighScores();
}

function showHighScores() {
    // Clear the content of the scoresList element first, then retrieve the stored high scores from local storage 
    scoresList.innerHTML = '';
    const storedScores = localStorage.getItem('highScores');
    //If there are stored scores, parse the JSON string to convert it into an array of high score objects, parsing storedScores and assigning to the highScores array 
    if (storedScores) {
        highScores = JSON.parse(storedScores);
        // for each entry, create a new list item and assign to the variable scoreItem, using textContent to display as initials then score, appending the scoresList to scoreItem variable
        highScores.forEach(entry => {
            const scoreItem = document.createElement('li');
            scoreItem.textContent = `${entry.initials} - ${entry.score}`;
            scoresList.appendChild(scoreItem);
        });
    }
}

//if the clear high scores button is clicked, clear highScores array, remove highScores from local storage, and clear displayed scores
function clearHighScores() {
    highScores = [];
    localStorage.removeItem('highScores');
    scoresList.innerHTML = '';
}

// if the go back button is clicked, remove scoreScreen, resultScreen, and QuizScreen. Display the start button and view scores button, bring back the high on start elements (title and welcome paragraph), display as a block, and reset the variables. Also show the timer display. 
function goBack() {
    scoreScreen.style.display = 'none';
    resultScreen.style.display = 'none';
    quizScreen.style.display = 'none';
    startButton.style.display = 'block';
    viewScoresButton.style.display = 'block';
    const hideOnStartElements = document.querySelectorAll('.hide-on-start');
    hideOnStartElements.forEach(element => {
        element.style.display = 'block';
    });
    currentQuestionIndex = 0;
    timeLeft = 60;
    score = 0;
    updateTimerDisplay();
}