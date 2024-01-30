class Cell {

    possibleGround = [{ x: 0, y: 0 }, { x: 64, y: 0 }, { x: 64, y: 64 }, { x: 64, y: 0 }]

    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.visited = false; // for maze generation
        this.pheromone = 0.0;
        this.randomPattern = this.possibleGround[Math.floor(RandomNumberGenerator.next() * this.possibleGround.length)];
        this.randomPattern.x += (Math.floor(RandomNumberGenerator.next() * 3) < 2 ? 128 : 0);
        this.randomPheromone = {
            x: RandomNumberGenerator.next(),
            y: RandomNumberGenerator.next(),
            r: Math.floor(RandomNumberGenerator.next() * 4) + 2
        };0
    }

    setPheromone(pheromone) {
        this.pheromone = pheromone;
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

    setRandomPattern(x, y) {
        this.randomPattern = { x: x, y: y };
    }

    getRandomPattern() {
        return this.randomPattern;
    }

    setRandomPheromone(x, y, r) {
        this.randomPheromone = { x: x, y: y, r: r };
    }

    getRandomPheromone() {
        return this.randomPheromone;
    }

    clone() {

    }

}

class Obstacle extends Cell {

    constructor(row, col) {
        super(row, col);
    }
}

class Food extends Cell {

    constructor(row, col) {
        super(row, col);
        this.foodQuantity = 1;
        this.randomPattern = Math.floor(RandomNumberGenerator.next() * 15);
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
        this.foodQuantity = 0;
        this.randomPattern = Math.floor(RandomNumberGenerator.next() * 12);
    }

    addFoodQuantity(quantity) {
        this.foodQuantity += quantity;
    }

    getFoodQuantity() {
        return this.foodQuantity;
    }
}

class Free extends Cell {
    constructor(row, col) {
        super(row, col);
    }
}
