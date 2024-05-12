function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const markBoard = (row, column, playerPiece) => {
        if (board[row - 1][column - 1].getValue() === "") {
            board[row - 1][column - 1].setPiece(playerPiece);
            return 0;
        
        } else {
            return 1;
        }
    }

    const printBoard = () => {
        const boardWithCellValues = board.map((rows) => rows.map((cell) => cell.getValue()))
    }

    return {
        getBoard,
        markBoard,
        printBoard
    };
}


function Cell() {
    let value = "";

    const setPiece = (playerPiece) => {
        value = playerPiece;
    }

    const getValue = () => value;

    return {
        setPiece,
        getValue
    };
}


function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {
    const consoleBoard = Gameboard();
    const board = consoleBoard.getBoard();
    const boardDiv = document.querySelector("#board");
    let filledCells = 0;

    const players = [
        {
            name: playerOneName,
            piece: "o"
        },
        {
            name: playerTwoName,
            piece: "x"
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        consoleBoard.printBoard();
    }

    const playRound = (row, column) => {
        const markedBoard = consoleBoard.markBoard(row, column, getActivePlayer().piece);

        if (markedBoard === 0) {
            const gameWon = checkWin();
            if (gameWon) {
                endGame();
                return;
            }
            checkDraw();
            switchPlayerTurn();
            printNewRound();
        
        } else {
            printNewRound();
        }
    }

    const checkWin = () => {
        
        const winningCombinations = [
            // Horizontal combinations
            [[0, 0], [0, 1], [0, 2]],
            [[1, 0], [1, 1], [1, 2]],
            [[2, 0], [2, 1], [2, 2]],
            // Vertical combinations
            [[0, 0], [1, 0], [2, 0]],
            [[0, 1], [1, 1], [2, 1]],
            [[0, 2], [1, 2], [2, 2]],
            // Diagonal combinations
            [[0, 0], [1, 1], [2, 2]],
            [[0, 2], [1, 1], [2, 0]]
        ];
    
        for (const combination of winningCombinations) {
            const [cell1, cell2, cell3] = combination;
            const [row1, col1] = cell1;
            const [row2, col2] = cell2;
            const [row3, col3] = cell3;
    
            const value1 = board[row1][col1].getValue();
            const value2 = board[row2][col2].getValue();
            const value3 = board[row3][col3].getValue();
    
            if (value1 && value1 === value2 && value2 === value3) {
                // Found a winning combination
                return `Winner: ${getActivePlayer().name}`;
            }
        }
    
        // No winning combination found
        return null;
    }


    const checkDraw = () => {

        filledCells = 0;
        board.forEach(row => {
            row.forEach(cell => {
                if (cell.getValue() !== "") {
                    filledCells++;
                    if (filledCells === 9) {
                        endGame(filledCells);
                    } 
                }
            });
        });
    }


    const endGame = (filledCells) => {
        const winDiv = document.querySelector(".win-message");
        const winDivText = document.querySelector("[data-win-message-text]");
        winDiv.classList.add("show");
        // if filledCells is 9 means it is a draw
        if (filledCells === 9) {
            winDivText.textContent = `Draw!`;
        } else {
            winDivText.textContent = `${getActivePlayer().name} wins!`;
        }
    }

    // Initial play game message
    printNewRound();

    return {
        switchPlayerTurn,
        playRound,
        getActivePlayer,
        getBoard: consoleBoard.getBoard,
        checkWin,
        checkDraw,
        endGame
    }
}


function ScreenController() {
    let game = GameController();
    const playerTurnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector("#board");
    const restartButton = document.querySelector("#restart-button")
    
    const updateScreen = () => {
        
        // get the newest version of the board and player turn
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();
        
        // display player's turn
        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;
        
        // clear the board
        boardDiv.textContent = "";
        
        let lastNumber = 0;
        
        //render board squares on screen
        board.forEach(row => {
            row.forEach(cell => {
                const squareDiv = document.createElement("div");
                squareDiv.classList.add(`square-div`);
                squareDiv.dataset.cell = `${++lastNumber}`
                const cellMark = cell.getValue();
                if (cellMark) {
                    squareDiv.classList.add("square-div", cellMark)
                } else {
                    squareDiv.classList.add("square-div")
                }
                squareDiv.textContent = "";
                boardDiv.appendChild(squareDiv);
            })
        });
    }

    function handleClick(e) {
        let selectedCell = e.target.dataset.cell;

        if (!selectedCell) return;

        selectedCell = parseInt(selectedCell, 10);
        const row = Math.ceil(selectedCell / 3); 
        const column = selectedCell % 3 || 3; 

        game.playRound(row, column);
        updateScreen();
    }


    const restartGame = () => {
        game = GameController();
        const winDiv = document.querySelector(".win-message");
        const winDivText = document.querySelector("[data-win-message-text]");
        winDiv.classList.remove("show");
        winDivText.textContent = "";
        updateScreen();
    }
    
    boardDiv.addEventListener("click", handleClick);
    restartButton.addEventListener("click", restartGame);
    updateScreen();
}

ScreenController();
