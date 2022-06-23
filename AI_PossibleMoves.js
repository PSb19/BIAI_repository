//get shape_id, return possible moves for that shape
class PossibleMoves{
    constructor(shapeId){
        this.shapeID = shapeId;
        this.possibleMoves = [];
        this.setPossibleMoves();
    }

    setPossibleMoves(){
        this.possibleMoves = [];
        if(this.shapeID.shapeName === "O"){
            this.setOMoves();
        }
        else if(this.shapeID.shapeName === "S"){
            this.setSZMoves();
        }
        else if(this.shapeID.shapeName === "Z"){
            this.setSZMoves();
        }
        else if(this.shapeID.shapeName === "T"){
            this.setRTMoves();
        }
        else if(this.shapeID.shapeName === "L"){
            this.setLMoves();
        }
        else if(this.shapeID.shapeName === "RL"){
            this.setRTMoves();
        }
        else if(this.shapeID.shapeName === "I"){
            this.setIMoves();
        }
    }

    setOMoves(){
        let movesNumber = 9;
        for(let i = 0; i<movesNumber; i++){
            let moves = new Moves();
            let helper = i;
            if(helper<4){
                while(helper > 0){
                    moves.addDirectionalMove(1,0);
                    helper--;
                }
            }else{
                while(helper > 3){
                    moves.addDirectionalMove(-1,0);
                    helper--;
                }
            }
            moves.addAllDown();
            this.possibleMoves.push(moves);
        }
    }

    setSZMoves(){
        let movesNumber = 17;
        for(let i = 0; i<movesNumber; i++){
            let moves = new Moves();
            let helper = i;
            if(i<8){
                if(helper<3){
                    while(helper > 0){
                        moves.addDirectionalMove(1,0);
                        helper--;
                    }
                }else{
                    while(helper > 2){
                        moves.addDirectionalMove(-1,0);
                        helper--;
                    }
                }
            }else{
                helper-=8;
                moves.addRotation();
                if(helper<3){
                    while(helper > 0){
                        moves.addDirectionalMove(1,0);
                        helper--;
                    }
                }else{
                    while(helper > 2){
                        moves.addDirectionalMove(-1,0);
                        helper--;
                    }
                }
            }
            moves.addAllDown();
            this.possibleMoves.push(moves);
        }
    }

    setLMoves(){
        let movesNumber = 34;
        for(let i = 0; i<movesNumber; i++){
            let moves = new Moves();
            let helper = i;
            if(i<9){
                if(helper<4){
                    while(helper > 0){
                        moves.addDirectionalMove(1,0);
                        helper--;
                    }
                }else{
                    while(helper > 3){
                        moves.addDirectionalMove(-1,0);
                        helper--;
                    }
                }
            }else if(i<17){
                helper-=9;
                moves.addRotation();
                if(helper<4){
                    while(helper > 0){
                        moves.addDirectionalMove(1,0);
                        helper--;
                    }
                }else{
                    while(helper > 3){
                        moves.addDirectionalMove(-1,0);
                        helper--;
                    }
                }
            }else if(i<26){
                helper -= 17;
                moves.addRotation();
                moves.addRotation();
                if(helper<5){
                    while(helper > 0){
                        moves.addDirectionalMove(1,0);
                        helper--;
                    }
                }else{
                    while(helper > 4){
                        moves.addDirectionalMove(-1,0);
                        helper--;
                    }
                }
            }else{
                helper-=26;
                moves.addRotation();
                moves.addRotation();
                moves.addRotation();
                if(helper<4){
                    while(helper > 0){
                        moves.addDirectionalMove(1,0);
                        helper--;
                    }
                }else{
                    while(helper > 3){
                        moves.addDirectionalMove(-1,0);
                        helper--;
                    }
                }
            }
            moves.addAllDown();
            this.possibleMoves.push(moves);
        }
    }

    setRTMoves(){
        let movesNumber = 34;
        for(let i = 0; i<movesNumber; i++){
            let moves = new Moves();
            let helper = i;
            
            if(i<9){
                if(helper<4){
                    while(helper > 0){
                        moves.addDirectionalMove(1,0);
                        helper--;
                    }
                }else{
                    while(helper > 3){
                        moves.addDirectionalMove(-1,0);
                        helper--;
                    }
                }
            }else if(i<17){
                helper-=9;
                moves.addRotation();
                if(helper<3){
                    while(helper > 0){
                        moves.addDirectionalMove(1,0);
                        helper--;
                    }
                }else{
                    while(helper > 2){
                        moves.addDirectionalMove(-1,0);
                        helper--;
                    }
                }
            }else if(i<26){
                helper -= 17;
                moves.addRotation();
                moves.addRotation();
                if(helper<3){
                    while(helper > 0){
                        moves.addDirectionalMove(1,0);
                        helper--;
                    }
                }else{
                    while(helper > 2){
                        moves.addDirectionalMove(-1,0);
                        helper--;
                    }
                }
            }else{
                helper-=26;
                moves.addRotation();
                moves.addRotation();
                moves.addRotation();
                if(helper<3){
                    while(helper > 0){
                        moves.addDirectionalMove(1,0);
                        helper--;
                    }
                }else{
                    while(helper > 2){
                        moves.addDirectionalMove(-1,0);
                        helper--;
                    }
                }
            }
            moves.addAllDown();
            this.possibleMoves.push(moves);
        }
    }

    setIMoves(){
        let movesNumber = 17;
        for(let i = 0; i<movesNumber; i++){
            let moves = new Moves();
            let helper = i;
            if(i<10){
                if(helper<5){
                    while(helper > 0){
                        moves.addDirectionalMove(1,0);
                        helper--;
                    }
                }else{
                    while(helper > 4){
                        moves.addDirectionalMove(-1,0);
                        helper--;
                    }
                }
            }else{
                helper-=10;
                moves.addRotation();
                if(helper<3){
                    while(helper > 0){
                        moves.addDirectionalMove(1,0);
                        helper--;
                    }
                }else{
                    while(helper > 2){
                        moves.addDirectionalMove(-1,0);
                        helper--;
                    }
                }
            }
            moves.addAllDown();
            this.possibleMoves.push(moves);
        }
    }
}