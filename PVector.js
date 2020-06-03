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
    random2d(){
        

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

    mult(scal){
        let tempVec = new PVector( this.x*scal, this.y*scal);
        return tempVec
    }

    div(scal){
        let tempVec = new PVector( this.x/scal, this.y/scal);
        return tempVec
    }

}

// get() return the x and y values in an array
// set()	Set the components of the vector
// random2D()	Make a new 2D unit vector with a random direction.
// fromAngle()	Make a new 2D unit vector from an angle
// copy()	Get a copy of the vector
// mag()	Calculate the magnitude of the vector
// add()	Adds x, y, and z components to a vector, one vector to another, or two independent vectors
// sub()	Subtract x, y, and z components from a vector, one vector from another, or two independent vectors
// mult()	Multiply a vector by a scalar
// div()	Divide a vector by a scalar
// dist()	Calculate the distance between two points
// dot()	Calculate the dot product of two vectors
// normalize()	Normalize the vector to a length of 1
// limit()	Limit the magnitude of the vector
// setMag()	Set the magnitude of the vector
// heading()	Calculate the angle of rotation for this vector
// rotate()	Rotate the vector by an angle (2D only)
// lerp()	Linear interpolate the vector to another vector
// angleBetween()	Calculate and return the angle between two vectors


