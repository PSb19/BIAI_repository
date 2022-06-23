class Game{
    constructor(gameWidth, gameHeight){
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.pixelGameWidth = gameWidth*blockSize;
        this.pixelGameHeight = gameHeight*blockSize;
        this.shapeGenerator = new ShapeGenerator();
        this.putBlocksMatrix = [];
        this.seedBlockMatrixWithNull();
        this.currentShape = this.shapeGenerator.getRandomShape(createVector(int(this.gameWidth/2),0),this);
        this.nextShape = this.shapeGenerator.getRandomShape(createVector(int(this.gameWidth/2),0),this);
        this.score = 0;
        this.isLost = false;
        //AI:
        this.needsNewAIRoute = false;
    }
    
    seedBlockMatrixWithNull(){
        this.putBlocksMatrix = [];
        for(let i =0; i<this.gameHeight; i++){
            let column = [];
            for (let j = 0; j < this.gameWidth; j++) {
                column.push(null);
            }
            this.putBlocksMatrix.push(column);
        }
    }

    // ----------- DISPLAYING GAME STATE
    draw(){
        //Fill game screen and stroke border
        push();
        {
            fill(250);
            strokeWeight(2);
            stroke(200);
            rect(2,2,canvas.width-4, canvas.height-4);
        }
        pop();
        //Draw game features:
        push();
        {
            //Get game board dimensions and set center point there:
            translate((canvas.width-this.pixelGameWidth)/2, (canvas.height-this.pixelGameHeight)/2);
            this.lineClear();
            this.drawGameGrid();    //draw grid
            //draw put blocks:
            for(let i =0; i<this.gameHeight; i++){
                for (let j = 0; j < this.gameWidth; j++) {
                    if(this.putBlocksMatrix[i][j] != null)
                        this.putBlocksMatrix[i][j].draw();
                }
            }
            if(this.isLost){
                this.showScore();
            }else{
                this.currentShape.draw();
            }
            textSize(30);
            textAlign(CENTER, CENTER);
            strokeWeight(1);
            if(this.isLost){
                fill(255,0,0);
                stroke(255,0,0);
            }else{
                fill(0);
                stroke(0);
            }
            text(`Score: ${this.score}`, this.pixelGameWidth / 2, -25);
        }
        pop();
        //Draw border around game area
        push();
        {
            translate((canvas.width-this.pixelGameWidth)/2, (canvas.height-this.pixelGameHeight)/2);
            noFill();
            stroke(0);
            strokeWeight(4);
            rect(0, 0, this.pixelGameWidth, this.pixelGameHeight);
        }
        pop();
        this.drawNextShape();
    }

    drawGameGrid(){
        push();
        noStroke();
        fill(255);
        rect(0,0,this.pixelGameWidth,this.pixelGameHeight);
        stroke(200);
        strokeWeight(1);
        for (let index = 0; index <= this.gameWidth; index++) {
            line(index* blockSize, 0, index*blockSize,this.pixelGameHeight);            
        }
        for (let index = 0; index <= this.gameHeight; index++) {
            line(0,index* blockSize, this.pixelGameWidth, index*blockSize);            
        }
        pop();
    }

    drawNextShape(){
        let topLeftPosition = createVector((canvas.width - this.pixelGameWidth)/2, (canvas.height - this.pixelGameHeight)/2);
        push();
        {
            //change center of painting
            translate((topLeftPosition.x + this.pixelGameWidth) + topLeftPosition.x / 2 - 4*blockSize / 2, topLeftPosition.y + blockSize);
            //create border
            fill(255);
            stroke(0);
            strokeWeight(4);
            rect(0, 0, 4*blockSize, 4*blockSize);
            // create text above
            textSize(30);
            textAlign(CENTER, CENTER);
            fill(100);
            stroke(0);
            strokeWeight(1);
            text("NEXT", blockSize*2, -20);
            translate(2 * blockSize, 2 * blockSize); //set painting center in created box
            this.nextShape.drawAtPoint();
        }
        pop();
    }

    showScore(){
        push();
        {
            translate(0,(canvas.height - this.gameHeight)/2);
            textSize(60);
            textAlign(CENTER, CENTER);
            fill(255,0,0);
            stroke(0);
            strokeWeight(1);
            text(`Score: ${this.score}`, this.pixelGameWidth / 2, -25);
        }
        pop();
    }
    // ---- NEW SHAPE GENERATION
    generateNewShape(){
        this.currentShape = this.nextShape;
        if(!this.currentShape.canMove(0,0)){
            this.isLost=true;
            return;
        }
        this.nextShape = this.shapeGenerator.getRandomShape(createVector(int(this.gameWidth/2),0),this);
        this.needsNewAIRoute = true;
    }
    // ---- GAME RESET
    resetGame(){
        this.seedBlockMatrixWithNull();
        this.currentShape = this.shapeGenerator.getRandomShape(createVector(int(this.gameWidth/2),0),this);
        this.nextShape = this.shapeGenerator.getRandomShape(createVector(int(this.gameWidth/2),0),this);
        this.score=0;
        this.isLost=false;
    }

    // ---- MOVEMENT AND AVAILABILITY:
    moveDown(){
        if(this.currentShape.moveDown()){
            this.lineClear();
            this.generateNewShape();
            return false;
        }
        return true;
    }
    moveLeft(){
        this.currentShape.moveLeft();
    }
    moveRight(){
        this.currentShape.moveRight();
    }
    rotateShape(){
        this.currentShape.rotateShape();
    }
    availablePosition(position){
        if(position.y >=-2 && position.y < this.gameHeight  && position.x >= 0 && position.x < this.gameWidth){//Check for grid borders
            if(this.putBlocksMatrix[position.y][position.x]===null){
                return true;
            }
        }
        return false;
    }

    // ---- LINE CLEARING
    lineClear(){
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
                for(let m = i-1; m >= 0; m--){
                    for(let j=0; j < this.gameWidth; j++){
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
        switch (linesClearedNow) {
            case 4:
                this.score+=1200;
                break;
            case 3:
                this.score+=300;
                break;
            case 2:
                this.score+=100;
                break;
            case 1:
                this.score+=40;
                break;
            default:
                break;
        }
    }
}
