
const canvas =document.getElementById("Canvas");
const ctx = canvas.getContext("2d");


canvas.width = N*scale;
canvas.height = N*scale;

let mouseX;
let mouseY;


let Fluid1 = new fluid(0.1, 0,0);

setInterval(draw, 20);
canvas.addEventListener("mousemove", (e) => {
    mouseX = e.clientX - (window.innerWidth - canvas.width)/2;
    mouseY = e.clientY - (window.innerHeight - canvas.height)/2;
    Fluid1.addDensity(Math.round(mouseX/scale) , Math.round(mouseY/scale), 0.8);
    Fluid1.addVelocity(Math.round(mouseX/scale) , Math.round(mouseY/scale), (Math.random() * 5 - 2.5), (Math.random() * 5- 2.5) )
    console.log(mouseX + " " + mouseY);
})

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
   Fluid1.step();
    Fluid1.displayDensity();

}