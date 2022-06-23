class Population{
    constructor(size){
        this.environments = [];
        this.totalFitness = 0;
        this.generation = 1;
        this.bestScore = 0;

        this.batchSize = 16;
        this.currentBatch = 0;
        this.numberOfBatches = Math.ceil(size/this.batchSize);
        this.environmentsPerRow = Math.ceil(Math.sqrt(this.batchSize));
        this.environmentsPerColumn = Math.ceil(Math.sqrt(this.batchSize));

        this.environmentWidth = canvas.width / this.environmentsPerRow;
        this.environmentHeight = canvas.height / this.environmentsPerColumn;
        for (let i = 0; i < size; i++) {
            this.environments.push(new Environment(this.environmentWidth, this.environmentHeight));
        }
    }

    draw() {
        push();
        background(240);
        textSize(20);
        fill(100);
        stroke(100);
        textAlign(CENTER,CENTER);
        text("Gen: " + this.generation + "\t\t Batch: " + (this.currentBatch +1) 
            + "\t\tAverage Score: " + (this.totalFitness/this.environments.length).toFixed(2)
            + "\t\tBest Score: " + (this.bestScore),canvas.width/2,25 );
        translate(0, 50);
        scale(1, (canvas.height - 50) / canvas.height);
        let x = 0;
        let y = 0;
        let currentBatch = this.getCurrentBatch();
        for (let i = 0; i < currentBatch.length; i++) {
            push();
            translate(x * this.environmentWidth, y * this.environmentHeight);
            currentBatch[i].draw();
            x++;
            if (x >= this.environmentsPerRow) {
                x = 0;
                y++;
            }
            pop();
        }

        pop();
    }

    getCurrentBatch(){
        let currentBatch = [];
        for (let i = this.currentBatch * this.batchSize; i < (this.currentBatch + 1) * this.batchSize; i++) {
            currentBatch.push(this.environments[i]);
        }
        return currentBatch;
    }

    update() {
        let currentBatch = this.getCurrentBatch();
        for (let i = 0; i < currentBatch.length; i++) {
            currentBatch[i].update();
        }
        if (this.allCurrentGamesLost()) {
            this.currentBatch++;
        }
    }

    allGamesLost() {
        for (let env of this.environments) {
            if (!env.lost)
                return false;
        }
        return true;
    }

    allCurrentGamesLost() {
        for (let env of this.getCurrentBatch()) {
            if (!env.lost)
                return false;
        }
        return true;
    }

    naturalSelection() {
        //sort environments according to score:
        this.environments.sort(function(a,b){return b.score - a.score});
        this.bestScore = this.environments[0].score;
        let nextGen = [];
        this.getTotalFitness();
        nextGen.push(this.environments[0].clone()); //pass best player of current gen to nex gen
        let iterator = 0;
        let iterator2 = 0;
        while(nextGen.length<this.environments.length){ //evolve half ot best players
            let parent = this.environments[iterator2];
            let child = parent.clone();
            child.brain.evolveAlgorithm();
            nextGen.push(child);
            if(nextGen.length < this.environments.length){
                parent = this.environments[iterator2];
                child = parent.clone();
                child.brain.evolveAlgorithm();
                nextGen.push(child);
            }
            iterator++;
        }
        this.environments = nextGen;
        this.generation++;
        this.currentBatch = 0;
    }

    getTotalFitness() {
        this.totalFitness = 0;
        for (let env of this.environments) {
            this.totalFitness += env.score;
        }
    }
}