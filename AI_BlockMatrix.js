//Block matrix holds current put blocks state for AI to calculate best move
class BlockMatrix{
    constructor(width, height){
        this.width = width;
        this.height = height;
        this.blockMatrix = [];
        this.seedMatrixWithNull();

        this.holeCount = 0;
        this.pillarCount = 0;
        this.blocksAboveHoles = 0;
        this.highestColumn = 0;
        this.lowestColumn = 0;
        this.linesCleared = 0;
        this.heightIncrease = 0;
        this.initialHeight = 0;
        this.gotTetris = 0;
        this.bumpiness = 0;
        this.cost = 0;
    }
    
    clone() {
        let clone = new BlockMatrix(this.width, this.height);
        for (let i = 0; i < clone.height; i++) {
            for (let j = 0; j < clone.width; j++) {
                if (this.blockMatrix[i][j] !== null)
                    clone.blockMatrix[i][j] = this.blockMatrix[i][j].clone();
            }
        }
        this.calculateCurrentHeight();
        return clone;
    }

    seedMatrixWithNull(){
        this.blockMatrix = [];
        for(let i =0; i<this.height; i++){
            let column = [];
            for (let j = 0; j < this.width; j++) {
                column.push(null);
            }
            this.blockMatrix.push(column);
        }
    }

    copyFromMatrix(matrix){
        for (let i = 0; i < this.height; i++) {
            for(let j = 0; j< this.width; j++){
                if(matrix[i][j]!=null)
                    this.blockMatrix[i][j] = matrix[i][j].clone(); 
            }
        }
    }

    availablePosition(position) {
        if (position.y >= 0 && position.y < this.height && position.x >= 0 && position.x < this.width) {
            if (this.blockMatrix[position.y][position.x] === null) {
                return true;
            }
        }
        return false;
    }

    insertShapeToMatrix(shape, possibleMove){
        for(let direction of possibleMove.movesList){
            if(direction === "RIGHT"){
                shape.moveInMatrix(1,0,this)
            }
            if(direction === "LEFT"){
                shape.moveInMatrix(-1,0,this)
            }
            if(direction === "ROTATE"){
                shape.rotateInMatrix(this)
            }
            if(direction === "ALL DOWN"){
                while(shape.moveInMatrix(0,1,this)){}
                shape.deactivateInMatrix(this);
            }
        }
    }

    lineClear(){
        this.calculateCurrentHeight();
        let linesClearedNow = 0;
        for(let i = this.gameHeight-1; i>=0;i--){
            let rowCleared=true;
            for(let j = this.gameWidth-1; j>=0;j--){
                if(this.putBlocksMatrix[i][j]==null){
                    rowCleared=false;
                    break;
                }
            }
            if(rowCleared){
                linesClearedNow++;
                for(let j = 0; j<this.gameWidth; j++){
                    this.putBlocksMatrix[i][j].destroyed=true;
                }
                for(let m = i-1; m >= 1; m--){ //height
                    for(let j=0; j < this.gameWidth; j++){ //width
                        if(this.putBlocksMatrix[m][j] != null){     //if found block - move it down
                            this.putBlocksMatrix[m][j].currentBlockPosition.y+=1;
                        }
                        this.putBlocksMatrix[m+1][j] = this.putBlocksMatrix[m][j];
                        this.putBlocksMatrix[m][j] = null;
                    }
                }
                i++;
            }
        }
        this.linesCleared = linesClearedNow;
        if(linesClearedNow === 4){
            this.gotTetris = 1;
        }else{
            this.gotTetris = 0;
        }
    }

    countHoles(){
        this.holeCount=0;
        this.blocksAboveHoles=0;
        for (let i = 0; i < this.width; i++) {
            let blockFound = false;
            let numberOfBlocksFound = 0;
            for (let j = 0; j < this.height; j++) {
                if (this.blockMatrix[j][i] != null) {
                    blockFound = true;
                    numberOfBlocksFound++;
                } else if (blockFound) {
                    this.blocksAboveHoles += numberOfBlocksFound;
                    this.holeCount++;
                }
            }
        }
    }

    countHighestLine(){
        this.highestColumn = 0;
        let highest=0;
        let lowest = 20;
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                if (this.blockMatrix[j][i] != null) {
                    highest = Math.max(highest, this.height - j);
                    lowest = Math.min(lowest, this.height - j);
                    break;
                }
            }
        }
        this.highestColumn = highest;
        this.lowestColumn = lowest;
    }

    calculateCost(brain){
        this.cost = brain.calculateCostOfMatrix(this);
    }

    calculateCurrentHeight(){
        this.initialHeight = 0;
        let highest=0;
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                if (this.blockMatrix[j][i] != null) {
                    highest = Math.max(highest, this.height - j);
                    break;
                }
            }
        }
        this.initialHeight = highest;
    }

    calculateHeightIncrease(){
        this.heightIncrease = this.highestColumn - this.initialHeight;
    }

    calculateBumpiness() {        //bumpiness is defined as the total difference between column heights
        this.bumpiness = 0;
        let previousLineHeight = 0;
        for (let i = 0; i < this.width - 1; i++) {
            for (let j = 0; j < this.height; j++) {
                if (this.blockMatrix[j][i] != null) {
                    let currentLineHeight = this.height - j;
                    if (i !== 0) {
                        this.bumpiness += Math.abs(previousLineHeight - currentLineHeight);
                    }
                    previousLineHeight = currentLineHeight;
                    break;
                }
            }
        }
    }

    countPillars() {
        this.pillarCount = 0;
        for (let i = 0; i < this.width; i++) {
            let leftPillarHeight = 0;
            let rightPillarHeight = 0;
            for (let j = this.height - 1; j >= 0; j--) {
                if (i > 0 && this.blockMatrix[j][i] != null && this.blockMatrix[j][i-1] === null) {
                    leftPillarHeight++;
                } else {
                    if (leftPillarHeight >= 3)
                        this.pillarCount += leftPillarHeight;
                    leftPillarHeight = 0;
                }
                if (i < this.width && this.blockMatrix[j][i] != null && this.blockMatrix[j][i+1] === null) {
                    rightPillarHeight++;
                } else {
                    if (rightPillarHeight >= 3)
                        this.pillarCount += rightPillarHeight;
                    rightPillarHeight = 0;
                }
            }
            if (leftPillarHeight >= 3)
                this.pillarCount += leftPillarHeight;
            if (rightPillarHeight >= 3)
                this.pillarCount += rightPillarHeight;
        }
    }
    calculateParametersAndCost(brain){
        this.lineClear();
        this.countHoles();
        this.countHighestLine();
        this.calculateHeightIncrease();
        this.calculateBumpiness();
        this.countPillars();
        this.calculateCost(brain);
    }
}