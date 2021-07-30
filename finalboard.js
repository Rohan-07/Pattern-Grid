/*
 *  Some Assumptions
	* 0 => dead
	* 1 => live
	* I have taken 1 based indexing.
	* Taken matrix cell naming convention for cell name i.e.
		[] [] []
		[] [] []
		[] [] []

		Here the name of first cell ("[]") is "1,1",
		second cell "1,2" and so on. 
		
		For the user input.
	    user simply clicks on the cell to make it live. By default all the cells are dead
		
		For each tick/step press Next Gen button to view the next tick/step.

		For Searching the cell simply type the cell name as per the naming convention to
		search it status;

	I have taken 2 extra rows and 2 Extra columns whoes values are always 0.
	This is to compute neighnours count.
 */

class Pattern {
	board;
	max_rows;
	max_cols;

	constructor(rows, cols) {
		this.max_rows = rows;
		this.max_cols = cols;
		this.board = this.createMatrix(rows, cols);
	}

	// funtion to create 2D Matrix
	createMatrix = (max_rows, max_cols) => {
		let mat = new Array(max_rows);
		for (let i = 0; i < mat.length; i++) {
			mat[i] = new Array(max_cols);
		}
		for (let i = 0; i < mat.length; i++) {
			for (let j = 0; j < mat[i].length; j++) {
				mat[i][j] = 0;
			}
		}
		return mat;
	};

	// Rendering the grids
	createBoard = () => {
		let nextgen = document.getElementById("nextgen");
		nextgen.addEventListener("click", () => {
			this.board = this.rules(this.board);
			for (let i = 1; i < this.board.length - 1; i++) {
				for (let j = 1; j < this.board[i].length - 1; j++) {
					if (this.board[i][j] == 1)
						document.getElementById(`${i},${j}`).className = "live";
					else document.getElementById(`${i},${j}`).className = "dead";
				}
			}
		});
		let workspace = document.getElementById("board");
		let area = document.createElement("table");
		for (let i = 0; i < this.max_rows; i++) {
			if (i == 0 || i == this.max_rows - 1) continue;
			let row = document.createElement("tr");
			for (let j = 0; j < this.max_cols; j++) {
				if (j == 0 || j == this.max_cols - 1) continue;
				let col = document.createElement("td");
				col.setAttribute("id", `${i},${j}`);
				col.setAttribute("class", "dead");
				col.style.border = "1px solid black";
				col.addEventListener("click", function () {
					let classes = this.getAttribute("class");
					if (classes.indexOf("live") == 0) {
						this.setAttribute("class", "dead");
						obj.updateMatrix();
					} else {
						this.setAttribute("class", "live");
						obj.updateMatrix();
					}
				});
				row.appendChild(col);
			}
			area.appendChild(row);
		}
		workspace.appendChild(area);
	};

	// removing the renderd board when rest button is pressed
	deleteBoard = () => {
		let workspace = document.getElementById("board");
		workspace.innerText = "";
		this.board = this.createMatrix(1, 1);
	};

	// upading the grid
	updateMatrix = () => {
		let cells = document.getElementsByTagName("td");
		for (let cell of cells) {
			let coord = cell.id.split(",");
			let x = coord[0];
			let y = coord[1];
			if (cell.className == "dead") this.board[x][y] = 0;
			else this.board[x][y] = 1;
		}
	};

	// applying the rules
	rules = (board) => {
		let newBoard = this.createMatrix(this.max_rows, this.max_cols);
		let countNeighbors = this.createMatrix(this.max_rows, this.max_cols);

		for (let i = 1; i < board.length - 1; i++) {
			for (let j = 1; j < board[i].length - 1; j++) {
				countNeighbors[i][j] =
					board[i + 1][j] +
					board[i - 1][j] +
					board[i][j + 1] +
					board[i][j - 1] +
					board[i + 1][j + 1] +
					board[i - 1][j - 1] +
					board[i + 1][j - 1] +
					board[i - 1][j + 1];

				// For live cells
				if (board[i][j] == 1) {
					// 1. Any live cell with fewer than two live neighbour DIES, as if by loneliness.
					if (countNeighbors[i][j] < 2) {
						newBoard[i][j] = 0;
					}
					// 2. Any live cell with two or three live neighbour lives, unchanged, to next gen.
					else if (countNeighbors[i][j] == 2 || countNeighbors[i][j] == 3)
						newBoard[i][j] = 1;
					// 3. Any live cell with more than three live neighbour DIES, as if by overcrowding.
					else if (countNeighbors[i][j] > 3) {
						newBoard[i][j] = 0;
					}
				}
				// For dead cell
				else {
					// Any dead cell with exactly three live neighbors come to life.
					if (countNeighbors[i][j] == 3) {
						newBoard[i][j] = 1;
					}
				}
			}
		}
		return newBoard;
	};

	// making all the cell as dead
	resetMatrix() {
		for (let i = 1; i < this.board.length - 1; i++) {
			for (let j = 1; j < this.board[i].length - 1; j++) {
				document.getElementById(`${i},${j}`).className = "dead";
				this.board[i][j] = 0;
			}
		}
		console.log("you just reset the board");
	}

	// rendering the next tick/state
	nextGen() {
		this.board = this.rules(this.board);
		for (let i = 1; i < this.board.length - 1; i++) {
			for (let j = 1; j < this.board[i].length - 1; j++) {
				if (this.board[i][j] == 1)
					document.getElementById(`${i},${j}`).className = "live";
				else document.getElementById(`${i},${j}`).className = "dead";
			}
		}
	}
}

let rows;
let cols;
let obj;

let grid = () => {
	rows = Number(document.getElementById("max_rows").value) + 2;
	cols = Number(document.getElementById("max_cols").value) + 2;
	console.log(rows);
	console.log(cols);
};

let initGrid = () => {
	obj = new Pattern(rows, cols);
	obj.createBoard();
	document.getElementById("create_grid").disabled = true;
	document.getElementById("max_rows").disabled = true;
	document.getElementById("max_cols").disabled = true;
	document.getElementById("nextgen").disabled = false;
	document.getElementById("rest").disabled = false;
	document.getElementById("searchButton").disabled = false;
};

let resetGrid = () => {
	obj.deleteBoard();
	document.getElementById("create_grid").disabled = false;
	document.getElementById("max_rows").disabled = false;
	document.getElementById("max_cols").disabled = false;
	document.getElementById("nextgen").disabled = true;
	document.getElementById("rest").disabled = true;
	document.getElementById("searchButton").disabled = true;
};

let searchCell = () => {
	console.log("Searching cell");
	let val = document.getElementById("search").value;
	let state = document.getElementById(val).className;
	if (state == "live")
		document.getElementById("search_result").innerHTML = "Live";
	else document.getElementById("search_result").innerHTML = "Dead";
};
