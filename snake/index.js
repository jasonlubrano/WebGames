const NUM_TILES_X = 20;
const NUM_TILES_Y = 20;
const TILE_SIZE = 25;
const STEP_INTERVAL = 100;
const NUM_TILES = NUM_TILES_Y * NUM_TILES_X;

const startButton = document.getElementById('start-button');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

let posX = Math.floor(NUM_TILES_X/2);
let posY = Math.floor(NUM_TILES_Y/2);
let direction = 'N';
let oldDirection = 'N';
let buffer = [];
let ateFood = false;
let foodX, foodY;
let score = 0;

function drawSnakePiece(x, y){
	context.fillStyle = "black";
	context.fillRect(x*TILE_SIZE, y*TILE_SIZE, TILE_SIZE, TILE_SIZE);

	context.fillStyle = "lightgreen";
	context.fillRect(x*TILE_SIZE, y*TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

function drawDigestedFood(x, y){
	context.fillStyle = "red";

	context.beginPath();
	context.arc((x+0.5)*TILE_SIZE, (y+0.5)*TILE_SIZE, TILE_SIZE/4, 2*Math.PI, false);
	context.closePath();

	context.fill();
}

function clearTile(x, y){
	context.fillStyle = "grey";
	context.fillRect(x*TILE_SIZE, y*TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

function tileHasSnakePiece(x, y){
	for (const bufferElement of buffer){
		if (bufferElement.toString() === [x, y].toString()) return true;
	}
	return false;
}

function addFood(){
	do {
		foodX = Math.floor(Math.random() * NUM_TILES_X);
		foodY = Math.floor(Math.random() * NUM_TILES_Y);
	} while (tileHasSnakePiece(foodX, foodY));

	//context.fillStyle = "red";
	//ontext.fillRect(foodX*TILE_SIZE, foodY*TILE_SIZE, TILE_SIZE, TILE_SIZE);
	context.fillStyle = "white";

	context.beginPath();
	context.arc((foodX+0.5)*TILE_SIZE, (foodY+0.5)*TILE_SIZE, TILE_SIZE/2, 2*Math.PI, false);
	context.closePath();

	context.fill();

	context.fillStyle = "red";

	context.beginPath();
	context.arc((foodX+0.5)*TILE_SIZE, (foodY+0.5)*TILE_SIZE, TILE_SIZE/3, 2*Math.PI, false);
	context.closePath();

	context.fill();
}

function die(win){
	if (win) alert('YOU WIN! Score: ' + score);
	else alert('YOU DIED! Score: ' + score);

	window.location.reload();

	throw new Error();
}

function step(){
	//direction buff
	oldDirection = direction;
	//ate food cheking
	if(!ateFood){
		const tailPos = buffer.shift();
		if (tailPos) clearTile(tailPos[0], tailPos[1]);
	} else {
		ateFood = false;
	}
	//direction checking
	if (direction === 'N') posY--;
	else if (direction === 'S') posY++;
	else if (direction === 'E') posX++;
	else if (direction === 'W') posX--;
	
	//check if ate self
	if(tileHasSnakePiece(posX, posY)) die(false);

	//check if side is hit
	if(posX >= NUM_TILES_X || posX < 0 || posY >= NUM_TILES_Y || posY < 0) die(false);

	//check if food ate
	if(posX === foodX && posY === foodY){
		score++;
		ateFood = true;
	}

	drawSnakePiece(posX, posY);
	buffer.push([posX, posY]);


	if(ateFood){
		if(buffer.length === NUM_TILES) die(true);
		
		drawDigestedFood(posX, posY);
		addFood();
	}
}

startButton.addEventListener('click', function () {
    startButton.style.display = 'none';
    setInterval(step, STEP_INTERVAL);

    document.addEventListener('keydown', function(event) {
    	if (event.keyCode === 37 && oldDirection !== 'E') direction = 'W';
    	else if (event.keyCode === 38 && oldDirection !== 'S') direction = 'N';
    	else if (event.keyCode === 39 && oldDirection !== 'W') direction = 'E';
    	else if (event.keyCode === 40 && oldDirection !== 'N') direction = 'S';
    });
});

step();
addFood();