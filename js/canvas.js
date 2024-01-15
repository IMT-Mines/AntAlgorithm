class Canvas {
    constructor(ctx) {
        this.ctx = ctx;
        this.ctx.fillStyle = "white";
        this.width = this.ctx.canvas.width;
        this.height = this.ctx.canvas.height;
        console.log(window.devicePixelRatio)
        const devicePixelRatio = 10;
        this.ctx.canvas.width *= devicePixelRatio;
        this.ctx.canvas.height *= devicePixelRatio;
        this.ctx.scale(devicePixelRatio, devicePixelRatio);
    }

    drawCells(info) {
        const cells = info[0];
        const antsMap = info[1];

        const cellWidth = this.width / cells[0].length;
        const cellHeight = this.height / cells.length;
        this.ctx.clearRect(0, 0, this.width, this.height);
        for (let x = 0; x < cells.length; x++) {
            for (let y = 0; y < cells[x].length; y++) {
                this.ctx.fillStyle = cells[x][y].color;
                this.ctx.fillRect(y * cellWidth, x * cellHeight, cellWidth, cellHeight);
            }
        }
        for (let ant of antsMap.keys()) {
            this.ctx.fillStyle = ant.color;
            const cell = antsMap.get(ant);
            // random between 0 and 1
            const randomNumberBetween0And1 = Math.random();

            const x = cell.x + randomNumberBetween0And1 / 2
            const y = cell.y + randomNumberBetween0And1 / 2

            this.ctx.fillRect(y * cellWidth, x * cellHeight, cellWidth / 4, cellHeight / 4);


        }
    }

}