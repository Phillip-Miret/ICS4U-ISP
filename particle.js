class particle{
    constructor (x, y, dx, dy, ax, ay, mass){
        this.loc = new PVector(x, y); //location
        this.vel = new PVector(dx, dy);
        this.acc = new PVector(ax, ay);
        this.mass = mass;
    }
   
    drawParticle(){
        let nRadius = radius/**this.mass*/;

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
        let nVect = this.loc.sub(p2.loc);
        nVect.normalize();
        let uTan = nVect.getTangent();
        console.log(nVect + " " + uTan)

        let correction = nVect.mult(2*radius);
        let newVec = p2.loc.add(correction);
        this.loc = newVec;

        let a = this.vel;
        let b = p2.vel;

        let a_n = a.dot(nVect);
        let b_n = b.dot(nVect);
        let a_t = a.dot(uTan);
        let b_t = b.dot(uTan);

        let a_nFinal = (a_n * (this.mass - p2.mass) + 2 * p2.mass * b_n) / (this.mass + p2.mass);
        let b_nFinal = (b_n * (p2.mass - this.mass) + 2 * this.mass * a_n) / (this.mass + p2.mass);

        let a_nAfter = nVect.mult(a_nFinal);
        let b_nAfter = nVect.mult(b_nFinal);
        let a_tAfter = uTan.mult(a_t);
        let b_tAfter = uTan.mult(b_t);

        let aAfter = a_nAfter.add(a_tAfter);
        let bAfter = b_nAfter.add(b_tAfter);

        this.vel = aAfter;
        p2.vel = bAfter;


    }
}
