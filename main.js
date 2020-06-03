const canvas =document.getElementById("Canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1920;
canvas.height = 1200;

let radius = 5;
let p1 = new particle(5,5, 2, 2)

setInterval(draw, 20);

function particle(x, y, dx, dy){
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
}

function drawParticle(particle){

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, radius, 0, 2*Math.PI);
    ctx.fill();
    particle.x += particle.dx;
    particle.y += particle.dy;

    if(particle.x >= canvas.width || particle.x <= 0)
        particle.dx *= -1;

     if(particle.y >= canvas.height || particle.y <= 0)
        particle.dy *= -1;

 

    
}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawParticle(p1);
}