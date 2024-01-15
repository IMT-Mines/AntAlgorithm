class Cell {

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.color = "#FFFFFF";
        this.visited = false; // for maze generation
    }
}

class Obstacle extends Cell {

    constructor(x, y) {
        super(x, y);
        this.color = "#000000";
    }

}

class Food extends Cell {

    constructor(x, y) {
        super(x, y);
        this.color = "#FF0000";
    }

}

class Start extends Cell {

    constructor(x, y) {
        super(x, y);
        this.color = "#00FF00";
    }



}


// class Free extends Cell {
//     constructor(x, y, qty = 0.0) {
//         super(x, y);
//         this._qty = qty;
//     }
//
// }