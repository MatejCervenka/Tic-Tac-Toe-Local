let board = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',];
let currentPlayer = 'X';
let gameActive = true;

currentPlayer = returnCurrentPlayer();
let player = setCurrentPlayer();

board = initializeGame();

function setCurrentPlayer() {
    if (currentPlayer === 'X') {
        document.getElementById('player').innerText = `Player's turn: X`;
        return true;
    } else {
        document.getElementById('player').innerText = `Player's turn: O`;
        return false;
    }
}

async function handleCellClick(index) {

    /*const response = await fetch("/tile-place-request?symbol=" + symbol + "&index=" + index)

    if (response.status === 209)
    {
        updateBoard(index, symbol)
        console.log("vyhral jsem")
    }
    else if (response.status === 222)
    {
        updateBoard(index, symbol)
    }
    else if (response.status === 275)
    {
        document.getElementById('result').innerText = "It's a draw!";
    }
    if (response.status !== 410) {
        if (symbol === 'X')
            symbol = 'O';
        else
            symbol = 'X';
    }*/

    if (!gameActive || board[index] !== '') return;

    board[index] = currentPlayer;
    renderBoard();

    if (checkForWinner(board, 5, 4)) {
        document.getElementById('result').innerText = `Player ${currentPlayer} wins!`;
        gameActive = false;
        hidePlayersTurn();
    } else if (board.every(cell => cell !== '')) {
        document.getElementById('result').innerText = 'It\'s a draw!';
        gameActive = false;
    } else {
        if (currentPlayer === 'X') {
            currentPlayer = 'O';
        } else {
            currentPlayer = 'X';
        }
    }
    saveGameState(board);
    saveCurrentPlayer(currentPlayer);
}

function checkForWinner(board, size, numToWin) {
    const winningCombinations = [];

    // Check rows and columns
    for (let i = 0; i < size; i++) {
        const row = [];
        const col = [];
        for (let j = 0; j < size; j++) {
            row.push(board[i * size + j]);
            col.push(board[j * size + i]);
        }
        winningCombinations.push(row, col);
    }

    // Check diagonals
    // Main diagonals
    const diagonalSize1 = [];
    const diagonalSize2 = [];
    for (let i = 0; i < size; i++) {
        diagonalSize1.push(board[i * size + i]);
        diagonalSize2.push(board[i * size + (size - 1 - i)]);
    }
    winningCombinations.push(diagonalSize1, diagonalSize2);

    // Additional diagonals
    for (let i = 1; i < size - 1; i++) {
        const diagonalTopLeft = [];
        const diagonalTopRight = [];
        const diagonalBottomLeft = [];
        const diagonalBottomRight = [];

        for (let j = 0; j < size - i; j++) {
            diagonalTopLeft.push(board[j * size + j + i]);
            diagonalTopRight.push(board[j * size + (size - 1 - j) - i]);
            diagonalBottomLeft.push(board[(j + i) * size + j]);
            diagonalBottomRight.push(board[(j + i) * size + (size - 1 - j)]);
        }

        winningCombinations.push(diagonalTopLeft, diagonalTopRight, diagonalBottomLeft, diagonalBottomRight);
    }

    // Check for a winner
    for (const combination of winningCombinations) {
        for (let i = 0; i <= combination.length - numToWin; i++) {
            const subArray = combination.slice(i, i + numToWin);
            if (subArray.every((cell) => cell === 'X')) {
                return 'X';
            } else if (subArray.every((cell) => cell === 'O')) {
                return 'O';
            }
        }
    }
    return null;
}

function resetGame() {
    currentPlayer = 'X';
    //player = true;
    board = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
    gameActive = true;
    document.getElementById('result').innerText = '';
    showPlayersTurn();
    renderBoard();
    removeGameState();
}

function renderBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';

    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.innerText = board[i];
        cell.addEventListener('click', () => handleCellClick(i));
        boardElement.appendChild(cell);
        if (player) {
            document.getElementById('player').innerText = `Player's turn: X`;
            player = false;
        } else {
            document.getElementById('player').innerText = `Player's turn: O`;
            player = true;
        }
    }
}

/*function updateBoard(index, symbol)
{
    board[index].innerText = symbol;
}*/

// Function to initialize or retrieve the game state from local storage
function initializeGame() {
    // Try to retrieve the game state from local storage
    const storedGameState = localStorage.getItem('currentState');
    return storedGameState ? JSON.parse(storedGameState) : new Array(25).fill('');
}

function returnCurrentPlayer() {
    const storedPlayer = localStorage.getItem('currentPlayer')
    return storedPlayer ? storedPlayer : String(currentPlayer);
}

function saveCurrentPlayer(currentPlayer) {
    localStorage.setItem('currentPlayer', currentPlayer);
}

// Function to save the game state to local storage
function saveGameState(board) {
    localStorage.setItem('currentState', JSON.stringify(board));
}

function removeGameState() {
    localStorage.removeItem('currentState');
    localStorage.removeItem('currentPlayer');
}

function hidePlayersTurn() {
    let playerDiv = document.getElementById('player');
    playerDiv.style.display = 'none';
}

function showPlayersTurn() {
    let playerDiv = document.getElementById('player');
    playerDiv.style.display = 'block';
}

/*function initBoard(size)
{
    return new Array(size).fill("");
}*/

// Initial rendering of the board
renderBoard();

console.log(board);
