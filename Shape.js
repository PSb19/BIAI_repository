class ShapeGenerator{
    constructor(){
        this.setShapeInfo();
        this.shapeIDtable = [this.squareShape, this.lShape, this.reverseLShape, this.lineShape, this.tShape, this.zShape, this.sShape];
        this.availableShapeTable = [this.squareShape, this.lShape, this.reverseLShape, this.lineShape, this.tShape, this.zShape, this.sShape];
    }

    getRandomShape(position,game){
        return new Shape(this.getSemiRandomShapeId(),position,game);
    }

    getSemiRandomShapeId(){
        if (this.availableShapeTable.length === 0) {
            this.resetAvailableShapes();
        }
        return this.availableShapeTable.splice(Math.floor(random(0, this.availableShapeTable.length)), 1)[0];
    }

    resetAvailableShapes(){
        this.availableShapeTable = [this.squareShape, this.lShape, this.reverseLShape, this.lineShape, this.tShape, this.zShape, this.sShape];
    }

    setShapeInfo() {
        this.squareShape = {
            blockPositions: [createVector(0, 0), createVector(0, 1), createVector(1, 0), createVector(1, 1)],
            rotationCenter: createVector(0.5, 0.5),
            shapeColor: color(255, 239, 43),
            shapeName: "O"
        }
        this.lShape = {
            blockPositions: [createVector(0, 0), createVector(0, 1), createVector(0, 2), createVector(1, 2)],
            rotationCenter: createVector(0, 1),
            shapeColor: color(247, 167, 0),
            shapeName: "L"
        }
        this.reverseLShape = {
            blockPositions: [createVector(1, 0), createVector(1, 1), createVector(1, 2), createVector(0, 2)],
            rotationCenter: createVector(1, 1),
            shapeColor: color(0, 100, 200),
            shapeName: "RL"
        }
        this.lineShape = {
            blockPositions: [createVector(0, 0), createVector(0, 1), createVector(0, 2), createVector(0, 3)],
            rotationCenter: createVector(0.5, 1.5),
            shapeColor: color(0, 201, 223),
            shapeName: "I"
        }
        this.tShape = {
            blockPositions: [createVector(1, 0), createVector(0, 1), createVector(1, 1), createVector(1, 2)],
            rotationCenter: createVector(1, 1),
            shapeColor: color(155, 0, 190),
            shapeName: "T"
        }
        this.zShape = {
            blockPositions: [createVector(0, 0), createVector(1, 0), createVector(1, 1), createVector(2, 1)],
            rotationCenter: createVector(1, 1),
            shapeColor: color(220, 0, 0),
            shapeName: "Z"
        }
        this.sShape = {
            blockPositions: [createVector(0, 1), createVector(1, 1), createVector(1, 0), createVector(2, 0)],
            rotationCenter: createVector(1, 1),
            shapeColor: color(0, 230, 50),
            shapeName: "S"
        }
    }
}
class Shape{
    constructor(shapeID, startingPos, game){
        this.game = game;
        this.shapeID = shapeID;
        this.startingPosition = startingPos;
        this.currentPosition = startingPos;
        this.blocks = [];
        for(let position of shapeID.blockPositions){
            this.blocks.push(new Block(createVector(position.x,position.y),shapeID.shapeColor));
        }
    }

    clone(){
        let clone = new Shape(this.shapeID, this.startingPosition, this.game);
        clone.currentPosition = this.currentPosition.copy();
        clone.blocks = [];
        for(let block of this.blocks){
            clone.blocks.push(block.clone());
        }
        return clone;
    }

    draw(){
        push();
        translate(this.currentPosition.x*blockSize, this.currentPosition.y*blockSize);
        this.blocks.forEach(block => {
            block.draw();
        });
        pop();
    }

    drawAtPoint(){ //draw block at current point (for next shape window);
        let totalX = 0;
        let totalY = 0;
        for (let block of this.blocks) {
            totalX += block.currentBlockPosition.x + 0.5;
            totalY += block.currentBlockPosition.y + 0.5;
        }
        let midpoint = createVector(totalX / this.blocks.length, totalY / this.blocks.length);
        push();
        translate(-midpoint.x * blockSize, -midpoint.y * blockSize);
        this.blocks.forEach(block =>{
            block.draw();
        });
        pop();
    }
    // ---- GAME MOVEMENT
    canMove(x,y){
        for(let block of this.blocks){
            let newPosition = p5.Vector.add(this.currentPosition,block.currentBlockPosition);
            newPosition.x+=x;
            newPosition.y+=y;
            if(!this.game.availablePosition(newPosition)){
                return false;
            }
        }
        return true;
    }

    moveDown(){
        let isDeactivated=false;
        if(this.canMove(0,1)){
            this.currentPosition.y+=1;
        }else{
            this.deactivateShape();
            isDeactivated=true;
        }
        return isDeactivated;
    }

    moveRight(){
        if(this.canMove(1,0))
            this.currentPosition.x+=1;
    }

    moveLeft(){
        if(this.canMove(-1,0))
            this.currentPosition.x-=1;
    }

    rotateShape(){
        if(this.canRotate()){
            for(let i =0; i < this.blocks.length; i++){
                this.blocks[i].currentBlockPosition = this.rotateBlockInShape(this.blocks[i]);
            }
        }
    }

    canRotate() {
        for (let i = 0; i < this.blocks.length; i++) {
            let newPosition = this.rotateBlockInShape(this.blocks[i]);
            let newAbsolutePosition = p5.Vector.add(newPosition, this.currentPos);
            if (!this.game.availablePosition(newAbsolutePosition))
                return false;
        }
        return true;
    }

    rotateBlockInShape(block){
        let startingPosition = block.currentBlockPosition;
        let rotationCenter = this.shapeID.rotationCenter;
        let rotatedPosition = p5.Vector.add(p5.Vector.sub(startingPosition, rotationCenter).rotate(Math.PI /2),rotationCenter);
        rotatedPosition.x = Math.round(rotatedPosition.x);
        rotatedPosition.y = Math.round(rotatedPosition.y);
        return rotatedPosition;
    }

    deactivateShape(){
        for(let block of this.blocks){
            block.currentBlockPosition.add(this.currentPosition);
            this.game.putBlocksMatrix[block.currentBlockPosition.y][block.currentBlockPosition.x] = block;
        }
    }
    
    // ---- MATRIX MOVEMENT
    moveInMatrix(x,y,blockMatrix){
        if(this.canMoveInMatrix(x,y,blockMatrix)){
            this.currentPosition.x+=x;
            this.currentPosition.y+=y;
            return true;
        }
        return false;
    }

    canMoveInMatrix(x,y,blockMatrix){
        for(let block of this.blocks){
            let newPosition = p5.Vector.add(this.currentPosition,block.currentBlockPosition);
            newPosition.x+=x;
            newPosition.y+=y;
            if(!blockMatrix.availablePosition(newPosition)){
                return false;
            }
        }
        return true;
    }

    rotateInMatrix(blockMatrix){
        if(this.canRotateInMatrix(blockMatrix)){
            for(let i =0; i < this.blocks.length; i++){
                this.blocks[i].currentBlockPosition = this.rotateBlockInShape(this.blocks[i]);
            }
        }
    }

    canRotateInMatrix(blockMatrix) {
        for (let i = 0; i < this.blocks.length; i++) {
            let newPosition = this.rotateBlockInShape(this.blocks[i]);
            let newAbsolutePosition = p5.Vector.add(newPosition, this.currentPosition);
            if(!blockMatrix.availablePosition(newAbsolutePosition)){
                return false;
            }    
        }
        return true;
    }

    deactivateInMatrix(blockMatrix){
        for(let block of this.blocks){
            block.currentBlockPosition.add(this.currentPosition);
            blockMatrix.blockMatrix[block.currentBlockPosition.y][block.currentBlockPosition.x] = block;
        }
    }
}