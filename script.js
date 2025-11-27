// --- Game Data (Questions) ---
const questions = [
  {
    question: "1. In Speed (1994), what happens if the bus drops below 50 mph?",
    answers: [
      { text: "It shuts down", correct: false },
      { text: "It explodes", correct: true },
      { text: "It loses power", correct: false },
      { text: "It changes direction", correct: false }
    ]
  },
  {
    question: "2. Which 1996 alien-invasion film starred Will Smith?",
    answers: [
      { text: "Men in Black", correct: false },
      { text: "Armageddon", correct: false },
      { text: "Independence Day", correct: true },
      { text: "Galaxy Quest", correct: false }
    ]
  },
  {
    question: "3. Which 1995 movie features toys that come to life when humans aren’t around?",
    answers: [
      { text: "Small Soldiers", correct: false },
      { text: "Toy Story", correct: true },
      { text: "Jumanji", correct: false },
      { text: "Casper", correct: false }
    ]
  },
  {
    question: "4. In The Bodyguard (1992), who plays the role of the bodyguard?",
    answers: [
      { text: "Kevin Costner", correct: true },
      { text: "Bruce Willis", correct: false },
      { text: "Patrick Swayze", correct: false },
      { text: "Mel Gibson", correct: false }
    ]
  },
  {
    question: "5. In The Fifth Element (1997), what is the name of the character played by Milla Jovovich?",
    answers: [
      { text: "Trinity", correct: false },
      { text: "Leeloo", correct: true },
      { text: "Korben", correct: false },
      { text: "Ripley", correct: false }
    ]
  }
];

// --- DOM Elements ---
const questionContainer = document.getElementById('question-container');
const questionText = document.getElementById('question-text');
const answerButtons = document.getElementById('answer-buttons');
const startButton = document.getElementById('start-btn');
const controlsDiv = document.getElementById('controls');
const resultsDiv = document.getElementById('results'); 
const playerNameInput = document.getElementById('player-name');
const playerStatusText = document.getElementById('player-status-text');
const individualResultDiv = document.getElementById('individual-result');
const individualName = document.getElementById('individual-name');
const individualScore = document.getElementById('individual-score');
const startNewBtn = document.getElementById('start-new-btn');
const showLeaderboardBtn = document.getElementById('show-leaderboard-btn');

// --- Game State Variables ---
let currentQuestionIndex = 0;
let score = 0;

// --- Event Listeners ---
startButton.addEventListener('click', startGame);
startNewBtn.addEventListener('click', startNewGame);
showLeaderboardBtn.addEventListener('click', displayLiveLeaderboard);


// --- Functions ---

function startGame() {
  const playerName = playerNameInput.value.trim();
  
  if (playerName === "") {
    alert("Please enter your name to start the challenge!");
    return;
  }
  
  currentQuestionIndex = 0;
  score = 0;
  
  // Hide setup elements and individual result
  individualResultDiv.classList.add('hide'); 
  resultsDiv.classList.add('hide');
  controlsDiv.classList.add('hide'); 
  playerStatusText.classList.add('hide'); 
  
  // Show game
  questionContainer.classList.remove('hide');
  
  setNextQuestion();
}

function startNewGame() {
    // Return to the initial controls screen
    individualResultDiv.classList.add('hide');
    controlsDiv.classList.remove('hide');
    playerNameInput.value = ''; 
    playerNameInput.focus();
}

function setNextQuestion() {
  resetState();
  if (currentQuestionIndex < questions.length) {
    showQuestion(questions[currentQuestionIndex]);
  } else {
    endGame();
  }
}

function showQuestion(question) {
  questionText.innerText = question.question;
  
  question.answers.forEach(answer => {
    const button = document.createElement('button');
    button.innerText = answer.text;
    button.classList.add('btn');
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener('click', selectAnswer);
    answerButtons.appendChild(button);
  });
}

function resetState() {
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

function selectAnswer(e) {
  const selectedButton = e.target;
  const isCorrect = selectedButton.dataset.correct === "true";
  
  if (isCorrect) {
    score++;
  }
  
  Array.from(answerButtons.children).forEach(button => {
    setStatusClass(button, button.dataset.correct === "true");
    button.disabled = true;
  });
  
  setTimeout(() => {
    currentQuestionIndex++;
    setNextQuestion();
  }, 1000); 
}

function setStatusClass(element, correct) {
  element.classList.remove('correct');
  element.classList.remove('wrong');
  
  if (correct) {
    element.classList.add('correct');
  }
}

function endGame() {
  const playerName = playerNameInput.value.trim();
  const total = questions.length;
  
  // Submit score to Firebase
  db.ref('scores').push({
      name: playerName,
      score: score,
      total: total,
      timestamp: firebase.database.ServerValue.TIMESTAMP
  })
  .then(() => {
      // Success is confirmed, now show local result
      console.log("Score submitted successfully!");
  })
  .catch(error => {
      console.error("Firebase error: ", error);
      // Optional: Alert player if submission failed
  });
  
  // 1. Hide the game and controls
  questionContainer.classList.add('hide');
  controlsDiv.classList.add('hide');

  // 2. Show ONLY the individual score box
  individualResultDiv.classList.remove('hide');
  individualName.innerText = playerName + "!";
  individualScore.innerText = `${score}/${total}`;
}

function displayLiveLeaderboard() {
    // Hide other elements
    individualResultDiv.classList.add('hide');
    controlsDiv.classList.add('hide');
    questionContainer.classList.add('hide');
    
    // Show loading message
    resultsDiv.classList.remove('hide');
    resultsDiv.innerHTML = '<h2>Loading Live Leaderboard...</h2>';

    // Fetch scores from Firebase
    db.ref('scores').once('value')
        .then((snapshot) => {
            const scoresObject = snapshot.val();
            if (!scoresObject) {
                resultsDiv.innerHTML = '<h2>No Scores Yet! Be the first to play!</h2><button id="return-btn" class="start-btn btn">Start Playing</button>';
                document.getElementById('return-btn').addEventListener('click', startNewGame);
                return;
            }
            
            // Convert Firebase object to array of scores and keys
            const scoresArray = Object.keys(scoresObject).map(key => ({
                id: key,
                ...scoresObject[key]
            }));
            
            // Sort players by score (highest first), then by timestamp for tie-breaker
            scoresArray.sort((a, b) => {
                if (b.score !== a.score) {
                    return b.score - a.score;
                }
                return a.timestamp - b.timestamp; 
            });

            // Generate Leaderboard HTML
            let leaderboardHTML = '<h2>Live Leaderboard 🏆</h2>';
            leaderboardHTML += '<table><thead><tr><th>Rank</th><th>Name</th><th>Score</th></tr></thead><tbody>';
            
            scoresArray.forEach((player, index) => {
                leaderboardHTML += `<tr><td>${index + 1}</td><td>${player.name}</td><td>${player.score}/${player.total}</td></tr>`;
            });
            
            leaderboardHTML += '</tbody></table>';
            // Add a button to refresh the data
            leaderboardHTML += '<button id="refresh-leaderboard-btn" class="start-btn btn" style="margin-top: 20px;">Refresh Leaderboard</button>';
            leaderboardHTML += '<button id="return-to-start-btn" class="start-btn btn" style="margin-top: 20px; margin-left: 10px;">Return to Start Screen</button>';

            resultsDiv.innerHTML = leaderboardHTML;
            document.getElementById('return-to-start-btn').addEventListener('click', startNewGame);
            document.getElementById('refresh-leaderboard-btn').addEventListener('click', displayLiveLeaderboard);
        })
        .catch(error => {
            resultsDiv.innerHTML = `<p>Error fetching leaderboard. Check console for details.</p>`;
            console.error('Firebase Fetch Error:', error);
        });
}