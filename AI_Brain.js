class Brain{
    constructor(){
        this.algorithmMultipliers = {};
        this.getRandomMultipliers();
    }

    clone(){
        let clone = new Brain();
        clone.algorithmMultipliers = Object.assign({},this.algorithmMultipliers);
        return clone;
    }

        //Used to deterimne best ranges of algorithm values
    // getRandomMultipliers(){
    //     this.algorithmMultipliers = {
    //         holeCountMultiplier: 10*random(9,15),
    //         blocksAboveHolesMultiplier: 10*random(6,9),
    //         pillarCountMultiplier: 10*random(1, 3),
    //         highestColumnMultiplier: 10*random(1,5),
    //         heightIncreaseMultiplier: 10*random(3,5),
    //         bumpinessMultiplier: 10*random(1,3),
    //         tetrisMultiplier: -100*random(0,2),
    //         linesClearedMultiplier: 10*random(-1,1)
    //     }
    // }
    getRandomMultipliers(){
        this.algorithmMultipliers = {
            highestColumnMultiplier: random(0,10),
            pillarCountMultiplier: random(0, 20),
            linesClearedMultiplier: random(-60,-10),
            holeCountMultiplier: random(0,200),
            tetrisMultiplier: random(-400,-50),
            blocksAboveHolesMultiplier: random(20, 60),
            bumpinessMultiplier: random(0,20),
            heightIncreaseMultiplier: random(0,2)
        }
    }

    evolveAlgorithm(){
        let mutationRate = 0.2;
        this.algorithmMultipliers.highestColumnMultiplier *= (random(1.0) < mutationRate) ? random(0.9,1.1) : 1; 
        this.algorithmMultipliers.linesClearedMultiplier *= (random(1.0) < mutationRate) ? random(0.9,1.1) : 1; 
        this.algorithmMultipliers.pillarCountMultiplier *= (random(1.0) < mutationRate) ? random(0.9,1.1) : 1; 
        this.algorithmMultipliers.holeCountMultiplier *= (random(1.0) < mutationRate) ? random(0.9,1.1) : 1; 
        this.algorithmMultipliers.blocksAboveHolesMultiplier *= (random(1.0) < mutationRate) ? random(0.9,1.1) : 1; 
        this.algorithmMultipliers.tetrisMultiplier *= (random(1.0) < mutationRate) ? random(0.9,1.1) : 1; 
        this.algorithmMultipliers.bumpinessMultiplier *= (random(1.0) < mutationRate) ? random(0.9,1.1) : 1; 
        this.algorithmMultipliers.heightIncreaseMultiplier *= (random(1.0) < mutationRate) ? random(0.9,1.1) : 1; 
    }

    calculateCostOfMatrix(blockMatrix){
        blockMatrix.cost = 
            blockMatrix.holeCount * this.algorithmMultipliers.holeCountMultiplier +
            blockMatrix.pillarCount * this.algorithmMultipliers.pillarCountMultiplier +
            blockMatrix.linesCleared * this.algorithmMultipliers.linesClearedMultiplier +
            blockMatrix.heightIncrease * this.algorithmMultipliers.heightIncreaseMultiplier +
            blockMatrix.blocksAboveHoles * this.algorithmMultipliers.blocksAboveHolesMultiplier +
            blockMatrix.bumpiness * this.algorithmMultipliers.bumpinessMultiplier +
            blockMatrix.gotTetris * this.algorithmMultipliers.tetrisMultiplier +
            blockMatrix.highestColumn * this.algorithmMultipliers.highestColumnMultiplier;
        return blockMatrix.cost;
    }

    writeMultipliers(posx, posy){
        push();
        let  multiplierStats = [`Hole Count: ${this.algorithmMultipliers.holeCountMultiplier.toFixed(2)}`,
            `Block above holes: ${this.algorithmMultipliers.blocksAboveHolesMultiplier.toFixed(2)}`,
            `Pillars: ${this.algorithmMultipliers.pillarCountMultiplier.toFixed(2)}`,
            `Maximum line height: ${this.algorithmMultipliers.highestColumnMultiplier.toFixed(2)}`,
            `Height increase: ${this.algorithmMultipliers.heightIncreaseMultiplier.toFixed(2)}`,
            `Bumpiness: ${this.algorithmMultipliers.bumpinessMultiplier.toFixed(2)}`,
            `Tetris: ${this.algorithmMultipliers.tetrisMultiplier.toFixed(2)}`,
            `Lines Cleared: ${this.algorithmMultipliers.linesClearedMultiplier.toFixed(2)}`];
        textAlign(LEFT, CENTER);
        fill(100);
        stroke(0);
        strokeWeight(1);
        let textGap = 30;
        textSize(20);
        noStroke();
        text("Multipliers", posx, posy);
        textSize(15);
        noStroke();
        for (let i = 0; i < multiplierStats.length; i++) {
            text(multiplierStats[i], posx, posy + (i + 1) * textGap);
        }
        pop();
    }
}