var squares = document.getElementsByClassName("square"); 
let whosTurn = 1;
let gameOver = false;
let PvC = false;

const messageDiv = document.getElementById("message");

let player1Squares = [];
let player2Squares = [];

var winningCombos = [
	['A1','B1','C1'], //ROW 1
	['A2','B2','C2'], //ROW 2
	['A3','B3','C3'], //ROW 3
	['A1','A2','A3'], //COLUMN 1
	['B1','B2','B3'], //COLUMN 2
	['C1','C2','C3'], //COLUMN 3
	['A1','B2','C3'], //DIAG 1
	['A3','B2','C1'] //DIAG 2
];

for(let i = 0; i < squares.length; i++){
	squares[i].addEventListener('click', function(){
		markSquare(squares[i].id)
	})
}


var isX = true;
function markSquare(squareID){
	const clickedSquare = document.getElementById(squareID);
	if(!gameOver){
		if(clickedSquare.innerHTML !== "-"){
			messageDiv.innerHTML = 'Sorry that square is already taken';
		}
		else if(whosTurn === 1){
			
			clickedSquare.innerHTML = `X`;
			player1Squares.push(clickedSquare.id);
			checkWin(1, player1Squares);
			
			if(!gameOver){
				if(PvC){
					computerTurn();
				}
				else{
					whosTurn = 2;
				}
			}
		}
		else{
			whosTurn = 1;
			clickedSquare.innerHTML = 'O';
			player2Squares.push(clickedSquare.id);
			checkWin(2, player2Squares);
		}
	}
}


function checkWin(whoJustMarked, playerSquares){
	for(let i = 0; i < winningCombos.length; i++){
		let squareCount = 0;
		for(let j = 0; j < winningCombos[i].length; j++){
			const currentWinningSquare = winningCombos[i][j];

			if(playerSquares.indexOf(currentWinningSquare) > -1){
				squareCount++;
			}
		}
		console.log(`SqaureCount = ${squareCount}`);
		if(squareCount === Number(document.getElementById("sizeChange").value) ){
			gameOver = true;
			messageDiv.innerHTML = `PLAYER ${whoJustMarked} HAS WON!!`;
			for(let w = 0; w < winningCombos[i].length; w++){
				const thisSquare = document.getElementById(winningCombos[i][w]);
				thisSquare.className += ' winning-square';
			}
		}
	}

}

function computerTurn(){
	var computerRow = Math.ceil(Math.random() * document.getElementById("sizeChange").value); //a, b, c
	var computerColoum = Math.ceil(Math.random() * document.getElementById("sizeChange").value); //1,2,3

	const clickedSquare = document.getElementById(`${String.fromCharCode(64+computerRow)}${computerColoum}`);
	if(clickedSquare.innerHTML === "-"){
		whosTurn = 1;
		clickedSquare.innerHTML = 'O';
		player2Squares.push(clickedSquare.id);
		checkWin('computer', player2Squares);
	}
	else{
		computerTurn();
	}
}

document.getElementById("reset-button").addEventListener('click', function(){ 
	makeBoard(document.getElementById("sizeChange").value);
})

function reset(){
	
	for(let i = 0; i < squares.length; i++){
		squares[i].addEventListener('click', function(){
			markSquare(squares[i].id)
		})
	}

	gameOver = false;
	whosTurn = 1;
	player1Squares = [];
	player2Squares = [];
}

document.getElementById("PvC").addEventListener('click', function(){ 
	players();
})


function players(){
	if(document.getElementById("PvC").innerHTML === "PvC"){
		reset();
		PvC = true;
		document.getElementById("PvC").innerHTML = "PvP"
	}
	else{
		reset();
		PvC = false;
		document.getElementById("PvC").innerHTML = "PvC"
	}
}

document.getElementById("sizeButton").addEventListener('click', function(){ 
	makeBoard(document.getElementById("sizeChange").value);
})

function makeBoard(gridSize){
	gridSize = Number(gridSize);
	var emptyBoard = document.getElementById("board");

	var size = "small";

	if(gridSize > 16){
		size = "extraLarge"
	}
	else if(gridSize > 9){
		size = "large"
	}
	else if(gridSize > 5){
		size = "medium";
	}

	var str = "";
	for(let i = 0; i < gridSize; i++){
			str += `<div class="board-row">`;
		for(let j = 65; j < (65+gridSize); j++){
			str += `<button id="${String.fromCharCode(j)}${i+1}" class="square ${size}">-</button>`
		}
			str += `</div>`
	}

	emptyBoard.innerHTML = str;

	squares = document.getElementsByClassName("square");
	newWinningCombos(gridSize);
	reset();
	
}

function newWinningCombos(gridSize){
	winningCombos = [];
	for(let i = 0; i < gridSize; i++){
		var comboRow = [];
		var comboCol = [];
		for(let j = 65; j < (65+gridSize); j++){
			comboRow.push(`${String.fromCharCode(j)}${i+1}`)
			comboCol.push(`${String.fromCharCode(i + 65)}${j - 64}`);
		}
		winningCombos.push(comboRow);
		winningCombos.push(comboCol);			
	}

	var comboDiag1 = [];
	var comboDiag2 = [];
	for(let i = 0; i < gridSize; i++){
		comboDiag1.push(`${String.fromCharCode(i+65)}${i+1}`);
		comboDiag2.push(`${String.fromCharCode(i+65)}${gridSize-i}`);
	}
	winningCombos.push(comboDiag1);
	winningCombos.push(comboDiag2);
	console.log(winningCombos);
}