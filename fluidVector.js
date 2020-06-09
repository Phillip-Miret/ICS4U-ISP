const N = 128;
const scale = 8;
const iterations = 4;

let maxP = 0;

function limit(num, min, max){
    const MIN = min;
    const MAX = max;
    const parsed = parseInt(num)
    return Math.min(Math.max(parsed, MIN), MAX)
  }

function IX (x, y){
    x = limit(x, 0 ,N-1);
    y = limit(y, 0, N-1);
    return x + (y * N);
}

function IX2(pos){
   let x  = limit(pos.x, 0 ,N-1);
  let y = limit(pos.y, 0 ,N-1);
    return x + (y * N);

}

function renderSquares(){
    let adjWidth = Math.round(squareWidth/scale);
  
    squares.forEach(e => {        
        for(let i = 0; i < adjWidth*adjWidth; i++){  
            ctx.beginPath();    
            ctx.rect(e.x, e.y, Math.round(squareWidth), Math.round(squareWidth));
            ctx.fillStyle = "blue";
            ctx.fill();
            ctx.rect(e.x, e.y, Math.round(squareWidth), Math.round(squareWidth));
            ctx.strokeStyle = "#00FFFF";
            ctx.stroke();
            ctx.closePath();             
        }
    });

}

class fluid {

    constructor( dt, diffusion, viscosity){
        this.size = N;
        this.dt = dt;
        this.diff = diffusion;
        this.visc = viscosity;
        
        this.s = new Array(N*N).fill(0); 
        this.density = new Array(N*N).fill(0);

       // this.V = new Array(N*N).fill(new PVector(0,0));
        
        this.Vx = new Array(N*N).fill(0); 
        this.Vy = new Array(N*N).fill(0);

        //this.V0 = new Array(N*N).fill(new PVector(0,0));

        this.Vx0 = new Array(N*N).fill(0);
        this.Vy0 = new Array(N*N).fill(0);     
    }

    step(){
    
        let visc     = this.visc;
        let diff     = this.diff;
        let dt       = this.dt;
      //  let V        = this.V;// everything after this is an array;
        let Vx     = this.Vx; 
        let Vy      = this.Vy;
        let V0      = this.V0;
        let Vx0     = this.Vx0;
        let Vy0     = this.Vy0;
        let s       = this.s;
        let density = this.density;
        
        this.diffuse(1, Vx0, Vx, visc, dt);
        this.diffuse(2, Vy0, Vy, visc, dt);
    
         this.project(Vx0, Vy0, Vx, Vy);
        
        this.advection(1, Vx, Vx0, Vx0, Vy0, dt);
        this.advection(2, Vy, Vy0, Vx0, Vy0, dt);
    
        
        this.project(Vx, Vy, Vx0, Vy0);
        
        this.diffuse(0, s, density, diff, dt);
        this.advection(0, density, s, Vx, Vy, dt);

        }

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


    addDensity(pos, amount){
        let index = IX2(pos);
        this.density[index] += amount;
    }

    addVelocity(x, y, amountX, amountY){
        let index = IX(x,y);
        this.Vx[index] += amountX;
        this.Vy[index] += amountY;

    } 

   

   

        diffuse(b, xArr, x0Arr, diff, dt){
            let a = dt * diff * (N - 2) * (N - 2);
            this.lin_solve(b, xArr, x0Arr, a, 1 + 6 * a);

        }

      

        project(velocXArr, velocYArr, pArr, divArr){
        
            for (let j = 1; j < N - 1; j++) {
                for (let i = 1; i < N - 1; i++) {
                    divArr[IX(i, j)] = -0.5*(velocXArr[IX(i+1, j )] - velocXArr[IX(i-1, j )]+ velocYArr[IX(i  , j+1)]- velocYArr[IX(i  , j-1 )])/N;
                    pArr[IX(i, j)] = 0;
                } 
            }
        
        this.set_bnd(0, divArr); 
        this.set_bnd(0, pArr);
        this.lin_solve(0, pArr, divArr, 1, 6);
        
            for (let j = 1; j < N - 1; j++) {
                for (let i = 1; i < N - 1; i++) {
                    velocXArr[IX(i, j)] -= 0.5 * (pArr[IX(i+1, j)] - pArr[IX(i-1, j)]) * N;
                    velocYArr[IX(i, j)] -= 0.5 * (pArr[IX(i, j+1)] - pArr[IX(i, j-1)]) * N;
                
            }
        }
        this.set_bnd(1, velocXArr);
        this.set_bnd(2, velocYArr);
    
    }


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

   


    lin_solve(b, x, x0, a, c){
    let cRecip = 1.0 / c;
        for (let k = 0; k < iterations; k++) { //this line determines how accurate the linear solve calculation will be based on the # of iterations in reality it does not make a noticible difference to the eye
            for (let j = 1; j < N - 1; j++) {
                for (let i = 1; i < N - 1; i++) {
                    x[IX(i, j)] =
                        (x0[IX(i, j)] + a*(x[IX(i+1, j)] + x[IX(i-1, j)] + x[IX(i  , j+1)] + x[IX(i  , j-1)])) * cRecip;
                    }
                }
            
                this.set_bnd(b, x);
        }
    }


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
        
        xArr[IX(0, 0)]       = 0.5 * (xArr[IX(1, 0)] + xArr[IX(0, 1)]);
                                    
        xArr[IX(0, N-1)]     = 0.5 * (xArr[IX(1, N-1)] + xArr[IX(0, N-2)]);
                                    
        xArr[IX(N-1, 0)]     = 0.5 * (xArr[IX(N-2, 0)] + xArr[IX(N-1, 1)]);
                                    
        xArr[IX(N-1, N-1)]   = 0.5 * (xArr[IX(N-2, N-1)] + xArr[IX(N-1, N-2)]);

        //squareBnds(b, xArr);
                            
        } 


        squareBnds(b, xArr){

        }
      

    scaleValue(x, in_min, in_max, out_min, out_max) {
        return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
      }

    
}

