class Block{
    constructor(startingPos, color){
        this.startingBlockPosition = startingPos;
        this.currentBlockPosition = startingPos;
        this.color = color;
    }

    clone(){
        let clone = new Block(this.startingBlockPosition.copy(),this.color);
        clone.currentGridPos = this.currentBlockPosition.copy();
        return clone;
    }
    
    draw(){
        let position = this.currentBlockPosition;
        push();
        stroke(0);
        fill(this.color);
        strokeWeight(2);
        rect(position.x *blockSize, position.y *blockSize, blockSize, blockSize);
        pop();
    }

}