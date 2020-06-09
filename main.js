
const canvas =document.getElementById("Canvas");
const ctx = canvas.getContext("2d");


canvas.width = N*scale + 256;
canvas.height = N*scale;

let createPosition = (canvas.height/2)/scale;

let mouseX;
let mouseY;
let mouseMoved = false;
var temp;
var temp2;

let hasSquare = false;

let baseSquareCords = new PVector(((canvas.width-N*scale)/2 - squareWidth/2) + N*scale, canvas.height/2 - squareWidth/2);


let Fluid1 = new fluid(0.1,0, 0);

setInterval(draw, 20);

canvas.addEventListener("mousedown", (e) => {
    mouseX = e.clientX - (window.innerWidth - canvas.width)/2;
    mouseY = e.clientY - (window.innerHeight - canvas.height)/2;
    console.log(mouseX + " " + mouseY);

    if(isOnSquare(squares, mouseX, mouseY) !== -1){
        squares.splice(isOnSquare(squares, mouseX, mouseY),1);
        temp2 = setInterval(squareHandler, 20, mouseX, mouseY);
    }
    else if(mouseX < N*scale){      
        temp = setInterval(clickedHandler, 20, e);   
    } else if (mouseX >= baseSquareCords.x &&
         mouseX <= baseSquareCords.x + squareWidth && 
         mouseY >= baseSquareCords.y && 
         mouseY <= baseSquareCords.y + squareWidth){

         temp2 = setInterval(squareHandler, 20, mouseX, mouseY);       
    } 
});

canvas.addEventListener("mouseup", (e) => {
    if(mouseX < N*scale && hasSquare === true){
            squares.push(new PVector(e.clientX - (window.innerWidth - canvas.width)/2 - squareWidth/2, e.clientY - (window.innerHeight - canvas.height)/2- squareWidth/2));
            clearInterval(temp2);
            hasSquare = false;
     } else {
            clearInterval(temp2);
            hasSquare = false;
        } 
    clearInterval(temp);
    canvas.onmousemove = function(e){

   } 
});

function squareHandler(){
    

        drawSquareAtPt(new PVector(mouseX - squareWidth/2, mouseY - squareWidth/2));

    canvas.onmousemove = function(eMove){
        hasSquare = true;
        mouseX = eMove.clientX - (window.innerWidth - canvas.width)/2;
        mouseY = eMove.clientY - (window.innerHeight - canvas.height)/2;
        drawSquareAtPt(new PVector(mouseX - squareWidth/2, mouseY - squareWidth/2));
        console.log("square");
    } 
    
}

function clickedHandler(e){
    canvas.onmousemove = function(eMove){
        mouseX = eMove.clientX - (window.innerWidth - canvas.width)/2;
        mouseY = eMove.clientY - (window.innerHeight - canvas.height)/2;
        Fluid1.addDensity(new PVector(Math.round(mouseX/scale) , Math.round(mouseY/scale)), 0.9);
        Fluid1.addVelocity(Math.round(mouseX/scale) , Math.round(mouseY/scale) , (Math.random() * 3- 1.5), (Math.random() * 3- 1.5));
        }
    Fluid1.addDensity(new PVector(Math.round(mouseX/scale) , Math.round(mouseY/scale)), 0.9);
    Fluid1.addVelocity(Math.round(mouseX/scale) , Math.round(mouseY/scale) , (Math.random() * 3- 1.5), (Math.random() * 3- 1.5));
}


    

function createFluid(input){
    for(let i = 0; i < input; i++){
        Fluid1.addDensity(new PVector(5, createPosition + 5*i), 0.9);
        Fluid1.addVelocity(5 , createPosition +5*i , 0.2, 0);

        Fluid1.addDensity(new PVector(5, createPosition - 5*i), 0.9);
        Fluid1.addVelocity(5 , createPosition -5*i , 0.2, 0);
}

}
function drawVertLine(){
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "black";
    ctx.moveTo(N*scale, 0);
    ctx.lineTo(N*scale, N*scale);
    ctx.stroke();
    ctx.closePath();
} 



function draw(){
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawVertLine();
    drawSquareAtPt(baseSquareCords);
      
    Fluid1.step();  
    Fluid1.displayDensity();
    renderSquares();
    
    createFluid(1);
//     Fluid1.addDensity(new PVector((canvas.width/2)/scale, 5), 0.9);
//     Fluid1.addVelocity((canvas.width/2)/scale, 5 , 0, 0.2);

}

