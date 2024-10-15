let currentQuestion = 0;
let userAnswers = [];
let timer;
let countdown = 30;
let quizData = [];

async function loadQuizData() {
    try {
        const response = await fetch('posts.json');
        quizData = await response.json();
        quizData = quizData.slice(0,10);
        loadQuestion();
    } catch (error) {
        console.error("Veri yüklenirken hata oluştu:", error);
    }
}

function parseOptions(body) {
    return body.split('\n');
}

function loadQuestion() {
    const questionElement = document.getElementById("questions");
    const optionsElement = document.getElementById("options");
    const timerElement = document.getElementById("timer");

    const currentData = quizData[currentQuestion];

    questionElement.innerText = currentData.title;
    optionsElement.innerHTML = "";

    const options = parseOptions(currentData.body);

    options.forEach(option => {
        const button = document.createElement("button");
        button.innerText = option;
        button.onclick = () => selectAnswer(option);
        button.disabled = true; 
        optionsElement.appendChild(button);
    });

   
    countdown = 40;
    timerElement.innerText = `Kalan Süre: ${countdown} saniye`;

    clearInterval(timer);
    timer = setInterval(updateTimer, 1000);

    setTimeout(() => {
        document.querySelectorAll("#options button").forEach(button => (button.disabled = false));
    }, 10000);
}

function updateTimer() {
    countdown--;
    document.getElementById("timer").innerText = `Kalan Süre: ${countdown} saniye`;

    if (countdown === 0) {
        clearInterval(timer);
        nextQuestion();
    }
}

function selectAnswer(answer) {
    const correctAnswer = quizData[currentQuestion].body.split('\n')[0]; 
    userAnswers.push({
        question: quizData[currentQuestion].title,
        answer,
        isCorrect: answer === correctAnswer
    });
    nextQuestion();
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    const resultElement = document.querySelector(".results");
    resultElement.innerHTML = `
        <h2>Sonuçlar</h2>
        <table>
            <tr><th>Soru</th><th>Cevabınız</th><th>Doğru Mu?</th></tr>
            ${userAnswers.map(answer => `
                <tr>
                    <td>${answer.question}</td>
                    <td>${answer.answer}</td>
                    <td>${answer.isCorrect ? "✔️" : "❌"}</td>
                </tr>
            `).join('')}
        </table>
    `;
    resultElement.style.display = "block";
}

loadQuizData();
