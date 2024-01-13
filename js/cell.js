class Cell {

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.color = "#FFFFFF";
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