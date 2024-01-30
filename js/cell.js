class Cell {

    possibleGround = [{ x: 0, y: 0 }, { x: 64, y: 0 }, { x: 64, y: 64 }, { x: 64, y: 0 }]

    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.visited = false; // for maze generation
        this.pheromone = 0.0;
        this.maxPheromone = 0.0;
        this.randomPattern = this.possibleGround[Math.floor(RandomNumberGenerator.next() * this.possibleGround.length)];
        this.randomPattern.x += (Math.floor(RandomNumberGenerator.next() * 3) < 2 ? 128 : 0);
        this.randomPheromone = {
            x: RandomNumberGenerator.next(),
            y: RandomNumberGenerator.next(),
            r: Math.floor(RandomNumberGenerator.next() * 4) + 2
        };
    }

    setMaxPheromone(pheromone) {
        this.maxPheromone = pheromone;
    }

    getMaxPheromone() {
        return this.maxPheromone;
    }

    setPheromone(pheromone) {
        this.pheromone = pheromone;
    }

    addPheromone(quantity) {
        this.pheromone += quantity;
        if (this.pheromone > this.maxPheromone)
            this.maxPheromone = this.pheromone;
    }

    getPheromone() {
        return this.pheromone;
    }

    multiplyPheromone(rate) {
        this.pheromone *= rate;
    }

    setRandomPattern(randomPattern) {
        this.randomPattern = randomPattern;
    }

    getRandomPattern() {
        return this.randomPattern;
    }

    setRandomPheromone(randomPheromone) {
        this.randomPheromone = { x: randomPheromone.x, y: randomPheromone.y, r: randomPheromone.r };
    }

    getRandomPheromone() {
        return this.randomPheromone;
    }

    clone(classType = Cell) {
        const clonedCell = new classType(this.row, this.col);
        clonedCell.setPheromone(this.pheromone);
        clonedCell.setRandomPattern(this.randomPattern);
        clonedCell.setMaxPheromone(this.maxPheromone)
        clonedCell.setRandomPheromone({ x: this.randomPheromone.x, y: this.randomPheromone.y, r: this.randomPheromone.r });
        return clonedCell;
    }

}

class Obstacle extends Cell {

    constructor(row, col) {
        super(row, col);
    }

    clone(classType) {
        return super.clone(Obstacle);
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

    setFoodQuantity(quantity) {
        this.foodQuantity = quantity;
    }

    getFoodQuantity() {
        return this.foodQuantity;
    }

    clone(classType) {
        const clonedCell = super.clone(Food);
        clonedCell.setFoodQuantity(this.foodQuantity);
        return clonedCell;
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

    setFoodQuantity(quantity) {
        this.foodQuantity = quantity;
    }

    clone(classType) {
        const clonedCell = super.clone(Start);
        clonedCell.setFoodQuantity(this.foodQuantity);
        return clonedCell;
    }
}

class Free extends Cell {
    constructor(row, col) {
        super(row, col);
    }

    clone(classType) {
        return super.clone(Free);
    }
}
