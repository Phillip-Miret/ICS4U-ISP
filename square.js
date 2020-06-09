let squares = new Array;
let squareWidth = 80;


function drawSquares(sqrArr){
    sqrArr.forEach(element => {
        drawSquareAtPt(element);
    });
}

function isOnSquare(sqrArr, x, y){
    for(let i = 0; i < sqrArr.length; i++){
        if(x >= sqrArr[i].x &&
            x <= sqrArr[i].x + squareWidth &&
            y >= sqrArr[i].y &&
            y <= sqrArr[i].y + squareWidth){
                return i;
            } 
    }
    return -1;
}

function drawSquareAtPt(pos){
    ctx.beginPath();
    ctx.rect(pos.x, pos.y, squareWidth, squareWidth);
    ctx.fillStyle = "#990000";
    ctx.fill();
    ctx.rect(pos.x, pos.y, squareWidth, squareWidth);
    ctx.strokeStyle = "#FF0000";
    ctx.stroke();
    ctx.closePath();
}