const N = 4;
const scale = 128;
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

class fluid {

    constructor( dt, diffusion, viscosity){
        this.size = N
        this.dt = dt;
        this.diff = diffusion;
        this.visc = viscosity;
        
        this.s = new Array(N*N).fill(0); 
        this.density = new Array(N*N).fill(0);
        
       
        
        this.Vx = new Array(N*N).fill(0);
        this.Vy = new Array(N*N).fill(0);
        
        this.Vx0 = new Array(N*N).fill(0);
        this.Vy0 = new Array(N*N).fill(0);     
    }

    addDensity(x, y, amount){
        let index = IX(x,y);
        

        this.density[index] += amount;
    }

    addVelocity(x, y, amountX, amountY){
        let index = IX(x,y);
        this.Vx[index] += amountX;
        this.Vy[index] += amountY;

    } 

    displayDensity(){
     
    
        for(let i = 0; i < N; i++){
            for(let j = 0; j < N; j++){
                let x = i*scale;
                let y = j*scale;
                
             
                let d = this.density[IX(i, j)];


                ctx.beginPath();
                if (d > 1){
                    d = 1;
                }

               ctx.globalAlpha = d;
               
               
              
                ctx.rect(x, y, scale, scale);
                ctx.fill();
                ctx.closePath();

                
            }
        }
    }

    diffuse(b, xArr, x0Arr, diff, dt){
        let a = dt * diff * (N - 2) * (N - 2);
        this.lin_solve(b, xArr, x0Arr, a, 1 + 6 * a);

    }
    project(velocXArr, velocYArr, pArr, divArr){
    
        for (let j = 1; j < N - 1; j++) {
            for (let i = 1; i < N - 1; i++) {
                divArr[IX(i, j)] = -0.5*( // there was an f here
                         velocXArr[IX(i+1, j )]
                        -velocXArr[IX(i-1, j )]
                        +velocYArr[IX(i  , j+1)]
                        -velocYArr[IX(i  , j-1 )]
                       
                    )/N;
                pArr[IX(i, j)] = 0;
            }
        }
    
    this.set_bnd(0, divArr); 
    this.set_bnd(0, pArr);
    this.lin_solve(0, pArr, divArr, 1, 6);
    
        for (let j = 1; j < N - 1; j++) {
            for (let i = 1; i < N - 1; i++) {
                velocXArr[IX(i, j)] -= 0.5 * (  pArr[IX(i+1, j)]
                                                -pArr[IX(i-1, j)]) * N;
                velocYArr[IX(i, j)] -= 0.5 * (  pArr[IX(i, j+1)]
                                                -pArr[IX(i, j-1)]) * N;
             
        }
    }
    this.set_bnd(1, velocXArr);
    this.set_bnd(2, velocYArr);
   
}
advect(b, dArr, d0Arr,  velocXArr, velocYArr, dt)
{
    let i0, i1, j0, j1;
    
    let dtx = dt * (N - 2);
    let dty = dt * (N - 2);
   
    
    let s0, s1, t0, t1;
    let tmp1, tmp2, x, y;
    
    let Nfloat = N;
    let ifloat, jfloat;
    let i, j;
    
  
        for(j = 1, jfloat = 1; j < N - 1; j++, jfloat++) { 
            for(i = 1, ifloat = 1; i < N - 1; i++, ifloat++) {
                tmp1 = dtx * velocXArr[IX(i, j)];
                tmp2 = dty * velocYArr[IX(i, j)];
               
                x    = ifloat - tmp1; 
                y    = jfloat - tmp2;
             
                
                if(x < 0.5) x = 0.5; 
                if(x > Nfloat + 0.5) x = Nfloat + 0.5; 
                i0 = Math.floor(x); 
                i1 = i0 + 1.0;
                if(y < 0.5) y = 0.5; 
                if(y > Nfloat + 0.5) y = Nfloat + 0.5; 
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
    for (let k = 0; k < iterations; k++) { 
        for (let j = 1; j < N - 1; j++) {
            for (let i = 1; i < N - 1; i++) {
                x[IX(i, j)] =
                    (x0[IX(i, j)]
                        + a*(x[IX(i+1, j )]
                                +x[IX(i-1, j)]
                                +x[IX(i  , j+1)]
                                +x[IX(i  , j-1)]
                             
                         )) * cRecip;
                }
            }
        
            this.set_bnd(b, x);
    }
}


set_bnd(b, xArr){
  
        for(let i = 1; i < N - 1; i++) {
            xArr[IX(i, 0 )] = b == 2 ? -xArr[IX(i, 1 )] : xArr[IX(i, 1 )];
            xArr[IX(i, N-1)] = b == 2 ? -xArr[IX(i, N-2)] : xArr[IX(i, N-2)];
        }
    
    
        for(let j = 1; j < N - 1; j++) {
            xArr[IX(0  , j)] = b == 1 ? -xArr[IX(1  , j)] : xArr[IX(1  , j)];
            xArr[IX(N-1, j)] = b == 1 ? -xArr[IX(N-2, j)] : xArr[IX(N-2, j)];
        }
    
    
    xArr[IX(0, 0)]       = 0.5 * (xArr[IX(1, 0)]
                                  + xArr[IX(0, 1)]);
                                 
    xArr[IX(0, N-1)]     = 0.5 * (xArr[IX(1, N-1)]
                                  + xArr[IX(0, N-2)]);
                                  
    xArr[IX(N-1, 0)]     = 0.5 * (xArr[IX(N-2, 0)]
                                  + xArr[IX(N-1, 1)]);
                                 
    xArr[IX(N-1, N-1)]   = 0.5 * (xArr[IX(N-2, N-1)]
                                  + xArr[IX(N-1, N-2)]);
                          
    }

    step(){
  
    let visc     = this.visc;
    let diff     = this.diff;
    let dt       = this.dt;
    let Vx     = this.Vx; // everything after this is an array;
    let Vy      = this.Vy;
    let Vx0     = this.Vx0;
    let Vy0     = this.Vy0;
    let s       = this.s;
    let density = this.density;
    
    this.diffuse(1, Vx0, Vx, visc, dt);
    this.diffuse(2, Vy0, Vy, visc, dt);
 
   this.project(Vx0, Vy0, Vx, Vy);
    
   this.advect(1, Vx, Vx0, Vx0, Vy0, dt);
   this.advect(2, Vy, Vy0, Vx0, Vy0, dt);
  
    
   this.project(Vx, Vy, Vx0, Vy0);
    
   this.diffuse(0, s, density, diff, dt);
   this.advect(0, density, s, Vx, Vy, dt);
    }

    scaleValue(x, in_min, in_max, out_min, out_max) {
        return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
      }

    
}

