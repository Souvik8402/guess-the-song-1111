// DOM Elements
const homeScreen = document.getElementById('home-screen');
const gameScreen = document.getElementById('game-screen');
const roomCodeInput = document.getElementById('room-code-input');
const createRoomBtn = document.getElementById('create-room-btn');
const joinRoomBtn = document.getElementById('join-room-btn');
const currentRoomCode = document.getElementById('current-room-code');
const hostControls = document.getElementById('host-controls');
const playerControls = document.getElementById('player-controls');
const songInput = document.getElementById('song-input');
const playSongBtn = document.getElementById('play-song-btn');
const guessInput = document.getElementById('guess-input');
const submitGuessBtn = document.getElementById('submit-guess-btn');
const resultDisplay = document.getElementById('result');
const scoreDisplay = document.getElementById('score');
const nextRoundBtn = document.getElementById('next-round-btn');
const leaveRoomBtn = document.getElementById('leave-room-btn');

// Game State
let isHost = false;
let currentSong = '';
let score = 0;

// Event Listeners
createRoomBtn.addEventListener('click', createRoom);
joinRoomBtn.addEventListener('click', joinRoom);
playSongBtn.addEventListener('click', playSong);
submitGuessBtn.addEventListener('click', submitGuess);
nextRoundBtn.addEventListener('click', nextRound);
leaveRoomBtn.addEventListener('click', leaveRoom);

// Functions
function createRoom() {
    const roomCode = generateRoomCode();
    currentRoomCode.textContent = roomCode;
    isHost = true;
    showGameScreen();
    hostControls.style.display = 'block';
    playerControls.style.display = 'none';
}

function joinRoom() {
    const roomCode = roomCodeInput.value.trim();
    if (roomCode) {
        currentRoomCode.textContent = roomCode;
        isHost = false;
        showGameScreen();
        hostControls.style.display = 'none';
        playerControls.style.display = 'block';
    } else {
        alert('Please enter a room code');
    }
}

function playSong() {
    currentSong = songInput.value.trim().toLowerCase();
    if (currentSong) {
        // In a real app, this would trigger audio playback
        // and send the song to other players
        alert(`Playing song: ${currentSong}`);
        songInput.value = '';
    } else {
        alert('Please enter a song name');
    }
}

function submitGuess() {
    const guess = guessInput.value.trim().toLowerCase();
    if (guess) {
        // In a real app, this would check against the actual song
        const isCorrect = guess === currentSong;
        
        if (isCorrect) {
            score += 10;
            showResult(true, 'Correct! +10 points');
        } else {
            showResult(false, 'Wrong guess. Try again!');
        }
        
        scoreDisplay.textContent = score;
        guessInput.value = '';
        
        if (isCorrect) {
            nextRoundBtn.style.display = 'block';
        }
    } else {
        alert('Please enter your guess');
    }
}

function showResult(isCorrect, message) {
    resultDisplay.textContent = message;
    resultDisplay.className = isCorrect ? 'result correct' : 'result wrong';
    resultDisplay.style.display = 'block';
}

function nextRound() {
    resultDisplay.style.display = 'none';
    nextRoundBtn.style.display = 'none';
    currentSong = '';
    
    if (isHost) {
        songInput.value = '';
    } else {
        guessInput.value = '';
    }
}

function leaveRoom() {
    showHomeScreen();
    resetGame();
}

function showGameScreen() {
    homeScreen.classList.remove('active');
    gameScreen.classList.add('active');
}

function showHomeScreen() {
    gameScreen.classList.remove('active');
    homeScreen.classList.add('active');
}

function resetGame() {
    isHost = false;
    currentSong = '';
    score = 0;
    scoreDisplay.textContent = '0';
    roomCodeInput.value = '';
    songInput.value = '';
    guessInput.value = '';
    resultDisplay.style.display = 'none';
    nextRoundBtn.style.display = 'none';
}

function generateRoomCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}