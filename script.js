const questions = [
  {
    question: "1. Which actress starred as Sarah Connor in Terminator 2: Judgment Day (1991)?",
    answers: [
      { text: "Sigourney Weaver", correct: false },
      { text: "Linda Hamilton", correct: true },
      { text: "Jamie Lee Curtis", correct: false },
      { text: "Sharon Stone", correct: false }
    ]
  },
  {
    question: "2. In Men in Black (1997), what is Agent K's (Tommy Lee Jones) civilian name?",
    answers: [
      { text: "Kevin Brown", correct: true },
      { text: "Kayle Johnson", correct: false },
      { text: "Kevin Flynn", correct: false },
      { text: "Will Smith", correct: false }
    ]
  },
  {
    question: "3. In Pulp Fiction (1994), what does Vincent Vega stab Mia Wallace with to revive her?",
    answers: [
      { text: "A Syringe", correct: false },
      { text: "An Epinephrine Pen", correct: true },
      { text: "A Knife", correct: false },
      { text: "A Corkscrew", correct: false }
    ]
  },
  {
    question: "4. Which action star played the title character in the film Demolition Man (1993)?",
    answers: [
      { text: "Arnold Schwarzenegger", correct: false },
      { text: "Jean-Claude Van Damme", correct: false },
      { text: "Sylvester Stallone", correct: true },
      { text: "Bruce Willis", correct: false }
    ]
  },
  {
    question: "5. What is the name of the main computer virus that infects the alien ships in Independence Day (1996)?",
    answers: [
      { text: "The Morpheus virus", correct: false },
      { text: "A computer virus", correct: true },
      { text: "Cyberdyne", correct: false },
      { text: "Skynet", correct: false }
    ]
  },
  {
    question: "6. Which popular animated Disney film released in 1994 features the song 'Can You Feel the Love Tonight'?",
    answers: [
      { text: "Aladdin", correct: false },
      { text: "Pocahontas", correct: false },
      { text: "The Lion King", correct: true },
      { text: "Beauty and the Beast", correct: false }
    ]
  },
  {
    question: "7. The movie Face/Off (1997) features which two actors swapping identities?",
    answers: [
      { text: "Brad Pitt and Edward Norton", correct: false },
      { text: "Tom Cruise and Brad Pitt", correct: false },
      { text: "John Travolta and Nicolas Cage", correct: true },
      { text: "Harrison Ford and Gary Oldman", correct: false }
    ]
  },
  {
    question: "8. What iconic prop does Tom Hanks' character retrieve from the water in Forrest Gump (1994)?",
    answers: [
      { text: "A Box of Chocolates", correct: false },
      { text: "A feather", correct: true },
      { text: "His running shoes", correct: false },
      { text: "A Vietnam War medal", correct: false }
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
      console.error("Firebase write error: ", error);
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
                // If database is empty, display message instead of hanging
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
            // Add buttons
            leaderboardHTML += '<button id="refresh-leaderboard-btn" class="start-btn btn" style="margin-top: 20px;">Refresh Leaderboard</button>';
            leaderboardHTML += '<button id="return-to-start-btn" class="start-btn btn" style="margin-top: 20px; margin-left: 10px;">Return to Start Screen</button>';

            resultsDiv.innerHTML = leaderboardHTML;
            document.getElementById('return-to-start-btn').addEventListener('click', startNewGame);
            document.getElementById('refresh-leaderboard-btn').addEventListener('click', displayLiveLeaderboard);
        })
        .catch(error => {
            // Log error if fetch fails for any reason
            resultsDiv.innerHTML = `<p>Error fetching leaderboard. Check console for network errors.</p>`;
            console.error('Firebase Fetch Error: ', error);
        });
}
