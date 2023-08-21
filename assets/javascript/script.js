const startButton = document.getElementById('start-button');
const viewScoresButton = document.getElementById('view-scores-button');
const timerElement = document.getElementById('timer');
const quizScreen = document.getElementById('quiz-screen');
const questionResultElement = document.getElementById('question-result');
const questionElement = document.getElementById('question');
const choicesElement = document.getElementById('choices');
const resultScreen = document.getElementById('result-screen');
const resultElement = document.getElementById('result');
const finalScoreElement = document.getElementById('final-score');
const initialsInput = document.getElementById('initials');
const submitScoreButton = document.getElementById('submit-score');
const backButton = document.getElementById('back-button');
const clearButton = document.getElementById('clear-button');
const scoreScreen = document.getElementById('score-screen');
const scoresList = document.getElementById('scores');

const questions = [
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

let currentQuestionIndex = 0;
let timeLeft = 60;
let score = 0;
let timerInterval;

startButton.addEventListener('click', startQuiz);
viewScoresButton.addEventListener('click', viewHighScores);
choicesElement.addEventListener('click', checkAnswer);
submitScoreButton.addEventListener('click', saveScore);
backButton.addEventListener('click', goBack);
clearButton.addEventListener('click', clearHighScores);

function startQuiz() {
    startButton.style.display = 'none';
    viewScoresButton.style.display = 'none'; 
    quizScreen.style.display = 'block';
    viewScoresButton.style.display = 'block'; 
    const hideOnStartElements = document.querySelectorAll('.hide-on-start');
    hideOnStartElements.forEach(element => {
        element.style.display = 'none';
    });
    showQuestion();
    startTimer();
    updateTimerDisplay();
}
function viewHighScores() {
    // Implement logic to view high scores
}

function showQuestion() {
    if (currentQuestionIndex < questions.length) {
        questionResultElement.textContent = '';
        const question = questions[currentQuestionIndex];
        questionElement.textContent = question.question;
        choicesElement.innerHTML = '';
        question.choices.forEach((choice, index) => {
            const choiceButton = document.createElement('button');
            choiceButton.textContent = choice;
            choiceButton.setAttribute('data-index', index);
            choicesElement.appendChild(choiceButton);
        });

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
    if (event.target.tagName === 'BUTTON') {
        const selectedChoiceIndex = parseInt(event.target.getAttribute('data-index'));
        const currentQuestion = questions[currentQuestionIndex];

        currentQuestion.userChoice = selectedChoiceIndex;

        if (selectedChoiceIndex === currentQuestion.correct) {
            score++;
            resultElement.textContent = 'Correct!';
        } else {
            timeLeft -= 10;
            resultElement.textContent = 'Incorrect!';
        }

        updateTimerDisplay();

        currentQuestionIndex++;
        showQuestion();
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endQuiz();
        }
    }, 1000);
}

function updateTimerDisplay() {
    timerElement.textContent = `Time: ${timeLeft}`;
}

function endQuiz() {
    clearInterval(timerInterval);
    quizScreen.style.display = 'none';
    resultScreen.style.display = 'block';
    finalScoreElement.textContent = score;
}

function saveScore() {
    const initials = initialsInput.value.trim();

    if (initials.length === 2) {
        alert(`Score saved! Initials: ${initials}, Score: ${score}`);
        // You can implement more robust storage or server logic here

        resultScreen.style.display = 'none';
        scoreScreen.style.display = 'block';
        
        showHighScores();
    } else {
        alert("Please enter exactly two initials.");
    }
}

function viewHighScores() {
    startButton.style.display = 'none';
    viewScoresButton.style.display = 'none';
    quizScreen.style.display = 'none';
    resultScreen.style.display = 'none';
    scoreScreen.style.display = 'block';
    showHighScores();
}

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

function clearHighScores() {
    // Implement logic to clear high scores
    scoresList.innerHTML = '';
}

function showHighScores() {
    // Implement logic to display high scores
    // You should retrieve high scores from storage or a server and populate the scoresList
    // Here's a placeholder example:
    scoresList.innerHTML = '<li>John - 100</li><li>Jane - 85</li><li>Bob - 70</li>';
}

