class Grid {

    constructor(cellNumber, antsManager) {
        this.antsManager = antsManager;
        this.cells = [];
        this.initCells(cellNumber);
    }

    initCells(cellNumber) {
        for (let i = 0; i < cellNumber; i++) {
            this.cells[i] = [];
            for (let j = 0; j < cellNumber; j++) {
                this.cells[i][j] = new Cell(i, j);
            }
        }

        // 0 = empty, 1 = obstacle, 2 = food, 3 = start
        const cells =
            [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1],
                [1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 2, 1],
                [1, 2, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
                [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
                [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
                [1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1],
                [1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1],
                [1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1],
                [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1],
                [1, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1],
                [1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
                [1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
                [1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 2, 0, 0, 1],
                [1, 0, 0, 0, 1, 2, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            ]
        for (let x = 0; x < cells.length; x++) {
            this.cells[x] = [];
            for (let y = 0; y < cells[x].length; y++) {
                switch (cells[x][y]) {
                    case 0:
                        this.cells[x][y] = new Cell(x, y);
                        break;
                    case 1:
                        this.cells[x][y] = new Obstacle(x, y);
                        break;
                    case 2:
                        this.cells[x][y] = new Food(x, y);
                        break;
                    case 3:
                        this.cells[x][y] = new Start(x, y);
                        this.antsManager.initAnts(this.cells[x][y], 10);
                        break;
                }
            }
        }

    }

    getCells() {
        return [this.cells, this.antsManager.ants];
    }

    getCell(x, y) {
        return this.cells[x][y];
    }

    setCell(x, y, value) {
        this.cells[x][y] = value;
    }

    getNeighbours(cell) {
        const neighbours = [];
        if (cell.x > 0 && this.checkCellIsFree(this.getCell(cell.x - 1, cell.y))) {
            neighbours.push(this.cells[cell.x - 1][cell.y]);
        }
        if (cell.x < this.cells.length - 1 && this.checkCellIsFree(this.getCell(cell.x + 1, cell.y))) {
            neighbours.push(this.cells[cell.x + 1][cell.y]);
        }
        if (cell.y > 0 && this.checkCellIsFree(this.getCell(cell.x, cell.y - 1))) {
            neighbours.push(this.cells[cell.x][cell.y - 1]);
        }
        if (cell.y < this.cells[0].length - 1 && this.checkCellIsFree(this.getCell(cell.x, cell.y + 1))) {
            neighbours.push(this.cells[cell.x][cell.y + 1]);
        }
        return neighbours;
    }

    checkCellIsFree(cell) {
        return !(cell instanceof Obstacle);
    }

}