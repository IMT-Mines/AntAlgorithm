class Grid {

    constructor(cellNumber) {
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
                        break;
                }
            }
        }

    }

    getCells() {
        return this.cells;
    }

    getCell(x, y) {
        return this.cells[x][y];
    }

    setCell(x, y, value) {
        this.cells[x][y] = value;
    }

}