class Canvas {
    constructor(ctx) {
        this.ctx = ctx;
        this.ctx.fillStyle = "white";
    }

    drawPoint(x, y) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, 10, 0, Math.PI * 2, true);
        this.ctx.fill();
    }
}