class Canvas {
    constructor(ctx) {
        this.ctx = ctx;
        this.ctx.fillStyle = "white";
        this.width = this.ctx.canvas.width;
        this.height = this.ctx.canvas.height;
        const devicePixelRatio = 10;
        this.ctx.canvas.width *= devicePixelRatio;
        this.ctx.canvas.height *= devicePixelRatio;
        this.ctx.scale(devicePixelRatio, devicePixelRatio);
    }

    draw(cells, antsMap) {
        const cellWidth = this.width / cells[0].length;
        const cellHeight = this.height / cells.length;
        this.drawCells(cells, cellWidth, cellHeight);
        this.drawAnts(antsMap, cellWidth, cellHeight);
    }

    drawCells(cells, cellWidth, cellHeight) {
        this.ctx.clearRect(0, 0, this.width, this.height);
        for (let x = 0; x < cells.length; x++) {
            for (let y = 0; y < cells[x].length; y++) {
                this.ctx.fillStyle = cells[x][y].color;
                this.ctx.fillRect(y * cellWidth, x * cellHeight, cellWidth, cellHeight);


                // Pheromone
                if (cells[x][y] instanceof Free) {
                    const color = Math.floor(cells[x][y].pheromone * 255);
                    this.ctx.fillStyle = color === 0 ? "white" : `rgb(${color}, 0, ${255 - color})`;
                    this.ctx.fillRect(y * cellWidth, x * cellHeight, cellWidth, cellHeight);
                }
            }
        }
    }

    drawAnts(antsMap, cellWidth, cellHeight) {
        for (let ant of antsMap.keys()) {
            this.ctx.fillStyle = ant.getColor();
            const cell = antsMap.get(ant);
            // random between 0 and 1
            const randomNumberBetween0And1 = Math.random();

            const x = cell.x + randomNumberBetween0And1 / 2
            const y = cell.y + randomNumberBetween0And1 / 2

            this.ctx.fillRect(y * cellWidth, x * cellHeight, cellWidth * 0.6, cellHeight * 0.6);
        }
    }

}