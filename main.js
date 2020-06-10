
const canvas =document.getElementById("Canvas");
const ctx = canvas.getContext("2d");


canvas.width = N*scale + 256;
canvas.height = N*scale;



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

//let tempDrawSource = false;

let sourceClickStep = 0;

let baseSquareCords = new PVector(((canvas.width-N*scale)/2 - squareWidth/2) + N*scale, canvas.height/3 - squareWidth/2);
let baseSourceCords  = new PVector(((canvas.width-N*scale)/2 - squareWidth/2) + N*scale,  canvas.height*2/3 - squareWidth/2);
let sourceBlocks = new Array;


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
        if(sourceClickStep === 1){
            //sourceClickStep = 0;
            console.log("other stuff")
            temp4 = setInterval(vecHandler, 20, mouseX, mouseY);  
        } else {
        temp = setInterval(clickedHandler, 20, e); 
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

canvas.addEventListener("mouseup", (e) => {
    if(sourceClickStep === 1){
        hasSource = false;
        sourceClickStep = 0;
        console.log(e.clientX + " " + e.clientY);
//let tempVec = new PVector(Math.round((e.clientX - (window.innerWidth - canvas.width)/2)), Math.round((e.clientY - (window.innerHeight - canvas.height)/2)));
        let tempVec = new PVector(Math.round(mouseX/scale), Math.round(mouseY/scale));
        tempVec = tempVec.sub(sourceBlocks[sourceBlocks.length-1][0]);
        tempVec.setMag(tempVec.mag()/(6*scale));
        sourceBlocks[sourceBlocks.length-1][1] = tempVec;
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

function squareHandler(){
        drawSquareAtPt(new PVector(mouseX - squareWidth/2, mouseY - squareWidth/2));

    canvas.onmousemove = function(eMove){
        hasSquare = true;
        mouseX = eMove.clientX - (window.innerWidth - canvas.width)/2;
        mouseY = eMove.clientY - (window.innerHeight - canvas.height)/2;
        drawSquareAtPt(new PVector(mouseX - squareWidth/2, mouseY - squareWidth/2));
     
    } 
    
}

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

function getMouseDirection(e){
    let deltaX = e.clientX - (window.innerWidth - canvas.width)/2 - PrevMouseX;
    let deltaY = e.clientY - (window.innerHeight - canvas.height)/2 - PrevMouseY;
    PrevMouseX = e.clientX - (window.innerWidth - canvas.width)/2;
    PrevMouseY = e.clientY - (window.innerHeight - canvas.height)/2;
    return new PVector(deltaX, deltaY);
   
}


    

// function createFluid(input){
//     for(let i = 0; i < input; i++){
//         Fluid1.addDensity(new PVector(5, createPosition + 5*i), 0.9);
//         Fluid1.addVelocity(5 , createPosition +5*i , 0.2, 0);

//         Fluid1.addDensity(new PVector(5, createPosition - 5*i), 0.9);
//         Fluid1.addVelocity(5 , createPosition -5*i , 0.2, 0);
// }

//}
function drawVertLine(){
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "black";
    ctx.moveTo(N*scale, 0);
    ctx.lineTo(N*scale, N*scale);
    ctx.stroke();
    ctx.closePath();
} 

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

