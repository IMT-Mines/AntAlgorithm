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

    drawCells(cells) {
        const cellWidth = this.width / cells[0].length;
        const cellHeight = this.height / cells.length;
        this.ctx.clearRect(0, 0, this.width, this.height);
        for (let x = 0; x < cells.length; x++) {
            for (let y = 0; y < cells[x].length; y++) {
                this.ctx.fillStyle = cells[x][y].color;
                this.ctx.fillRect(y * cellWidth, x * cellHeight, cellWidth, cellHeight);
            }
        }
    }

}