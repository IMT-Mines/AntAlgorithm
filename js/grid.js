class Grid {

    constructor(cellNumber, foodNumber, additionalObstaclesRatio = 0.15) {
        this.cells = [];
        this.foodNumber = foodNumber;
        this.maxPheromone = 0;
        this.initCells(cellNumber, additionalObstaclesRatio);
    }

    initCells(cellNumber, additionalObstaclesRatio) {
        this.generateDefaultGrid(cellNumber)
        this.generateMaze(cellNumber, additionalObstaclesRatio);
        this.generateFood(cellNumber);
        return this.generateStart(cellNumber);
    }

    generateDefaultGrid(cellNumber) {
        for (let row = 0; row < cellNumber; row++) {
            this.cells[row] = [];
            for (let col = 0; col < cellNumber; col++) {
                this.cells[row][col] = new Obstacle(row, col);
            }
        }
    }

    generateMaze(cellNumber, additionalObstaclesRatio) {
        const stack = [];
        let currentCell = this.cells[1][1];
        currentCell.visited = true;
        stack.push(currentCell);
        while (stack.length > 0) {
            const neighbours = this.getNeighbours(currentCell, false, 2).filter(neighbour => !neighbour.visited);
            if (neighbours.length > 0) {
                const randomCell = neighbours[Math.floor(RandomNumberGenerator.next() * neighbours.length)];
                const newCell = new Free(randomCell.row, randomCell.col);
                newCell.visited = true;
                this.setCell(newCell.row, newCell.col, newCell);
                stack.push(currentCell);
                const vector = {x: (newCell.row - currentCell.row) / 2, y: (newCell.col - currentCell.col) / 2};
                const newBetweenCell = new Free(currentCell.row + vector.x, currentCell.col + vector.y);
                this.setCell(newBetweenCell.row, newBetweenCell.col, newBetweenCell);
                currentCell = newCell;
            } else {
                currentCell = stack.pop();
            }
        }

        for (let row = 1; row < cellNumber - 1; row++) {
            for (let col = 1; col < cellNumber - 1; col++) {
                if (this.cells[row][col] instanceof Obstacle && RandomNumberGenerator.next() < additionalObstaclesRatio) {
                    this.setCell(row, col, new Free(row, col));
                }
            }
        }
    }

    generateFood(cellNumber) {
        const freeCells = [];
        for (let row = 1; row < cellNumber - 1; row++) {
            for (let col = 1; col < cellNumber - 1; col++) {
                if (this.cells[row][col] instanceof Cell) {
                    freeCells.push({row: row, col: col});
                }
            }
        }
        if (freeCells.length < this.foodNumber) {
            this.foodNumber = freeCells.length;
        }
        for (let i = 0; i < this.foodNumber; i++) {
            // get a random cell out of the free cells
            const randomIndex = Math.floor(RandomNumberGenerator.next() * freeCells.length);
            const randomCell = freeCells[randomIndex];
            freeCells.splice(randomIndex, 1);
            const food = new Food(randomCell.row, randomCell.col);
            this.setCell(randomCell.row, randomCell.col, food);
        }
    }

    generateStart(cellNumber) {
        const coordinates = {x: Math.floor(cellNumber / 2), y: Math.floor(cellNumber / 2)};
        this.startCell = new Start(coordinates.x, coordinates.y);
        this.setCell(coordinates.x, coordinates.y, this.startCell);
    }

    getCells() {
        return this.cells;
    }

    getCell(row, col) {
        return this.cells[row][col];
    }

    setCell(row, col, cell) {
        this.cells[row][col] = cell;
    }

    getShortestPath(cell, ant) {
        const startCell = this.getStartCell();
        const distance = new Map();
        const previous = new Map();
        const priorityQueue = new PriorityQueue();

        for (const cell of ant.getHistory()) {
            distance.set(cell, Infinity);
            previous.set(cell, null);
        }

        distance.set(cell, 0);
        priorityQueue.add(cell, 0);

        while (!priorityQueue.isEmpty()) {
            const currentCell = priorityQueue.remove();

            if (currentCell === startCell)
                ant.setHistory(this.reconstructPath(previous, currentCell));

            const neighbours = this.getNeighbours(currentCell)
                .filter(neighbour => ant.getHistory().includes(neighbour));
            for (const neighbour of neighbours) {
                const tentativeDistance = distance.get(currentCell) + 1;
                if (tentativeDistance < distance.get(neighbour)) {
                    distance.set(neighbour, tentativeDistance);
                    previous.set(neighbour, currentCell);
                    priorityQueue.add(neighbour, tentativeDistance);
                }
            }
        }
    }

    reconstructPath(previous, currentCell) {
        const path = [];
        while (currentCell !== null) {
            path.unshift(currentCell);
            currentCell = previous.get(currentCell);
        }
        return path.reverse();
    }

    // Neighbours are checked in the following order: top, right, bottom, left
    getNeighbours(cell, checkIfFree = true, neighboursDistance = 1) {
        const neighbours = [];
        const coordinates = [
            {x: -1 * neighboursDistance, y: 0},
            {x: 0, y: neighboursDistance},
            {x: neighboursDistance, y: 0},
            {x: 0, y: -1 * neighboursDistance}
        ];
        for (let coordinate of coordinates) {
            if (cell.row + coordinate.x < 0 || cell.row + coordinate.x >= this.cells.length ||
                cell.col + coordinate.y < 0 || cell.col + coordinate.y >= this.cells.length) continue;
            const neighbour = this.getCell(cell.row + coordinate.x, cell.col + coordinate.y);
            if (neighbour && (!checkIfFree || this.checkCellIsFree(neighbour)))
                neighbours.push(neighbour);
        }
        return neighbours;
    }

    checkCellIsFree(cell) {
        return !(cell instanceof Obstacle);
    }

    getStartCell() {
        return this.startCell;
    }

    updatePheromones(rate) {
        for (let row = 1; row < this.cells.length - 1; row++) {
            for (let col = 1; col < this.cells[row].length - 1; col++) {
                if (this.cells[row][col] instanceof Free) {
                    this.cells[row][col].multiplyPheromone(1 - rate);
                }
            }
        }
    }

    setMaxPheromone(maxPheromone) {
        this.maxPheromone = maxPheromone;
    }

    getMaxPheromone() {
        return this.maxPheromone;
    }

    getFoodNumber() {
        return this.foodNumber;
    }

    clone() {
        const grid = new Grid(this.cells.length, this.foodNumber);
        grid.maxPheromone = this.maxPheromone;
        grid.foodNumber = this.foodNumber;
        for (let row = 0; row < this.cells.length; row++) {
            for (let col = 0; col < this.cells[row].length; col++) {
                grid.setCell(row, col, this.cells[row][col].clone());
            }
        }
        return grid;
    }
}