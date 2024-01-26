class Cell {

    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.color = "#FFFFFF";
        this.visited = false; // for maze generation
        this.pheromone = 0.0;
    }

    addPheromone(quantity) {
        this.pheromone += quantity;
    }

    getPheromone() {
        return this.pheromone;
    }

    multiplyPheromone(rate) {
        this.pheromone *= rate;
    }

    getColor() {
        return this.color;
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
        this.foodQuantity = 15;
    }

    addFoodQuantity(quantity) {
        this.foodQuantity += quantity;
    }

    getFoodQuantity() {
        return this.foodQuantity;
    }
}

class Start extends Cell {

    constructor(row, col) {
        super(row, col);
        this.color = "#00FF00";
        this.foodQuantity = 0;
    }

    addFoodQuantity(quantity) {
        this.foodQuantity += quantity;
    }
}

class Free extends Cell {
    constructor(row, col) {
        super(row, col);
    }
}
