class Grid {

    constructor(cellNumber, antsManager) {
        this.antsManager = antsManager;
        this.cells = [];
        this.initCells(cellNumber);
    }

    initCells(cellNumber, foodNumber = 4, additionalObstaclesRatio = 0.2) {
        this.generateDefaultGrid(cellNumber)
        this.generateMaze(cellNumber, additionalObstaclesRatio);
        this.generateFood(cellNumber, foodNumber);
        return this.generateStart(cellNumber);
    }

    generateDefaultGrid(cellNumber) {
        for (let row = 0; row < cellNumber; row++) {
            this.cells[row] = [];
            for (let col = 0; col < cellNumber; col++)
                this.cells[row][col] = new Obstacle(row, col);
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
                const randomCell = neighbours[Math.floor(Math.random() * neighbours.length)];
                const newCell = new Cell(randomCell.x, randomCell.y);
                newCell.visited = true;
                this.setCell(newCell.x, newCell.y, newCell);
                stack.push(currentCell);
                const vector = { x: (newCell.x - currentCell.x) / 2, y: (newCell.y - currentCell.y) / 2 };
                const newBetweenCell = new Cell(currentCell.x + vector.x, currentCell.y + vector.y);
                this.setCell(newBetweenCell.x, newBetweenCell.y, newBetweenCell);
                currentCell = newCell;
            } else {
                currentCell = stack.pop();
            }
        }

        for (let i = 0; i < cellNumber; i++) {
            this.cells[i][0] = new Obstacle(i, 0);
            this.cells[i][cellNumber - 1] = new Obstacle(i, cellNumber - 1);
            this.cells[0][i] = new Obstacle(0, i);
            this.cells[cellNumber - 1][i] = new Obstacle(cellNumber - 1, i);
        }

        for (let row = 1; row < cellNumber - 1; row++)
            for (let col = 1; col < cellNumber - 1; col++)
                if (this.cells[row][col] instanceof Obstacle && Math.random() < additionalObstaclesRatio)
                    this.setCell(row, col, new Cell(row, col));
    }

    generateFood(cellNumber, foodNumber) {
        const maxIterations = 1000;
        for (let i = 0; i < foodNumber; i++) {
            let randomRow = Math.floor(Math.random() * (cellNumber - 2)) + 1;
            let randomCol = Math.floor(Math.random() * (cellNumber - 2)) + 1;
            let currentIteration = 0;
            while (!(this.cells[randomRow][randomCol] instanceof Cell) && currentIteration < maxIterations) {
                randomRow = Math.floor(Math.random() * (cellNumber - 2)) + 1;
                randomCol = Math.floor(Math.random() * (cellNumber - 2)) + 1;
                currentIteration++;
            }
            if (currentIteration < maxIterations)
                this.setCell(randomRow, randomCol, new Food(randomRow, randomCol));
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

    getNeighbours(cell, checkIfFree = true, neighboursDistance = 1) {
        const neighbours = [];
        const coordinates = [
            { x: -1 * neighboursDistance, y:  0 },
            { x:  neighboursDistance, y:  0},
            { x:  0, y: -1 * neighboursDistance },
            { x:  0, y:  neighboursDistance }
        ];
        for (let coordinate of coordinates) {
            if (cell.x + coordinate.x < 0 || cell.x + coordinate.x >= this.cells.length ||
                cell.y + coordinate.y < 0 || cell.y + coordinate.y >= this.cells.length) continue;
            const neighbour = this.getCell(cell.x + coordinate.x, cell.y + coordinate.y);
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

}