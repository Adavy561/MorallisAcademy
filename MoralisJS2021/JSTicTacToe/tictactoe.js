const $cells = document.querySelectorAll(".js-cell");
const $next = document.querySelector(".js-next");
const $winner = document.querySelector(".js-winner");
const $reset = document.querySelector(".js-reset");

let gameBoard = new Array(9).fill(null);
let currentPlayerSymbol = "X";

for (let $cell of $cells) {
  $cell.addEventListener("click", clickHandler);
}

function clickHandler(event) {
  console.log(event.target);
  console.log(event.target.dataset.index);
    
  const moveIndex = event.target.dataset.index;

  if (gameBoard[moveIndex] === null) {
    gameBoard[moveIndex] = currentPlayerSymbol;
    event.target.innerHTML = currentPlayerSymbol;
  }

  if (hasLastMoverWon(currentPlayerSymbol, gameBoard)) {
    $winner.innerHTML = `Congratulations, ${currentPlayerSymbol} has won the game!`;
    return true;
  } else if (gameBoard.every((element) => element !== null)) {
    $winner.innerHTML = "Draw. Game Over.";
  }

  currentPlayerSymbol = currentPlayerSymbol === "X" ? "O" : "X";
  $next.innerHTML = `Next Player: ${currentPlayerSymbol}`;
}

$reset.addEventListener("click", resetHandler);

function resetHandler(event) {
  gameBoard = new Array(9).fill(null);
  $winner.innerHTML = null;
  $next.innerHTML = `Next Player: X`;
  currentPlayerSymbol = "X";
  for (let $cell of $cells) {
    $cell.innerHTML = null;
  }
}

function hasLastMoverWon(lastMove, gameBoard) {
  let winnerCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let [i1, i2, i3] of winnerCombos) {
    if (
      gameBoard[i1] === lastMove &&
      gameBoard[i1] === gameBoard[i2] &&
      gameBoard[i1] === gameBoard[i3]
    ) {
      return true;
    }
  }
  return false;
}
