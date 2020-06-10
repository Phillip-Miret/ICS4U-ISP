
/*
By Phillip Miret

2D Navier-Stokes incompressible fluid simulation

Date: 06/10/2020

program functionality walkthrough/demonstration at https://youtu.be/p74O9OEjcAQ (2:15) no audio, sorry

*/


const canvas =document.getElementById("Canvas");
const ctx = canvas.getContext("2d");


canvas.width = N*scale + 256; // N is the effective width in pixels of the screen this is multiplied by a scaling value to fill up more space. 
canvas.height = N*scale; // This manages the lag produced by larger grid sizes (N values) by reducting the number of calculations needed this is also why the fluid seems pixelated 


let mouseX;
var PrevMouseX = 0;
let mouseY;
var PrevMouseY = 0;
let mouseMoved = false;

var temp;
var temp2;
var temp3;
var temp4

let hasSquare = false;
let hasSource = false;

let sourceClickStep = 0;

let baseSquareCords = new PVector(((canvas.width-N*scale)/2 - squareWidth/2) + N*scale, canvas.height/3 - squareWidth/2); //  coordinates for the two reference sqaure on the right of the line
let baseSourceCords  = new PVector(((canvas.width-N*scale)/2 - squareWidth/2) + N*scale,  canvas.height*2/3 - squareWidth/2);

let sourceBlocks = new Array;

let Fluid1 = new fluid(0.1,0,0);

setInterval(draw, 20);

/*
    decide what to do when the mouse is pressed, based on the mouse's X and Y position on the canvas
*/

canvas.addEventListener("mousedown", (e) => {
    mouseX = e.clientX - (window.innerWidth - canvas.width)/2;
    mouseY = e.clientY - (window.innerHeight - canvas.height)/2;
    console.log(mouseX + " " + mouseY);

    if(isOnSource(sourceBlocks, mouseX, mouseY) !== -1 && sourceClickStep === 0){
        console.log("source");
        sourceBlocks.splice(isOnSource(sourceBlocks, mouseX, mouseY),1);
        temp3 = setInterval(sourceHandler, 20, mouseX, mouseY); // makes the source follow the mouse
    }
    else if(isOnSquare(squares, mouseX, mouseY) !== -1){
        squares.splice(isOnSquare(squares, mouseX, mouseY),1);
        temp2 = setInterval(squareHandler, 20, mouseX, mouseY); // makes the block follow the pointer
    }
    else if(mouseX < N*scale){  
        if(sourceClickStep === 1){
            console.log("other stuff")
            temp4 = setInterval(vecHandler, 20, mouseX, mouseY);  //draws a vector from the source point to the mouse
        } else {
            temp = setInterval(clickedHandler, 20, e); // draws fluid at the pointer
        }      
    } else if (mouseX >= baseSquareCords.x &&
         mouseX <= baseSquareCords.x + squareWidth && 
         mouseY >= baseSquareCords.y && 
         mouseY <= baseSquareCords.y + squareWidth){

         temp2 = setInterval(squareHandler, 20, mouseX, mouseY);   

    } else if (mouseX >= baseSourceCords.x &&
        mouseX <= baseSourceCords.x + squareWidth && 
        mouseY >= baseSourceCords.y && 
        mouseY <= baseSourceCords.y + squareWidth){

        temp3 = setInterval(sourceHandler, 20, mouseX, mouseY);       
   }
});
/* 
    when the mouse is no longer clicked this function determines what to 
    do based on where the mouse is, and if ther is currently a block or source following the pointer
*/ 

canvas.addEventListener("mouseup", (e) => {
    if(sourceClickStep === 1){
        hasSource = false;
        sourceClickStep = 0;
        console.log(e.clientX + " " + e.clientY);
        let tempVec = new PVector(Math.round(mouseX/scale), Math.round(mouseY/scale));
        tempVec = tempVec.sub(sourceBlocks[sourceBlocks.length-1][0]);
        tempVec.setMag(tempVec.mag()/(6*scale));
        sourceBlocks[sourceBlocks.length-1][1] = tempVec;
        clearInterval(temp4);
        
    }else {
        clearInterval(temp4);
    }
    if(mouseX < N*scale  && hasSource && sourceClickStep === 0){
        sourceBlocks.push([new PVector(Math.round((e.clientX - (window.innerWidth - canvas.width)/2)/scale), Math.round((e.clientY - (window.innerHeight - canvas.height)/2)/scale)), 0]);
        hasSource = false;
        clearInterval(temp3);
        sourceClickStep++;
    } else {
        clearInterval(temp3);
        hasSource = false;
    }

    if(mouseX < N*scale && hasSquare){
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
/*
constanty draws a square at the current mouse x and y
*/

function squareHandler(){
        drawSquareAtPt(new PVector(mouseX - squareWidth/2, mouseY - squareWidth/2));

    canvas.onmousemove = function(eMove){
        hasSquare = true;
        mouseX = eMove.clientX - (window.innerWidth - canvas.width)/2;
        mouseY = eMove.clientY - (window.innerHeight - canvas.height)/2;
        drawSquareAtPt(new PVector(mouseX - squareWidth/2, mouseY - squareWidth/2));
     
    } 
    
}
/*
draws a source a the current mouse x and y
*/

function sourceHandler(){
    console.log("source");
    ctx.beginPath();
    ctx.rect(mouseX - scale/2,mouseY - scale, scale, scale);
    ctx.fillStyle = "black";
    ctx.fill()

    canvas.onmousemove = function(eMove){
            hasSource = true;
            mouseX = eMove.clientX - (window.innerWidth - canvas.width)/2;
            mouseY = eMove.clientY - (window.innerHeight - canvas.height)/2;
            ctx.beginPath();
            ctx.rect(mouseX - scale/2,mouseY - scale, scale, scale);
            ctx.fillStyle = "black";
            ctx.fill()
         
        
    }
}

/*
dras a vector to the current mouse x and y
*/

function vecHandler(){
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "blue";
    ctx.moveTo(sourceBlocks[sourceBlocks.length - 1][0].x * scale + scale/2, sourceBlocks[sourceBlocks.length - 1][0].y * scale + scale/2);
    ctx.lineTo(mouseX, mouseY);
    ctx.stroke();
    ctx.rect(sourceBlocks[sourceBlocks.length - 1][0].x * scale, sourceBlocks[sourceBlocks.length - 1][0].y * scale, scale, scale)
    ctx.fillStyle = "black";
    ctx.fill();
    
    canvas.onmousemove = function(eMove){
        hasSource = true;
        mouseX = eMove.clientX - (window.innerWidth - canvas.width)/2;
        mouseY = eMove.clientY - (window.innerHeight - canvas.height)/2;
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "blue";
        ctx.moveTo(sourceBlocks[sourceBlocks.length - 1].x, sourceBlocks[sourceBlocks.length - 1].y);
        ctx.lineTo(mouseX, mouseY);
        ctx.stroke();
        ctx.rect(sourceBlocks[sourceBlocks.length - 1][0].x * scale, sourceBlocks[sourceBlocks.length - 1][0].y * scale, scale, scale)
        ctx.fillStyle = "black";
        ctx.fill();
        
     
    
    }
}
    /*
    produces fluid at the pointer with an initial velocity that has the same direction vector as the mouse's movement direction (dFly/dFlx = dMy/dMx)
*/
function clickedHandler(e){
    canvas.onmousemove = function(eMove){
        let mouseDir = getMouseDirection(eMove);
        mouseDir.setMag(2);  
        mouseX = eMove.clientX - (window.innerWidth - canvas.width)/2;
        mouseY = eMove.clientY - (window.innerHeight - canvas.height)/2;
        Fluid1.addDensity(new PVector(Math.round(mouseX/scale), Math.round(mouseY/scale)), 0.9);
        Fluid1.addVelocity(Math.round(mouseX/scale) , Math.round(mouseY/scale) , mouseDir.x, mouseDir.y);
        }
    Fluid1.addDensity(new PVector(Math.round(mouseX/scale) , Math.round(mouseY/scale)), 0.9);
    Fluid1.addVelocity(Math.round(mouseX/scale) , Math.round(mouseY/scale) , (Math.random() * 3- 1.5), (Math.random() * 3- 1.5));
}

/*
 calculates the mouse's current vector
*/

function getMouseDirection(e){
    let deltaX = e.clientX - (window.innerWidth - canvas.width)/2 - PrevMouseX;
    let deltaY = e.clientY - (window.innerHeight - canvas.height)/2 - PrevMouseY;
    PrevMouseX = e.clientX - (window.innerWidth - canvas.width)/2;
    PrevMouseY = e.clientY - (window.innerHeight - canvas.height)/2;
    return new PVector(deltaX, deltaY);
   
}

/*
    determines if an x and y coordinate are on a source block and return the idex in the sourceblock array if true
*/

function isOnSource(sArr, x, y){
    for(let i = 0; i < sArr.length; i++){
        if(x >= (sArr[i][0].x-1)*scale &&
            x <= (sArr[i][0].x-1)*scale + scale*3 &&
            y >= (sArr[i][0].y-1)*scale &&
            y <= (sArr[i][0].y-1)*scale +scale*3){
                return i;
            } 
    }
    return -1;
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

/*
    the next 2 functions draw the source blocks and produce their stream of dye
*/
function addAllSourceBlocks(){
    sourceBlocks.forEach( e => {
        if(e[1] !== 0){
            addSource(e[0], e[1]);
         }
        });
}

function addSource(pos, vel){
    Fluid1.addDensity(pos, 0.9);
    Fluid1.addVelocity(pos.x, pos.y, vel.x, vel.y);

    ctx.beginPath();
    ctx.rect((pos.x - 1)*scale, (pos.y -1)* scale, scale*3, scale*3);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();

}

function drawOgSource(cords){
    ctx.beginPath();
    ctx.rect((cords.x + squareWidth/2- scale/2), (cords.y + squareWidth/2- scale/2), scale, scale);
    ctx.fillStyle = "black";
    ctx.fill();

    ctx.rect(cords.x, cords.y, squareWidth, squareWidth);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.closePath();

}

/*
    these next four functions are the button methods
*/

function clearAll(){
    clearFluid();
    clearBlocks();
    clearSources();
} 

function clearFluid(){
    Fluid1 = new fluid(0.1,0,0);
}

function clearBlocks(){
   squares = new Array;
}

function clearSources(){
    sourceBlocks = new Array;
}


function draw(){
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);   
    drawSquareAtPt(baseSquareCords);
    drawOgSource(baseSourceCords);
    drawVertLine();
    renderSquares();
    addAllSourceBlocks();
    Fluid1.step();  
    Fluid1.displayDensity();
  
    


}

