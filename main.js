
const canvas =document.getElementById("Canvas");
const ctx = canvas.getContext("2d");


canvas.width = N*scale;
canvas.height = N*scale;

let createPosition = (canvas.height/2)/scale;

let mouseX;
let mouseY;
var temp;


let Fluid1 = new fluid(0.1,0, 0);
console.log(Fluid1.scaleValue(6, 0, 10, 0,1));


setInterval(draw, 20);

canvas.addEventListener("mousedown", (e) => {
 temp = setInterval(clickedHandler, 20, e);
 // console.log(mousedown);
    //
});

canvas.addEventListener("mouseup", (e) => {
   // alert("stopped");
   clearInterval(temp);
   canvas.onmousemove = function(e){

   }
    
});

function clickedHandler(e){
    canvas.onmousemove = function(eMove){
mouseX = eMove.clientX - (window.innerWidth - canvas.width)/2;
mouseY = eMove.clientY - (window.innerHeight - canvas.height)/2;
// Fluid1.addDensity(10, 512/scale, 0.9);
// Fluid1.addVelocity(10 , 512/scale, 4, (Math.random() * 5- 2.5));
Fluid1.addDensity(Math.round(mouseX/scale) , Math.round(mouseY/scale) , 0.9);
Fluid1.addVelocity(Math.round(mouseX/scale) , Math.round(mouseY/scale) , (Math.random() * 3- 1.5), (Math.random() * 3- 1.5));
console.log("running");
    }
}
function createFluid(input){
    for(let i = 0; i < input; i++){
        Fluid1.addDensity(5, createPosition + 5*i, 0.9);
        Fluid1.addVelocity(5 , createPosition +5*i , 0.2, 0);

        Fluid1.addDensity(5, createPosition - 5*i, 0.9);
        Fluid1.addVelocity(5 , createPosition -5*i , 0.2, 0);
}

//     Fluid1.addDensity(10, canvas.height/scale, 0.9);
//     Fluid1.addVelocity(10 , canvas.height/scale, 4, 0);
}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
   Fluid1.step();
    Fluid1.displayDensity();
  
    createFluid(2);
    // Fluid1.addDensity(5, createPosition, 0.4);
    // Fluid1.addVelocity(5 , createPosition, 1, 0);

    // Fluid1.addDensity(5, createPosition - 10, 0.4);
    // Fluid1.addVelocity(5 , createPosition - 10, 1, 0);

    // Fluid1.addDensity(5, createPosition + 10, 0.4);
    // Fluid1.addVelocity(5 , createPosition + 10, 1, 0);


    
    // Fluid1.addDensity(2, canvas.height/2, 0.8);
    //  Fluid1.addVelocity(10, Math.round(canvas.height/2), 2, (Math.random() * 5- 2.5) );

}

