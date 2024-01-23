class Canvas {

    assets = {
        ant: "assets/tiles/ant.png", // this.antAsset
    }

    constructor(ctx) {
        this.ctx = ctx;
        this.ctx.fillStyle = "white";
        this.width = this.ctx.canvas.width;
        this.height = this.ctx.canvas.height;
        const devicePixelRatio = 10;
        this.ctx.canvas.width *= devicePixelRatio;
        this.ctx.canvas.height *= devicePixelRatio;
        this.ctx.scale(devicePixelRatio, devicePixelRatio);
        this.loadAssets();
    }

    loadImage(src) {
        return new Promise(resolve => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.src = src;
        });
    }

    loadAssets() {
        const imagePromises = Object.entries(this.assets).map(([key, value]) => {
            return this.loadImage(value).then(image => {
                this[key + 'Asset'] = image;
            });
        });
        return Promise.all(imagePromises);
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
                const cell = cells[row][col];

                this.ctx.fillStyle = cells[row][col].color;

                // Food drawing
                if (cell instanceof Food) {
                    this.ctx.fillStyle = cell.color;
                    if (cell.getFoodQuantity() === 0)
                        this.ctx.fillStyle = "orange";
                }

                // Pheromone drawing
                if (cell instanceof Free) {
                    const pheromone = cell.getPheromone();
                    const color = Math.floor(pheromone * 255);
                    this.ctx.globalAlpha = (pheromone < 0.05) ? pheromone / 0.05 : 1;
                    this.ctx.fillStyle = color === 0 ? "white" : `rgb(${color}, 0, ${255 - color})`;
                }

                this.ctx.fillRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
                this.ctx.globalAlpha = 1;
            }
        }
    }


    drawAnts(antsMap, cellWidth, cellHeight, deltaTime) {
        for (let ant of antsMap.keys()) {
            const cell = antsMap.get(ant);

            const initX = ant.x;
            const initY = ant.y;
            const destX = cell.col;
            const destY = cell.row;

            const xDiff = destX - initX;
            const yDiff = destY - initY;

            const normalizedDeltaTime = deltaTime / 1000;
            const deltaX = Options.CELL_PER_SECOND * xDiff * normalizedDeltaTime;
            const deltaY = Options.CELL_PER_SECOND * yDiff * normalizedDeltaTime;

            const rotation = Math.atan2(yDiff, xDiff) + Math.PI;

            ant.x += deltaX;
            ant.y += deltaY;

            // TODO: fix ant rotation
            // this.ctx.save();
            // this.ctx.translate(ant.x * cellWidth + cellWidth / 2, ant.y * cellHeight + cellHeight / 2);
            // this.ctx.rotate(rotation);
            // this.ctx.drawImage(this.antAsset, -cellWidth / 2, -cellHeight / 2, cellWidth / 2, cellHeight);
            // this.ctx.restore();

            this.ctx.drawImage(this.antAsset, ant.x * cellWidth, ant.y * cellHeight, cellWidth, cellHeight);
        }
    }
}