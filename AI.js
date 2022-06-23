class AI{EndPosition
    constructor(brain, game){
        this.brain = brain;
        this.finalMoves = new Moves();
        this.game = game;
        this.currentShape = this.game.currentShape.clone();
        this.findMovementsToPerform();
    }

    newShape(shape){
        this.currentShape = shape.clone();
        this.findMovementsToPerform();
    }

    findMovementsToPerform(){
        let gameBoardState = new BlockMatrix(this.game.gameWidth, this.game.gameHeight);
        gameBoardState.copyFromMatrix(this.game.putBlocksMatrix);
        let bestEndPosition = this.getBestMovementList(gameBoardState);
        this.finalMoves = bestEndPosition;
    }

    getAllMovementLists(){
        let possibilities = new PossibleMoves(this.currentShape.shapeID);
        return possibilities;
    }

    getBestMovementList(blockMatrix_){
        let possibilities = this.getAllMovementLists();
        let possibilityCost = [];
        for(let i=0; i<possibilities.possibleMoves.length; i++){
            let shape = this.currentShape.clone();
            let blockMatrix = blockMatrix_.clone();
            blockMatrix.copyFromMatrix(blockMatrix_.blockMatrix);
            blockMatrix.insertShapeToMatrix(shape, possibilities.possibleMoves[i]);
            possibilityCost.push(this.calculateBlockMatrixValue(blockMatrix));
        }
        let minimalCost = possibilityCost[0];
        let index = 0;
        for(let i = 1; i<possibilityCost.length; i++){
            if(minimalCost > possibilityCost[i]){
                minimalCost = possibilityCost[i];
                index =i;
            }
        }
        return possibilities.possibleMoves[index];
    }

    calculateBlockMatrixValue(blockMatrix){
        blockMatrix.calculateParametersAndCost(this.brain);
        return blockMatrix.cost;
    }

    getNextMove() {
        if (this.finalMoves.movesList.length > 0) 
            return this.finalMoves.movesList.splice(0, 1)[0];
        return null;
    }
}