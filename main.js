
const canvas =document.getElementById("Canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1920;
canvas.height = 1200;

let radius = 20;

let v1 = new PVector(5, 5)
let v2 = PVector.fromAngle(0);// new PVector(-10, -1)
v2.setMag(10);



let v3 = PVector.random2d();



console.log(v2);




let p1 = new particle(canvas.width/2, canvas.height/2, 0,0);



setInterval(draw, 20);


function particle(x, y, dx, dy){   
    this.location = new PVector(x, y);
    this.velocity = new PVector(dx, dy);
    
}





function drawParticle(particle){

    ctx.beginPath();
    ctx.arc(particle.location.x, particle.location.y, radius, 0, 2*Math.PI);
    ctx.fill();
    

    if(particle.location.x >= canvas.width || particle.location.x <= 0)
        particle.dx *= -1;

     if(particle.location.y >= canvas.height || particle.location.y <= 0)
        particle.dy *= -1;

 

    
}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
     drawParticle(p1);

//     ctx.beginPath();
//     ctx.arc(canvas.width/2, canvas.height/2, 20, 0, 2*Math.PI);
//     ctx.fill();
//     ctx.lineWidth = 10;
//     ctx.moveTo(canvas.width/2, canvas.height/2);
//     ctx.lineTo(canvas.width/2 + 20*v2.x, canvas.height/2 + 20*v2.y);
//     ctx.stroke();

//     console.log(v2.angleBetween(v1));
//    v2.rotate(1);

   
}