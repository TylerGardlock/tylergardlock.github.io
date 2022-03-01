let canvas;
let context;
//Total squares going down
let boardHeight = 20;
//Total squares across
let boardWidth = 12;
//Starting place for piece on gameboard
let startX = 4; //Starting X position
let startY = 0; //Starting Y position
let score = 0; //Tracks score
let level = 0; //Tracks current level
let winOrLose = 'Playing';
let logo;
//Array table for game pieces
let coordinateArray = [...Array(boardHeight)].map(e => Array(boardWidth)
                    .fill(0));
//Array for all pieces that can be created
let currentPiece = [
    [1,0], 
    [0,1],
    [1,1], 
    [2,1]
];

//Gameboard Array
let pieces = [];
let pieceColors = ['blue', 'green', 'yellow', 'red', 'orange', 'purple', 'cyan'];
let currentPieceColor;
// Gameboard area to know where other squares are located
let gameBoardArray = [...Array(boardHeight)].map(e => Array(boardWidth)
                    .fill(0));
//Array for storing stopped shapes
let stoppedShapeArray = [...Array(boardHeight)].map(e => Array(boardWidth)
                    .fill(0));

let DIRECTION = {
    IDLE: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
};
let direction;

//Coordinates class creating squares that make up game pieces
class Coordinates {
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}

document.addEventListener('DOMContentLoaded', SetupCanvas);

//Populate Coordinates
function CreateCoordArray(){
    let i = 0, j = 0;
    for(let y = 9; y <= 446;/*Max px hieght*/ y += 23){
        for(let x = 11; x <= 264;/*Max px width*/ x += 23){
            coordinateArray[i][j] = new Coordinates(x,y);
            i++;
        }
        j++;
        i = 0;
    }
}

//Creates Canvas
function SetupCanvas(){
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    canvas.width = 936;
    canvas.height = 956;

    context.scale(2,2);
//Canvas background
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
//Gameboard rectangle
    context.strokeStyle = 'white';
    context.strokeRect(8, 8, 280, 462);

/*Logo
logo = new Image();
logo.onload = DrawLogo;
function DrawLogo(){
    context.drawImage(logo, 300, 8, 161, 54)
}
*/
//Score Box
    context.fillStyle = 'white';
    context.font = '20px Times';
    context.fillText("SCORE", 300, 98);
    context.strokeRect(300, 107, 161, 24);
    context.fillText(score.toString(), 310, 127);
//Level Box
    context.fillText("LEVEL", 300, 157);
    context.strokeRect(300, 171, 161, 24)
    context.fillText(level.toString(), 310, 190)
//Win/Lose Box
    context.fillText("WIN / LOSE", 300, 221);
    context.fillText(winOrLose, 310, 261);
    context.strokeRect(300, 232, 161, 95)
//Controls Box
    context.fillText("CONTROLS", 300, 354);
    context.strokeRect(300, 366, 161, 104);
    context.font = '16px Times';
    context.fillText("Left Arrow: Left", 310, 388);
    context.fillText("Right Arrow: Right", 310, 413);
    context.fillText("Down Arrow: Down", 310, 438);
    context.fillText("Up Arrow: Rotate", 310, 463);

 //Keyboad event
    document.addEventListener('keydown', HandleKeyPress);
    //Creates array of piece arrays
    CreatePieces();
    //Generates random piece
    CreatePiece();
    
    CreateCoordArray();
    DrawPiece();
}

function DrawPiece(){
    for (let i = 0; i < currentPiece.length; i++) {
        let x = currentPiece[i][0] + startX;
        let y = currentPiece[i][1] + startY;
        gameBoardArray[x][y] = 1;
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;
        context.fillStyle = currentPieceColor;
        context.fillRect(coorX, coorY, 21, 21); //Each square for piece is 21 x 21 px
    }
}

//Keyboard Functionality
function HandleKeyPress(key){
    if(winOrLose != "Game Over"){
        if(key.keyCode === 37){ 
            direction = DIRECTION.LEFT;
            if(!HittingWall() && !CheckForHorzCollision()){
                DeletePiece();
                startX--;
                DrawPiece(); 
            }
        }else if (key.keyCode === 39){
            direction = DIRECTION.RIGHT;
            if(!HittingWall() && !CheckForHorzCollision()){
                DeletePiece();
                startX++;
                DrawPiece()
            }
        }else if (key.keyCode === 40){
            MoveDown();
        }else if(key.keyCode === 38){
            RotatePiece();
        }

    }
}
function MoveDown(){
    direction = DIRECTION.DOWN;
if(!CheckForVertCollision()){
    DeletePiece();
    startY++;
    DrawPiece();
    }
}

window.setInterval(function(){
    if(winOrLose != "Game Over"){
        MoveDown();
    }
}, 700);

//Deleting pieces as they move
function DeletePiece(){
    for(let i = 0; i < currentPiece.length; i++){
        let x = currentPiece[i][0] + startX;
        let y = currentPiece[i][1] + startY;
        gameBoardArray[x][y] = 0;
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;
        context.fillStyle = 'black';
        context.fillRect(coorX, coorY, 21, 21);
    }
}

//Store piece shapes
function CreatePieces(){
    // T
    pieces.push([[1,0], [0,1], [1,1], [2,1]]);
    // I
    pieces.push([[0,0], [1,0], [2,0], [3,0]]);
    // J
    pieces.push([[0,0], [0,1], [1,1], [2,1]]);
    // Square
    pieces.push([[0,0], [1,0], [0,1], [1,1]]);
    // L
    pieces.push([[2,0], [0,1], [1,1], [2,1]]);
    // S
    pieces.push([[1,0], [2,0], [0,1], [1,1]]);
    // Z
    pieces.push([[0,0], [1,0], [1,1], [2,1]]);
}
//Creates Piece
function CreatePiece(){
    let randomPiece = Math.floor(Math.random() * pieces.length);
    currentPiece = pieces[randomPiece];
    currentPieceColor = pieceColors[randomPiece];
}

//Check for wall hits
function HittingWall(){
    for (let i = 0; i < currentPiece.length; i++){
        let newX = currentPiece[i][0] + startX;
        if (newX <= 0 && direction === DIRECTION.LEFT){
            return true;
        }else if (newX >= 11 && direction === DIRECTION.RIGHT){
            return true;
        }
    }
    return false;
}
function CheckForVertCollision(){
    let pieceCopy = currentPiece;
    let collision = false;
    for(let i = 0; i < pieceCopy.length; i++){
        let square = pieceCopy[i];
        let x = square[0] + startX;
        let y = square[1] + startY;
        if(direction === DIRECTION.DOWN){
            y++;
        }
        if(typeof stoppedShapeArray[x][y+1] === 'string'){
                DeletePiece();
                startY++;
                DrawPiece();
                collision = true;
                break;
            }
            if(y >= 20){
                collision = true;
                break;
            }
        }
        if(collision){
            if(startY <= 2){
                winOrLose = "Game Over";
                context.fillStyle = 'black';
                context.fillRect(310, 242, 140, 30);
                context.fillStyle = 'white';
                context.fillText(winOrLose, 310, 261);
            }else {
                for(let i = 0; i < pieceCopy.length; i++){
                    let square = pieceCopy[i];
                    let x = square[0] + startX;
                    let y = square[1] + startY;
                    stoppedShapeArray[x][y] = currentPieceColor;
                }
                CheckForCompleteRows();
                CreatePiece();
                direction = DIRECTION.IDLE;
                startX = 4;
                startY = 0;
                DrawPiece();
            }
        
    }
}

function CheckForHorzCollision(){
    var pieceCopy = currentPiece;
    var collision = false;
    for(var i = 0; i < pieceCopy.length; i++){
        var square = pieceCopy[i];
        var x = square[0] + startX;
        var y = square[1] + startY;

        if(direction === DIRECTION.LEFT){
            x--;
        }else if(direction === DIRECTION.RIGHT){
            x++;
        }
        var stoppedShapeVal = stoppedShapeArray[x][y];
        if(typeof stoppedShapeVal === 'string'){
            collision = true;
            break;
        }
    }
    return collision;
} 
 function CheckForCompleteRows(){
    let rowsToDelete = 0;
    let startOfDelete = 0;
    for(let y = 0; y < boardHeight; y++){
        let completed = true;
        for(let x = 0; x < boardWidth; x++){
            let square = stoppedShapeArray[x][y];
            if(square === 0 || (typeof square === 'undefined')){
                completed = false;
                break;
            }
        }
        if(completed){
            if(startOfDelete === 0)
            startOfDelete = y;
            rowsToDelete++;
            for(let i = 0; i < boardWidth; i++){
                stoppedShapeArray[i][y] = 0;
                gameBoardArray[i][y] = 0;
                let coorX = coordinateArray[i][y].x;
                let coorY = coordinateArray[i][y].y;
                context.fillStyle = 'black';
                context.fillRect(coorX, coorY, 21, 21); 
            }
        }
    }
 //Keeps track of current score
    if(rowsToDelete > 0){
        score += 100;
        context.fillStyle = 'black';
        context.fillRect(310, 109, 140, 19);
        context.fillStyle = 'white';
        context.fillText(score.toString(), 310, 127);
        MoveAllRowsDown(rowsToDelete, startOfDelete);

    } 
    if (score === 100){
    level++;
    context.fillStyle = 'black';
    context.fillRect(310, 173, 140, 19);
    context.fillStyle = 'white';
    context.fillText(score.toString(), 310, 190);
    }else if(score === 300){
    level++;
    context.fillStyle = 'black';
    context.fillRect(310, 173, 140, 19);
    context.fillStyle = 'white';
    context.fillText(score.toString(), 310, 190);
    }
 }



function MoveAllRowsDown(rowsToDelete, startOfDelete){
    for (let i = startOfDelete - 1; i >= 0; i--){
        for (let x = 0; x < boardWidth; x++){
            let y2 = i + rowsToDelete;
            let square = stoppedShapeArray[x][i];
            let nextSquare = stoppedShapeArray[x][y2];
            if(typeof square === 'string'){
                nextSquare = square;
                gameBoardArray[x][y2] = 1;
                stoppedShapeArray[x][y2] = square;
                let coorX = coordinateArray[x][y2].x;
                let coorY = coordinateArray[x][y2].y;
                context.fillStyle = nextSquare;
                context.fillRect(coorX, coorY, 21, 21);

                square = 0;
                gameBoardArray[x][i] = 0;
                stoppedShapeArray[x][i] = 0;
                coorX = coordinateArray[x][i].x;
                coorY = coordinateArray[x][i].y;
                context.fillStyle = 'black';
                context.fillRect(coorX, coorY, 21, 21);
            }
        }
    }
}

function RotatePiece(){
    let newRotation = new Array();
    let pieceCopy = currentPiece;
    let backUp;
    for(let i = 0; i < pieceCopy.length; i++){
        backUp = [...currentPiece];
        let x = pieceCopy[i][0];
        let y = pieceCopy[i][1];
        let newX = (GetLastX() - y);
        let newY = x;
        newRotation.push([newX, newY]);
    }
    
    DeletePiece();
    try{
        currentPiece = newRotation;
        DrawPiece();
    }
    catch(e){
        if(e instanceof TypeError){
            currentPiece = backUp;
            DeletePiece();
            DrawPiece();
        }

    }
}
function GetLastX(){
    let lastX = 0;
    for(let i = 0; i < currentPiece.length; i++){
        let square = currentPiece[i];
        if(square[0] > lastX)
            lastX = square[0];
    }
    return lastX;
}



