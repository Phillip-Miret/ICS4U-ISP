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
}

