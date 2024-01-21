class Canvas {
    constructor(ctx, antImage) {
        this.ctx = ctx;
        this.ctx.fillStyle = "white";
        this.width = this.ctx.canvas.width;
        this.height = this.ctx.canvas.height;
        const devicePixelRatio = 10;
        this.ctx.canvas.width *= devicePixelRatio;
        this.ctx.canvas.height *= devicePixelRatio;
        this.ctx.scale(devicePixelRatio, devicePixelRatio);
        this.antImage = antImage;
    }

    draw(cells, antsMap, deltaTime) {
        const cellWidth = this.width / cells[0].length;
        const cellHeight = this.height / cells.length;
        this.drawCells(cells, cellWidth, cellHeight);
        this.drawAnts(antsMap, cellWidth, cellHeight, deltaTime);
    }

    drawCells(cells, cellWidth, cellHeight) {
        this.ctx.clearRect(0, 0, this.width, this.height);
        for (let col = 0; col < cells.length; col++) {
            for (let row = 0; row < cells[col].length; row++) {
                this.ctx.fillStyle = cells[row][col].color;
                this.ctx.fillRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
                if (cells[row][col] instanceof Food) {
                    if (cells[row][col].getFoodQuantity() === 0) {
                        this.ctx.fillStyle = "orange";
                        this.ctx.fillRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
                    }
                }

                // Pheromone drawing
                if (cells[row][col] instanceof Free) {
                    const color = Math.floor(cells[row][col].getPheromone() * 255);
                    this.ctx.fillStyle = color === 0 ? "white" : `rgb(${color}, 0, ${255 - color})`;
                    this.ctx.fillRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
                }
            }
        }
    }

    drawAnts(antsMap, cellWidth, cellHeight, deltaTime) {
        const speed = 1;
        for (let ant of antsMap.keys()) {
            const cell = antsMap.get(ant);

            let initX = ant.x;
            let initY = ant.y;
            let destX = cell.col;
            let destY = cell.row;

            let xDiff = destX - initX;
            let yDiff = destY - initY;

            let normalizedDeltaTime = deltaTime / 1000;
            let deltaX = speed * xDiff * normalizedDeltaTime;
            let deltaY = speed * yDiff * normalizedDeltaTime;

            let rotation = Math.atan2(yDiff, xDiff);

            ant.x += deltaX;
            ant.y += deltaY;

            this.ctx.drawImage(this.antImage, ant.x * cellWidth, ant.y * cellHeight, cellWidth, cellHeight);
        }
    }
}