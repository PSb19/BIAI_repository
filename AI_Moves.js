class Moves{
    constructor(){
        this.movesList = [];
    }

    addDirectionalMove(x,y){
        if(x===-1){
            this.movesList.push("LEFT");
        }else if(x===1){
            this.movesList.push("RIGHT");
        }
    }

    addRotation(){
        this.movesList.push("ROTATE");
    }

    addAllDown(){
        this.movesList.push("ALL DOWN");
    }
}