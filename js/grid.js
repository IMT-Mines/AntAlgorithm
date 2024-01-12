class Grid {

    constructor(cellNumber) {
        this.cells = [];
        this.initCells(cellNumber);
    }

    initCells(cellNumber) {
        for (let i = 0; i < cellNumber; i++) {
            for (let j = 0; j < cellNumber; j++) {
                this.cells[i][j] = 0;
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