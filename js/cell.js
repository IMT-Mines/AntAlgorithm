class Cell {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

}

class Obstacle extends Cell {

    constructor(x, y) {
        super(x, y);
    }

}

class Food extends Cell {

    constructor(x, y) {
        super(x, y);
    }

}

class Start extends Cell {

    constructor(x, y) {
        super(x, y);
    }
}