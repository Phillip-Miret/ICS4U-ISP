const N = 128; //resolution of screen
const scale = 8; // number to multiply resolution by
const iterations = 4; // determines the accuracy of the linear solve function



let adjustedWidth = Math.round(squareWidth/scale); // the effective width of a block adjusted for scale

function limit(num, min, max){
    const MIN = min;
    const MAX = max;
    const parsed = parseInt(num)
    return Math.min(Math.max(parsed, MIN), MAX)
  }
/*
  given a 2d coordinate returns an equivalent position in a 1D array based on row-major order
*/
function IX (x, y){
    x = limit(x, 0 ,N-1);
    y = limit(y, 0, N-1);
    return x + (y * N);
}
/* 
    the same as the previous function, but made to accomodate vectors
*/
function IX2(pos){
   let x  = limit(pos.x, 0 ,N-1);
  let y = limit(pos.y, 0 ,N-1);
    return x + (y * N);

}

/*
    given an index in the 1D Array, returns the original 2D Coordinates 
*/
function RIX (index){
    let y = Math.floor(index/N);
    let x = index % N;
    return [x,y];
}

function  scaleValue(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }

/*
  actually draws the squares on the screen ensuring that they line up with the N by N grid
*/
function renderSquares(){
   
    let tempPV;
  
    squares.forEach(e => {  
            tempPV = new PVector(Math.round(scaleValue(e.x, 0, N*scale, 0, N)), Math.round(scaleValue(e.y, 0, N*scale, 0, N)));    
            ctx.beginPath();    
            ctx.rect(tempPV.x*scale, tempPV.y*scale, Math.round(squareWidth), Math.round(squareWidth));
            ctx.fillStyle = "blue";
            ctx.fill();
            ctx.rect(tempPV.x*scale , tempPV.y*scale, Math.round(squareWidth), Math.round(squareWidth));
            ctx.strokeStyle = "#00FFFF";
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.closePath();   
                    
        
    });

}
/*
     fills in a specific index of the 1D array
*/

function drawAtIndex(index, colour){
    let XY = RIX(index);
    ctx.beginPath();
    ctx.rect(XY[0]*scale, XY[1]*scale, scale, scale);
    ctx.fillStyle = colour;
    ctx.fill();
    ctx.closePath()
}

class fluid {

    constructor( dt, diffusion, viscosity){
        this.size = N;
        this.dt = dt;  
        this.diff = diffusion;
        this.visc = viscosity;
        
        this.s = new Array(N*N).fill(0); //current density
        this.density = new Array(N*N).fill(0); // the resulting density
        
        this.Vx = new Array(N*N).fill(0); 
        this.Vy = new Array(N*N).fill(0);

        this.Vx0 = new Array(N*N).fill(0);
        this.Vy0 = new Array(N*N).fill(0);     
    }

    /*
    using the solutions to the Navier-Stokes equations, (done by the 3 functions diffuse, project, and advection)
    it is important to note that this fluid is imcompressible (like water) meaning density does not change when pressure does
    so density is just a reference to density of the black dye allowing us to see the fluid's motion
  
*/

    step(){
    
        let visc     = this.visc;
        let diff     = this.diff;
        let dt       = this.dt;
        let Vx     = this.Vx; 
        let Vy      = this.Vy;
        let Vx0     = this.Vx0;
        let Vy0     = this.Vy0;
        let s       = this.s;
        let density = this.density;
       // 1. diffuse the x and y velocities. 
        
        this.diffuse(1, Vx0, Vx, visc, dt); 
        this.diffuse(2, Vy0, Vy, visc, dt);

        //2. fix the velocities to keep the fluid incomressible
         this.project(Vx0, Vy0, Vx, Vy);

        //3. move the velocities of the fluid according to the velocity field        
        this.advection(1, Vx, Vx0, Vx0, Vy0, dt);
        this.advection(2, Vy, Vy0, Vx0, Vy0, dt);
    
         //4. fix the velocities (again) to keep the fluid incomressible
        this.project(Vx, Vy, Vx0, Vy0);

        //5. diffuse the dye
        this.diffuse(0, s, density, diff, dt);

        //6. make the dye's velocity follow the velocity field
        this.advection(0, density, s, Vx, Vy, dt);

        // cleans up the squares
        this.clearSquares();

        }

        /*
        along with the function square_bnds which does the actual 
        collision response, this function just cleans 
        up any fluid that was either initially inside the block or that ends up in the block
*/

        clearSquares(){
            let adjX;
            let adjY;
            squares.forEach(e =>{
                adjX = Math.round(Math.round(scaleValue(e.x, 0, N*scale, 0, N)));
                adjY = Math.round(Math.round(scaleValue(e.y, 0, N*scale, 0, N)));
                for(let i = 0; i < adjustedWidth; i++){
                    for(let j = 0; j < adjustedWidth; j++){
                        this.density[IX(adjX + i, adjY + j)] = 0;
                }
            }
        });
    }
    
 /*
    draws each grid point with a transparency proportinal to the density of dye at that point in the array 
 */
     displayDensity(){
            for(let i = 0; i < N; i++){
                for(let j = 0; j < N; j++){
                    let tempPV = new PVector(i, j);
                    let d = this.density[IX2(tempPV)];

                    if (d > 1){
                        d = 1;
                    }
                
                ctx.beginPath();
                ctx.globalAlpha = d;
                ctx.rect(tempPV.x*scale, tempPV.y*scale, scale, scale);
                ctx.fillStyle = "black";
                ctx.fill();    
                ctx.closePath();   
                ctx.globalAlpha = 1;             
                }
            }
        } 

/*
        adds a certain amount of density at a point, defined by a vector input
 */
    addDensity(pos, amount){
        let index = IX2(pos);
        this.density[index] += amount;
    }

    /*
        adds a certain amount of x and y velocity at a point, defined by a coordinate input
 */

    addVelocity(x, y, amountX, amountY){
        let index = IX(x,y);
        this.Vx[index] += amountX;
        this.Vy[index] += amountY;

    } 

   /*
      calcultes the diffusion constant and then passes it into the linear solve function 
 */

   

        diffuse(b, xArr, x0Arr, diff, dt){
            let a = dt * diff * (N - 2) * (N - 2); // this is a diffusion constant
            this.lin_solve(b, xArr, x0Arr, a, a);

        }

        /* While not impossible, after running through the diffusion and Advection methods it is highly unlikely that the density of the fluid (not the dye) will remain consant, 
        since this is neccecary to simulate incompressible fluids we need a projection method to make sure that the velocities follow conservation of mass
        explination of the equations: 
        https://math.berkeley.edu/~chorin/chorin67.pdf 
        */

        project(velocXArr, velocYArr, pArr, divArr){ 
        
            for (let j = 1; j < N - 1; j++) {
                for (let i = 1; i < N - 1; i++) {
                    divArr[IX(i, j)] = -0.5*(velocXArr[IX(i+1, j )] - velocXArr[IX(i-1, j )]+ velocYArr[IX(i  , j+1)]- velocYArr[IX(i  , j-1 )])/N;
                    pArr[IX(i, j)] = 0;
                } 
            }
        
        this.set_bnd(0, divArr); 
        this.set_bnd(0, pArr);
        this.lin_solve(0, pArr, divArr, 1, 1.25);
        
            for (let j = 1; j < N - 1; j++) {
                for (let i = 1; i < N - 1; i++) {
                    velocXArr[IX(i, j)] -= 0.5 * (pArr[IX(i+1, j)] - pArr[IX(i-1, j)]) * N;
                    velocYArr[IX(i, j)] -= 0.5 * (pArr[IX(i, j+1)] - pArr[IX(i, j-1)]) * N;
                
            }
        }
        this.set_bnd(1, velocXArr);
        this.set_bnd(2, velocYArr);
    
    }

/*
    based on the velocity field, advection calulates the velocity of each gridPoint (it moves things around) 
    specifically this function looks at the current velocity, compares its value to its previous value in the velocity field, 
    seeing how far the velocity will push the gridPoint. then taking a weighted average and appling that value to the current gridpoint

*/


    advection(b, dArr, d0Arr,  velocXArr, velocYArr, dt){ 
        let i0, i1, j0, j1;
        
        let dtx = dt * (N - 2);
        let dty = dt * (N - 2);
      
        let s0, s1, t0, t1;
        let tmp1, tmp2, x, y;
        
           
            for( let j = 1; j < N - 1; j++) { 
                for( let i = 1; i < N - 1; i++) {
                    tmp1 = dtx * velocXArr[IX(i, j)];
                    tmp2 = dty * velocYArr[IX(i, j)];
                
                    x  = i - tmp1; 
                    y  = j - tmp2;
                
                    
                    if(x < 0.5) x = 0.5; 
                    if(x > N + 0.5) x = N + 0.5; 
                    i0 = Math.floor(x); 
                    i1 = i0 + 1.0;
                    if(y < 0.5) y = 0.5; 
                    if(y > N + 0.5) y = N + 0.5; 
                    j0 = Math.floor(y);
                    j1 = j0 + 1.0; 
                
                    s1 = x - i0; 
                    s0 = 1.0 - s1; 
                    t1 = y - j0; 
                    t0 = 1.0 - t1;
                    
                    
                    let i0i = i0;
                    let i1i = i1;
                    let j0i = j0;
                    let j1i = j1;
                
                    
                    dArr[IX(i, j)] = 
                    
                        s0 * ( t0 *  d0Arr[IX(i0i, j0i)] + t1 *  d0Arr[IX(i0i, j1i)]) +
                    s1 * ( t0 *  d0Arr[IX(i1i, j0i)] +  t1 *  d0Arr[IX(i1i, j1i)]);
                }
            }
        
            this.set_bnd(b, dArr);
    }

   
    /*
     a method for apporximating a system of equations
     since every grid point (x) is a function of the grid points above, below, left, right of it and its own previous value (x0)
     GP = gridpoint
    the equation to model this x = x0 + diffusionConstant *(GPBottom + GPTop GPRight + GPLeft) / (1+4*DiffC)
    the large the number of iterations the more accurate this solution gets

    */

    lin_solve(b, x, x0, diffC, c){
    let cRecip = 1.0 / (1 +4*c); // reciprocal of the diffusion constant regards to this equation
        for (let k = 0; k < iterations; k++) { //this line determines how accurate the linear solve calculation will be based on the # of iterations in reality it does not make a huge difference
            for (let j = 1; j < N - 1; j++) {
                for (let i = 1; i < N - 1; i++) {
                    x[IX(i, j)] =
                        (x0[IX(i, j)] + diffC*(x[IX(i  , j-1)] + x[IX(i  , j+1)] + x[IX(i+1, j)] + x[IX(i-1, j)])) * cRecip;
                    }
                }
            
                this.set_bnd(b, x);
        }
    }


    /*
        defines the borders of the simulation, b references if we are dealing with either Xs or Ys, all this function does is at a gridpoint at the border, it will look at 
        the gridpoint 1 point further towards the centre and make the closer gridPoint's velocity or density equal and opposite, directing the fluid back in, and if the fluid is not referenceing
         x it just makes sure the velocity is the same and the same with y
    */
    set_bnd(b, xArr){
    
            for(let i = 1; i < N - 1; i++) { // y bounds
                if(b == 2){
                    xArr[IX(i, 0)] =  - xArr[IX(i, 1)];
                    xArr[IX(i,N-1)] = - xArr[IX(i, N-2)];

                }else{
                    xArr[IX(i, 0)] = xArr[IX(i, 1)];
                    xArr[IX(i,N-1)] =  xArr[IX(i, N-2)];
                }     
            }
          
            for(let j = 1; j < N - 1; j++) { // x bounds
                if(b == 1){
                    xArr[IX(0,j)] = -xArr[IX(1,j)];
                    xArr[IX(N-1, j)] = -xArr[IX(N-2, j)];
                } else {
                    xArr[IX(0,j)] = xArr[IX(1,j)];
                    xArr[IX(N-1, j)] = xArr[IX(N-2, j)];
                }
            }
            //dealing with the corners, we take the average of the gridpoints directly adjacent to the corner 
        
        xArr[IX(0, 0)] = (xArr[IX(1, 0)] + xArr[IX(0, 1)])/2;
                                    
        xArr[IX(0, N-1)] = (xArr[IX(1, N-1)] + xArr[IX(0, N-2)])/2;
                                    
        xArr[IX(N-1, 0)] = (xArr[IX(N-2, 0)] + xArr[IX(N-1, 1)])/2;
                                    
        xArr[IX(N-1, N-1)] = (xArr[IX(N-2, N-1)] + xArr[IX(N-1, N-2)])/2;

      this.squareBnds(b, xArr);
                            
        } 

        /*
        this works the exact same way as the set bouds function, the only difference is that since this is a square in the simulation instead of keeping the fluid in, 
        it has to keep it out therefore, you compare the velocity at the surface of the square to the velcity 1 gridpoint further away from the 
        surface and make the gridpoit at the surface equal and opposite
        */


        squareBnds(b, xArr){
            let adjW = Math.round(squareWidth/scale);
            let adjX;
            let adjY;
            squares.forEach(e => {
                adjX = Math.round(Math.round(scaleValue(e.x, 0, N*scale, 0, N)));
                adjY = Math.round(Math.round(scaleValue(e.y, 0, N*scale, 0, N)));
            
                for(let i = 0; i < adjW ; i++){ //y
                    if(b==2){
                        xArr[IX(adjX + i,adjY)] = -xArr[IX(adjX + i,adjY-1)];
                        xArr[IX(adjX + i,(adjY + adjW -1))] = -xArr[IX(adjX + i,adjY + adjW)];    
                    } 

                }

                for( let j = 0; j < adjW; j++){ //X
                    if(b==1){  
                        xArr[IX(adjX, adjY + j)] = -xArr[IX(adjX - 1, adjY + j)];
                        xArr[IX(adjX + adjW -1, adjY + j)] = -xArr[IX(adjX + adjW ,adjY + j)];

                    } 
                }
          
           
                // same idea with this corner function except once again, the points which you compare are inverted when compared to the simulation borders

            xArr[IX(adjX-1, adjY-1)] = (xArr[IX(adjX-2, adjY-1)] + xArr[IX(adjX-1, adjY-2)])/2;
                                    
             xArr[IX(adjX-1, (adjY + adjW))] = (xArr[IX(adjX-2, (adjY + adjW))] + xArr[IX(adjX -1, (adjY + adjW +1))])/2;
                                      
            xArr[IX((adjX + adjW), adjY -1)] = (xArr[IX((adjX + adjW+1), adjY -1)] + xArr[IX((adjX + adjW), adjY-2)])/2;
                                        
            xArr[IX((adjX + adjW),(adjY + adjW))] = (xArr[IX((adjX + adjW +1),(adjY + adjW))] + xArr[IX((adjX + adjW), (adjY + adjW +1))])/2;
        });
    }
      

   

    
}

