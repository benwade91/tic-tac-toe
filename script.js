var gameBoard;
const player = 'X';
const computer = 'O';
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]
const cells = document.querySelectorAll('.cell');

const startGame = () => {
    document.querySelector('.endGame').style.display = 'none';
    gameBoard = Array.from(Array(9).keys());
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false)
    }
}

const turnClick = (square) => {
    if (typeof gameBoard[square.target.id] === 'number') {
        turn(square.target.id, player);
        !checkTie() && turn(bestSpot(), computer)
        // if (!checkWin(gameBoard, player) && !checkTie()) turn(bestSpot(), computer);
    }
}

const turn = (square, whosTurn) => {
    gameBoard[square] = whosTurn;
    document.getElementById(square).innerText = whosTurn;
    document.getElementById(square).style.cursor = 'unset';
    let gameWon = checkWin(gameBoard, whosTurn);
    (gameWon) && gameOver(gameWon);
}

const checkWin = (board, whosTurn) => {
    let plays = board.reduce((a, e, i) =>
		(e === whosTurn) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: whosTurn};
			break;
		}
	}
	return gameWon;
}

const gameOver = (gameWon) => {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == player ? "blue" : "red";
	}
	for (let i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWin(gameWon.player == player ? "You win!" : "You lose.");
}

const emptySquares = () => {
    return gameBoard.filter(x => typeof x == 'number')
}

const bestSpot = () => {
    return miniMax(gameBoard, computer).index;
}

const checkTie = () => {
    if (emptySquares().length == 0) {
        cells.forEach(cell => {
            cell.style.backgroundColor = 'yellow';
            cell.removeEventListener('click', turnClick, false)
        })
        declareWin('Tie Game!')
        return true;
    }
}
const declareWin = (who) => {
    document.querySelector('.endGame').innerText = who;
    document.querySelector('.endGame').style.display = 'flex';
}

const miniMax = (newBoard, who) => {
    var availSpots = emptySquares();
    
	if (checkWin(newBoard, player)) {
		return {score: -10};
	} else if (checkWin(newBoard, computer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
    var moves = [];
    for (let i = 0; i < availSpots.length; i++) {
        var move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = who;

        if (who == computer) {
            let result = miniMax(newBoard, player);
            move.score = result.score;
        } else {
            let result = miniMax(newBoard, computer);
            move.score = result.score;
        }

        newBoard[availSpots[i]] = move.index;

        moves.push(move);
    }
    var bestMove;
    if (who === computer) {
        var bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove]
}
startGame();