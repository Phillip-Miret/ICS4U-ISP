
const canvas =document.getElementById("Canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1920;
canvas.height = 1200;

let radius = 20;

let pArr = new Array(2); 

for(let i = 0; i < pArr.length; i++){
    pArr[i] = new particle(Math.random()* canvas.width, canvas.height/2, 0,0, 0,0,1);
}


let f1 = new PVector(1,0);
let gravity = new PVector(0,0);


let MuF = 0.05;




setInterval(draw, 20);




function drawAll(p){
    for(let i = 0; i < pArr.length; i++){
        if(pArr[i]===p)
            continue;
        else if(p.collision(pArr[i])){
            console.log("hit");
            p.collide(pArr[i]);
        }
    }

    p.drawParticle();
    p.applyForce(f1);
    tempGrav = gravity.mult(p.mass)  
    p.applyForce(tempGrav);
    p.applyFriction(MuF); 
} 



function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pArr.forEach(drawAll);
    

}