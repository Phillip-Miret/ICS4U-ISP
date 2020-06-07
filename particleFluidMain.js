
const canvas =document.getElementById("Canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1920;
canvas.height = 1200;

let mouseDown = false;

canvas.addEventListener("mousemove", (e) => {
    if(mouseDown){
        pArr.push(new particle(e.clientX - (window.innerWidth - canvas.width)/2 ,e.clientY - (window.innerHeight - canvas.height)/2, (Math.random() * 5 - 2.5), (Math.random() * 5- 2.5), 0, 0, 1));
    }
});

canvas.addEventListener("mousedown",(e) => {
     mouseDown = true;
});
canvas.addEventListener("mouseup",(e) => {
    mouseDown = false
});



let radius = 20;

let pArr = new Array(10); 

for(let i = 0; i < pArr.length; i++){
    pArr[i] = new particle((Math.random()* (canvas.width - radius - 1)) + (radius+ 1), (Math.random()* (canvas.height - radius - 1)) + (radius+ 1), 0,0, 0,0,1);
}


let f1 = new PVector(0.1,0);
let gravity = new PVector(0,0.1);


let MuF = 0;




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

  // gravity.rotate(0.001)

    // t++;
    // if (t > 600){
    //     gravity.rotate(90);
    //     t = 0;
    // }
   
} 



function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pArr.forEach(drawAll);

    console.log(mouseDown);

}