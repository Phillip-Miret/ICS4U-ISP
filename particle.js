class particle{
    constructor (x, y, dx, dy, ax, ay, mass){
        this.loc = new PVector(x, y); //location
        this.vel = new PVector(dx, dy);
        this.acc = new PVector(ax, ay);
        this.mass = mass;
    }
   
    drawParticle(){
        let nRadius = radius*this.mass;

        ctx.beginPath();
        ctx.arc(this.loc.x, this.loc.y, nRadius, 0, 2*Math.PI);
        ctx.fill();
         
        if(this.loc.x + nRadius > canvas.width){
            this.vel = this.vel.sub(this.acc.mult(2));
            this.loc.x = canvas.width-nRadius;
            this.vel.x *= -1;
        } if(this.loc.x - nRadius < 0){
            this.vel = this.vel.sub(this.acc.mult(2));
            this.loc.x = nRadius;
            this.vel.x *= -1;
        }
         
        if(this.loc.y + nRadius > canvas.height){  
            this.vel = this.vel.sub(this.acc.mult(2));
            this.loc.y = canvas.height-nRadius;
            this.vel.y *= -1;
            console.log(this.vel.y);
        } if(this.loc.y - nRadius < 0){
            this.vel = this.vel.sub(this.acc.mult(2));
            this.loc.y = nRadius;
            this.vel.y *= -1;
        }
        
        this.update();  
    
    }

    update(){
        this.loc = this.loc.add(this.vel);
        this.vel = this.vel.add(this.acc);
        this.acc = this.acc.mult(0);
    }


    applyForce(force){
        let tempForce = force.div(this.mass);
        this.acc = this.acc.add(tempForce);
    }

   applyFriction(MuF){
        let friction = new PVector(this.vel.get()[0], this.vel.get()[1]);
        friction.normalize();
        friction = friction.mult(-1 * MuF);
        this.applyForce(friction);
    }

    collision(p2){
        if(this.loc.dist(p2.loc) <= 2*radius){
            return true;
        } else
        return false;
    }
    collide(p2){
        
    }
}
