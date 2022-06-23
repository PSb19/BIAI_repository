let blockSize = 35; //size of block in pixels;
let gameFrameRate = 10;

//Handle population:
let population;
let populationSize= 64;
//controls:
let pause=false;

function setup(){
    //canvas setup:
    window.canvas = createCanvas(800,800);
    window.canvas.parent("canvas");
    frameRate(gameFrameRate);
    //Population setup
    population = new Population(populationSize);
}

function draw(){
    if (!population.allGamesLost()) { 
        population.draw();            
        if (!pause)                   
        population.update();      
    } else {                      
        population.naturalSelection();     
    }
}

function keyPressed(){
    if(key === ' '){
        pause =! pause;
    }
}
