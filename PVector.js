/*
    a general vector class based off of the class of the same name including in processing.js
*/

class PVector{

    constructor(x, y){
        this.x = x;
        this.y = y;
    }  

    get() {
        let tempArr = [this.x, this.y]
        return  tempArr;
    }

    set(nx, ny){
        this.x = nx;
        this.y = ny;
    }

    static random2d(){
        let randAngle = Math.random()*(2*Math.PI)
        return new PVector (Math.cos(randAngle), Math.sin(randAngle));
    }

    static fromAngle(degrees){
        let inputRad = degrees*(Math.PI/180);
        return new PVector (Math.cos(inputRad), Math.sin(inputRad));
    }
   
    copy(){
        return new PVector (this.x, this.y);
    }

    mag(){
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    add(v2){
        let tempVec = new PVector( this.x + v2.x, this.y +v2.y);
        return tempVec;
    }

    sub(v2){
        let tempVec = new PVector( this.x - v2.x, this.y - v2.y);
        return tempVec;
    }

    mult(scalar){
        let tempVec = new PVector( this.x*scalar, this.y*scalar);
        return tempVec
    }

    div(scalar){
        let tempVec = new PVector( this.x/scalar, this.y/scalar);
        return tempVec
    }

    dist(v2){
      let tempVec = this.sub(v2);
      return Math.sqrt((Math.pow(tempVec.get()[0],2))+ Math.pow(tempVec.get()[1],2));
    }

    dot(v2){
        return ((this.x * v2.x) + (this.y * v2.y));
    }
    
    normalize(){
        if(this.x !== 0 && this.y !== 0){
        let tempMag = this.mag();
        this.x /= tempMag;
        this.y /= tempMag;
    } else if(this.x === 0 && this.y === 0){
    }
        else if(this.x === 0){
        let tempMag = this.mag();
        this.y /= tempMag;
    } else if(this.y === 0){
        let tempMag = this.mag();
        this.x /= tempMag;
    } 
}

    setMag(newMag){
        this.normalize();
        this.x *= newMag;
        this.y *= newMag;
    }

    heading(){    
        if(Math.atan2(this.y, this.x)*(180/Math.PI) < 0){
            return 360 + Math.atan2(this.y, this.x)*(180/Math.PI)
        } else{
        return Math.atan2(this.y, this.x)*(180/Math.PI);
        }
    }

    rotate(degrees){
        let tempMag = this.mag();
        let tempHeading = this.heading();
        this.x = tempMag*(Math.cos((degrees + tempHeading)*(Math.PI/180)));
        this.y = tempMag*(Math.sin((degrees + tempHeading)*(Math.PI/180)));
    }

    angleBetween(v2){
        return Math.acos((this.dot(v2))/(this.mag()*v2.mag()))*(180/Math.PI);
    }

    getTangent(){
        return new PVector(-this.y, this.x);
    }

    



}

// get() return the x and y values in an array
// set()	Set the components of the vector
// random2D()	Make a new 2D unit vector with a random direction.
// fromAngle()	Make a new 2D unit vector from an angle in degrees
// copy()	Get a copy of the vector
// mag()	Calculate the magnitude of the vector
// add()	Adds x, y, and z components to a vector, one vector to another, or two independent vectors
// sub()	Subtract x, y, and z components from a vector, one vector from another, or two independent vectors
// mult()	Multiply a vector by a scalar
// div()	Divide a vector by a scalar
// dist()	Calculate the distance between two points
// dot()	Calculate the dot product of two vectors
// normalize()	Normalize the vector to a length of 1
// setMag()	Set the magnitude of the vector
// heading()	Calculate the angle of rotation for this vector
// rotate()	Rotate the vector by an angle (2D only)
// angleBetween()	Calculate and return the angle between two vectors



