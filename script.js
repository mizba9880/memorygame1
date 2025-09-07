// script.js - updated with calming sounds, flip animations, win popup, celebration

const board = document.getElementById('game-board');
const restartBtn = document.getElementById('restart');

const cards = ["🐶","🐱","🦊","🐻","🐶","🐱","🦊","🐻","🐸","🐵","🐸","🐵","🐼","🐯","🐼","🐯"];
let shuffledCards = [];
let flippedCards = [];
let moves = 0;
let matches = 0;
let timer;
let seconds = 0;

// Calming sounds
const flipSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-soft-pop-2367.mp3');
const matchSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-game-ball-tap-2073.mp3');
const winSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-magic-chime-2303.mp3');

const movesDisplay = document.createElement('div');
movesDisplay.id = 'moves';
movesDisplay.style.color = '#fff';
document.body.insertBefore(movesDisplay, board);

const timerDisplay = document.createElement('div');
timerDisplay.id = 'timer';
timerDisplay.style.color = '#fff';
document.body.insertBefore(timerDisplay, board);

// Win popup
const winMessage = document.createElement('div');
winMessage.id = 'win-message';
winMessage.style.position = 'fixed';
winMessage.style.top = '50%';
winMessage.style.left = '50%';
winMessage.style.transform = 'translate(-50%, -50%)';
winMessage.style.padding = '40px';
winMessage.style.background = 'rgba(0, 0, 0, 0.8)';
winMessage.style.color = '#fff';
winMessage.style.fontSize = '24px';
winMessage.style.borderRadius = '10px';
winMessage.style.display = 'none';
document.body.appendChild(winMessage);

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createBoard() {
  clearInterval(timer);
  seconds = 0;
  moves = 0;
  matches = 0;
  winMessage.style.display = 'none';
  updateStats();
  timer = setInterval(updateTimer, 1000);
  board.innerHTML = '';
  shuffledCards = shuffle([...cards]);
  shuffledCards.forEach(symbol => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.symbol = symbol;
    card.addEventListener('click', flipCard);
    board.appendChild(card);
  });
}

function flipCard() {
  if (this.classList.contains('flipped') || flippedCards.length === 2) return;
  flipSound.play();

  this.classList.add('flipped');
  this.textContent = this.dataset.symbol;
  this.style.transform = 'rotateY(180deg)';

  flippedCards.push(this);

  if (flippedCards.length === 2) {
    moves++;
    updateStats();
    checkMatch();
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  if (card1.dataset.symbol === card2.dataset.symbol) {
    matchSound.play();
    flippedCards = [];
    matches++;
    if (matches === cards.length / 2) {
      clearInterval(timer);
      winSound.play();
      showWinMessage();
    }
  } else {
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      card1.style.transform = 'rotateY(0deg)';
      card2.style.transform = 'rotateY(0deg)';
      card1.textContent = '';
      card2.textContent = '';
      flippedCards = [];
    }, 800);
  }
}

function showWinMessage() {
  winMessage.textContent = `🎉 Congratulations! You won in ${moves} moves and ${seconds}s 🎉`;
  winMessage.style.display = 'block';
}

function updateStats() {
  movesDisplay.textContent = `Moves: ${moves}`;
}

function updateTimer() {
  seconds++;
  timerDisplay.textContent = `Time: ${seconds}s`;
}

restartBtn.addEventListener('click', createBoard);

createBoard();
