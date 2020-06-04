
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




let p1 = new particle(canvas.width/2, canvas.height/2, 5,5, 0,0);



setInterval(draw, 20);


function particle(x, y, dx, dy, ax, ay){   
    this.loc = new PVector(x, y); //location
    this.vel = new PVector(dx, dy);
    this.acc = new PVector(ax, ay);
    
}





function drawParticle(p){

    ctx.beginPath();
    ctx.arc(p.loc.x, p.loc.y, radius, 0, 2*Math.PI);
    ctx.fill();
    

    if(p.loc.x >= canvas.width || p.loc.x <= 0)
        p.vel.x *= -1;

     if(p.loc.y >= canvas.height || p.loc.y <= 0)
        p.vel.y *= -1;
    
   // p.acc = PVector.random2d();

    p.loc = p.loc.add(p.vel);
    p.vel = p.vel.add(p.acc);

}

// window.addEventListener('mousemove', function(e){
//     console.log(e);
//     console.log(e.clientX -(window.innerWidth-canvas.width )/2);
//     console.log(e.clientY - (window.innerHeight-canvas.height)/2)
  
//     let mouse = new PVector(e.clientX -(window.innerWidth-canvas.width )/2, e.clientY - (window.innerHeight-canvas.height)/2);
//     console.log(mouse);
//     mouse = mouse.sub(p1.loc);
//     mouse.setMag(0.1);
//     p1.acc = mouse;
// });




function draw(e){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
     drawParticle(p1);

  
        // p1.acc.set(event.clientX, event.clientY)
    

 
}