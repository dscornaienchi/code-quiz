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
const clearScoresButton = document.getElementById('clear-scores');
const goBackButton = document.getElementById('go-back');

const questions = [
    {
        question: 'What does HTML stand for?',
        choices: ['Hyper Text Markup Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language'],
        correct: 0
    },
    {
        question: 'Which programming language is known as the "mother of all languages"?',
        choices: ['C', 'Python', 'Assembly Language'],
        correct: 2
    },
    {
        question: 'What does CSS stand for?',
        choices: ['Cascading Style Sheet', 'Computer Style Sheet', 'Creative Style System'],
        correct: 0
    },
    {
        question: 'Which built-in method adds one or more elements to the end of an array?',
        choices: ['push()', 'end()', 'addToEnd()'],
        correct: 0
    },
    {
        question: 'What is the primary purpose of JavaScript?',
        choices: ['Styling web pages', 'Enhancing interactivity', 'Managing databases'],
        correct: 1
    }
];

let currentQuestionIndex = 0;
let timeLeft = 60;
let score = 0;
let timerInterval;

startButton.addEventListener('click', startQuiz);
viewScoresButton.addEventListener('click', viewHighScores); // Moved viewScoresButton event listener to the top
choicesElement.addEventListener('click', checkAnswer);
submitScoreButton.addEventListener('click', saveScore);
clearScoresButton.addEventListener('click', clearScores);
goBackButton.addEventListener('click', goBack);

function startQuiz() {
    startButton.style.display = 'none';
    viewScoresButton.style.display = 'none'; // Hide the view scores button during the quiz
    quizScreen.style.display = 'block';
    viewScoresButton.style.display = 'block'; // Show the view scores button on question screens
    showQuestion();
    startTimer();
    updateTimerDisplay();
}

function viewHighScores() {
    // Implement logic to view high scores
}

function showQuestion() {
    if (currentQuestionIndex < questions.length) {
        questionResultElement.textContent = ''; // Clear previous feedback
        const question = questions[currentQuestionIndex];
        questionElement.textContent = question.question;
        choicesElement.innerHTML = '';
        question.choices.forEach((choice, index) => {
            const choiceButton = document.createElement('button');
            choiceButton.textContent = choice;
            choiceButton.setAttribute('data-index', index);
            choicesElement.appendChild(choiceButton);
        });
    } else {
        endQuiz();
    }
}

function checkAnswer(event) {
    if (event.target.tagName === 'BUTTON') {
        const selectedChoiceIndex = parseInt(event.target.getAttribute('data-index'));
        const currentQuestion = questions[currentQuestionIndex];

        if (selectedChoiceIndex === currentQuestion.correct) {
            score++;
            resultElement.textContent = 'Correct!';
            questionResultElement.textContent = 'Previous question: Correct';
        } else {
            timeLeft -= 10;
            resultElement.textContent = 'Incorrect!';
            questionResultElement.textContent = 'Previous question: Incorrect';
        }

        updateTimerDisplay();

        currentQuestionIndex++;
        showQuestion();

        currentQuestionIndex++;
        viewScoresButton.style.display = 'block'; // Show the view scores button on every question screen
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
    viewScoresButton.style.display = 'block'; // Show the view scores button on result screen
    finalScoreElement.textContent = score;

    // Display "Clear High Scores" button when entering initials
    if (initialsInput.value.trim() !== '') {
        clearScoresButton.style.display = 'block';
    }
}

function saveScore() {
    const initials = initialsInput.value.trim();

    if (initials !== '') {
        // Save the initials and score in storage or send to a server
        alert(`Score saved! Initials: ${initials}, Score: ${score}`);
        // You can implement more robust storage or server logic here
    }
}

function clearScores() {
    // Clear high scores logic
    // Implement this based on your storage or server
}

function goBack() {
    resultScreen.style.display = 'none';
    startButton.style.display = 'block';
    viewScoresButton.style.display = 'block';
    currentQuestionIndex = 0;
    timeLeft = 60;
    score = 0;
}