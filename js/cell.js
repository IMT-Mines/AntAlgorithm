class Cell {

    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.color = "#FFFFFF";
        this.visited = false; // for maze generation
        this.pheromone = 0.0;
    }
}

class Obstacle extends Cell {

    constructor(row, col) {
        super(row, col);
        this.color = "#111111";
    }
}

class Food extends Cell {

    constructor(row, col) {
        super(row, col);
        this.color = "#ffd500";
    }
}

class Start extends Cell {

    constructor(row, col) {
        super(row, col);
        this.color = "#00FF00";
    }
}

class Free extends Cell {
    constructor(row, col) {
        super(row, col);
    }
}