class Environment{
    constructor(width, height){
        this.brain = new Brain();               //create main ai module
        this.game = new Game(10,20)             //create game
        this.ai = new AI(this.brain,this.game); //create ai module
        this.score = 0;
        this.windowWidth=width;
        this.windowHeight=height;
        this.lost = false;
    }
    
    clone(){
        let clone = new Environment(this.windowWidth, this.windowHeight);
        clone.game.needsNewAIRoute = true;
        clone.brain = this.brain.clone();
        clone.ai.brain = clone.brain;
        return clone;
    }

    draw(){
        push();
        scale(this.windowWidth / canvas.width, this.windowHeight / canvas.height);
        this.game.draw();
        this.brain.writeMultipliers(600,300); //write algorithm multipliers form brain
        pop();
    }

    update(){
        if(this.lost){
            return;
        }
        if(this.game.needsNewAIRoute){
            this.ai.newShape(this.game.currentShape);
            //this.ai.findMovementsToPerform();
            this.game.needsNewAIRoute = false;
        }
        let nextMove = this.ai.getNextMove()
        while(nextMove){
            switch (nextMove) {
                case "ALL DOWN":
                    while(this.game.moveDown());
                    break;
                case "RIGHT":
                    this.game.moveRight();
                    break;
                case "LEFT":
                    this.game.moveLeft();
                    break;
                case "ROTATE":
                    this.game.rotateShape();
                    break;
                default:
                    break;
            }
            nextMove = this.ai.getNextMove();
        }
        this.lost = this.game.isLost;
        this.score = this.game.score;
    }
}