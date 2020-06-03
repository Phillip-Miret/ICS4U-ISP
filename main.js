
const canvas =document.getElementById("Canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1920;
canvas.height = 1200;

let radius = 5;

let v1 = new PVector(5, 5)
let v2 = new PVector(7, 7)

let v3 = v1.add(v2);

console.log(v3);
console.log(v3.sub(v1));

console.log(v1);
console.log(v1.get());
console.log(v1.mag());

v1.set(10, 10)
console.log(v1);



//setInterval(draw, 20);


function particle(x, y, dx, dy){
    
    let location = new PVector(x, y);
    let velocity = new PVector(dx, dy);
    
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