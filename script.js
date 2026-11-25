
const animals = [
    { name: "Cat", meaning: "猫", emoji: "🐱", sentence: "I see a cat." },
    { name: "Dog", meaning: "狗", emoji: "🐶", sentence: "I see a dog." },
    { name: "Rabbit", meaning: "兔子", emoji: "🐰", sentence: "The rabbit jumps." },
    { name: "Elephant", meaning: "大象", emoji: "🐘", sentence: "The elephant is big." },
    { name: "Lion", meaning: "狮子", emoji: "🦁", sentence: "The lion roars." },
    { name: "Monkey", meaning: "猴子", emoji: "🐵", sentence: "The monkey eats." },
    { name: "Bear", meaning: "熊", emoji: "🐻", sentence: "The bear is brown." },
    { name: "Duck", meaning: "鸭子", emoji: "🦆", sentence: "The duck swims." },
    { name: "Frog", meaning: "青蛙", emoji: "🐸", sentence: "The frog jumps." },
    { name: "Fish", meaning: "鱼", emoji: "🐟", sentence: "The fish swims." }
];


// Play real animal sounds
let currentSound = null;

function playAnimalSound(animalName) {

    if (currentSound) {
        currentSound.pause();
        currentSound.currentTime = 0;
    }

    currentSound = new Audio(
        `sounds/${animalName.toLowerCase()}.mp3`
    );

    currentSound.play().catch(error => {
        console.log("Audio error:", error);
    });
}

// Pronounce English words
function speakWord(word) {

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(word);

    speech.lang = "en-US";
    speech.rate = 0.85;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
}


const fruits = [
    { name: "Apple", meaning: "苹果", emoji: "🍎", sentence: "I like apples." },
    { name: "Banana", meaning: "香蕉", emoji: "🍌", sentence: "The banana is yellow." },
    { name: "Orange", meaning: "橙子", emoji: "🍊", sentence: "I eat an orange." },
    { name: "Strawberry", meaning: "草莓", emoji: "🍓", sentence: "The strawberry is red." },
    { name: "Grapes", meaning: "葡萄", emoji: "🍇", sentence: "I like grapes." },
    { name: "Watermelon", meaning: "西瓜", emoji: "🍉", sentence: "The watermelon is big." }
];

const objects = [
    { name: "Book", meaning: "书本", emoji: "📚", sentence: "This is a book." },
    { name: "Bag", meaning: "书包", emoji: "🎒", sentence: "This is my bag." },
    { name: "Pencil", meaning: "铅笔", emoji: "✏️", sentence: "I have a pencil." },
    { name: "Chair", meaning: "椅子", emoji: "🪑", sentence: "This is a chair." },
    { name: "Clock", meaning: "时钟", emoji: "🕒", sentence: "Look at the clock." },
    { name: "Ball", meaning: "球", emoji: "⚽", sentence: "I have a ball." }
];



// Display vocabulary cards
function displayWords(items, containerId) {

    const container = document.getElementById(containerId);

    container.innerHTML = items.map(item => `
        <div class="word-card">

            <div class="emoji">${item.emoji}</div>

            <h3>${item.name}</h3>

            <p class="meaning">${item.meaning}</p>

            <p class="sentence">${item.sentence}</p>

            ${containerId === "animal-list" ? `
                <div class="sound-buttons">

                    ${item.name !== "Fish" ? `
                        <button class="sound-button"
                            onclick="playAnimalSound('${item.name}')">
                            🔊 Hear Animal Sound
                        </button>
                    ` : ""}

                    <button class="word-button"
                        onclick="speakWord('${item.name}')">
                        🗣️ Say the Word
                    </button>

                </div>
            ` : ""}

        </div>
    `).join("");
}


displayWords(animals, "animal-list");
displayWords(fruits, "fruit-list");
displayWords(objects, "object-list");



// Matching Game
let selectedAnimal = null;
let matchedAnimals = [];

function startMatching() {
    selectedAnimal = null;
    matchedAnimals = [];

    const gameArea = document.getElementById("game-area");

    const shuffledAnimals = [...animals.slice(0, 5)]
        .sort(() => Math.random() - 0.5);

    const shuffledNames = [...shuffledAnimals]
        .sort(() => Math.random() - 0.5);

    gameArea.innerHTML = `
        <h3>🧩 Match the Animals!</h3>
        <p>Click an animal picture, then click its English name.</p>

        <div class="match-grid">
            ${shuffledAnimals.map(animal => `
                <button class="match-item"
                    data-type="picture"
                    data-name="${animal.name}"
                    onclick="selectMatch(this)">
                    ${animal.emoji}
                </button>
            `).join("")}

            ${shuffledNames.map(animal => `
                <button class="match-item"
                    data-type="word"
                    data-name="${animal.name}"
                    onclick="selectMatch(this)">
                    ${animal.name}
                </button>
            `).join("")}
        </div>

        <p id="match-feedback" style="margin-top:18px;">
            Let's play!
        </p>
    `;
}

function selectMatch(button) {
    if (button.classList.contains("matched")) return;

    if (!selectedAnimal) {
        if (button.dataset.type !== "picture") {
            document.getElementById("match-feedback").textContent =
                "Choose an animal picture first! 🐾";
            return;
        }

        selectedAnimal = button;
        button.classList.add("selected");
        return;
    }

    if (button === selectedAnimal) return;

    if (button.dataset.type === "picture") {
        selectedAnimal.classList.remove("selected");
        selectedAnimal = button;
        button.classList.add("selected");
        return;
    }

    const picture = selectedAnimal;
    const word = button;

    if (picture.dataset.name === word.dataset.name) {
        picture.classList.remove("selected");
        picture.classList.add("matched");
        word.classList.add("matched");

        matchedAnimals.push(picture.dataset.name);
        selectedAnimal = null;

        document.getElementById("match-feedback").textContent =
            "Correct! Well done! 🎉";

        if (matchedAnimals.length === 5) {
            document.getElementById("match-feedback").textContent =
                "Amazing! You matched all 5 animals! 🌟";
        }
    } else {
        picture.classList.remove("selected");
        selectedAnimal = null;

        document.getElementById("match-feedback").textContent =
            "Good try! Let's try again! 💪";
    }
}

/* Sound Matching Game */

const soundAnimals = animals.filter(
    animal => animal.name !== "Fish"
);

let soundQuestion = 0;
let soundScore = 0;
let currentSoundAnswer = null;
let soundOptions = [];

function startSoundMatching() {

    soundQuestion = 0;
    soundScore = 0;

    showSoundQuestion();
}

function showSoundQuestion() {

    const gameArea = document.getElementById("game-area");

    if (soundQuestion >= 5) {

        gameArea.innerHTML = `
            <h3>🎉 Sound Matching Completed!</h3>

            <h2>
                You got ${soundScore} out of 5!
            </h2>

            <p>
                ${soundScore === 5
                    ? "Amazing! You know all the animal sounds! 🌟"
                    : "Well done! Keep practising! 💖"}
            </p>

            <button class="game-button"
                onclick="startSoundMatching()">
                Play Again 🔊
            </button>
        `;

        return;
    }

    const correctAnimal =
        soundAnimals[Math.floor(Math.random() * soundAnimals.length)];

    currentSoundAnswer = correctAnimal.name;

    const wrongAnimals = soundAnimals
        .filter(animal => animal.name !== correctAnimal.name)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);

    soundOptions = [correctAnimal, ...wrongAnimals]
        .sort(() => Math.random() - 0.5);

    gameArea.innerHTML = `
        <h3>🔊 Sound Matching</h3>

        <p>Question ${soundQuestion + 1} of 5</p>

        <h2>🐾 Guess the Animal!</h2>

        <button class="game-button"
            onclick="playSoundQuestion()">
            🔊 Play Animal Sound
        </button>

        <div class="sound-match-options">

            ${soundOptions.map(animal => `
                <button class="quiz-option"
                    onclick="answerSoundQuestion('${animal.name}')">

                    ${animal.emoji}
                    ${animal.name}

                </button>
            `).join("")}

        </div>

        <p id="sound-feedback"></p>
    `;

    playSoundQuestion();
}

function playSoundQuestion() {
    playAnimalSound(currentSoundAnswer);
}

function answerSoundQuestion(answer) {

    const buttons = document.querySelectorAll(
        ".sound-match-options .quiz-option"
    );

    buttons.forEach(button => button.disabled = true);

    const feedback = document.getElementById("sound-feedback");

    if (answer === currentSoundAnswer) {

        soundScore++;

        feedback.textContent =
            "Correct! Great listening! 🎉";

    } else {

        feedback.textContent =
            `Good try! It was ${currentSoundAnswer}! 💖`;
    }

    const nextButton = document.createElement("button");

    nextButton.className = "game-button";
    nextButton.textContent = "Next Question ➜";

    nextButton.style.marginTop = "15px";

    nextButton.onclick = () => {

        soundQuestion++;

        showSoundQuestion();
    };

    feedback.after(nextButton);
}


// Animal Quiz
const questions = [
    {
        question: "Which animal says Meow?",
        options: ["Dog", "Cat", "Duck"],
        answer: "Cat"
    },
    {
        question: "Which animal has a long trunk?",
        options: ["Elephant", "Lion", "Rabbit"],
        answer: "Elephant"
    },
    {
        question: "Which animal likes bananas?",
        options: ["Fish", "Bear", "Monkey"],
        answer: "Monkey"
    },
    {
        question: "Which animal jumps and says Ribbit?",
        options: ["Frog", "Cat", "Dog"],
        answer: "Frog"
    },
    {
        question: "Which animal says Quack?",
        options: ["Lion", "Duck", "Rabbit"],
        answer: "Duck"
    }
];

let currentQuestion = 0;
let quizScore = 0;

function startQuiz() {
    currentQuestion = 0;
    quizScore = 0;
    showQuestion();
}

function showQuestion() {
    const gameArea = document.getElementById("game-area");

    if (currentQuestion >= questions.length) {
        gameArea.innerHTML = `
            <h3>🎉 Quiz Completed!</h3>
            <p>You got ${quizScore} out of ${questions.length} correct!</p>
            <h2>${quizScore === 5 ? "Excellent! 🌟" : "Well Done! 💖"}</h2>
            <button class="game-button" onclick="startQuiz()">
                Try Again
            </button>
        `;
        return;
    }

    const q = questions[currentQuestion];

    gameArea.innerHTML = `
        <h3>❓ Animal Quiz</h3>
        <p>Question ${currentQuestion + 1} of ${questions.length}</p>
        <h3 style="margin:20px 0;">${q.question}</h3>

        ${q.options.map(option => `
            <button class="quiz-option"
                onclick="answerQuestion('${option}')">
                ${option}
            </button>
        `).join("")}

        <p id="quiz-feedback" style="margin-top:18px;"></p>
    `;
}

function answerQuestion(answer) {
    const q = questions[currentQuestion];
    const buttons = document.querySelectorAll(".quiz-option");

    buttons.forEach(button => button.disabled = true);

    const feedback = document.getElementById("quiz-feedback");

    if (answer === q.answer) {
        quizScore++;
        feedback.textContent = "Excellent! That's right! 🎉";
    } else {
        feedback.textContent = "Good try! The answer is " +
            q.answer + ". 💖";
    }

    const nextButton = document.createElement("button");
    nextButton.className = "game-button";
    nextButton.textContent = "Next Question ➜";
    nextButton.style.marginTop = "15px";
    nextButton.onclick = () => {
        currentQuestion++;
        showQuestion();
    };

    feedback.after(nextButton);
}
