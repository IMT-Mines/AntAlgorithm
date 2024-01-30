class Canvas {

    assets = {
        ant: "assets/tiles/ant.png", // this.antAsset
        grass: "assets/tiles/grass.png", // this.grassAsset
        shadow: "assets/tiles/shadow.png", // this.showAsset
        tree: "assets/tiles/tree.png", // this.treeAsset
        foodAndColony: "assets/tiles/foodAndColony.png", // this.foodAndColonyAsset
    }

    constructor(ctx) {
        this.ctx = ctx;
        this.ctx.globalAlpha = 0.5;
        this.ctx.fillStyle = "white";
        this.width = this.ctx.canvas.width;
        this.height = this.ctx.canvas.height;
        const devicePixelRatio = 5;
        this.ctx.canvas.width *= devicePixelRatio;
        this.ctx.canvas.height *= devicePixelRatio;
        this.ctx.scale(devicePixelRatio, devicePixelRatio);
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

    draw(grid, antsMap, deltaTime) {
        let maxPheromone = 0;
        for (let col = 0; col < grid.cells.length; col++) {
            for (let row = 0; row < grid.cells[col].length; row++) {
                const cell = grid.cells[row][col];
                if (cell instanceof Free) {
                    maxPheromone = Math.max(maxPheromone, cell.getPheromone());
                }
            }
        }
        const cellWidth = this.width / grid.cells.length;
        const cellHeight = this.height / grid.cells.length;
        this.ctx.clearRect(0, 0, this.width, this.height);

        for (let col = 0; col < grid.cells.length; col++) {
            for (let row = 0; row < grid.cells[col].length; row++) {
                const cell = grid.cells[row][col];
                this.drawGround(cell, row, col, cellWidth, cellHeight);
                this.drawStartAndFood(cell, row, col, cellWidth, cellHeight);
                this.drawObstacles(cell, row, col, cellWidth, cellHeight);
                if (Options.DISPLAY_PHEROMONE)
                    this.drawPheromones(cell, row, col, cellWidth, cellHeight, maxPheromone);
                if (Options.DEBUG_PHEROMONE_VALUE)
                    this.drawDebug(cell, row, col, cellWidth, cellHeight);
            }
        }
        this.drawAnts(antsMap, cellWidth, cellHeight, deltaTime);
    }

    drawGround(cell, row, col, cellWidth, cellHeight) {
        this.ctx.drawImage(this.grassAsset,
            cell.getRandomPattern().x, cell.getRandomPattern().y,
            64, 64,
            col * cellWidth, row * cellHeight,
            cellWidth, cellHeight);
    }

    drawStartAndFood(cell, row, col, cellWidth, cellHeight) {
        if (!(cell instanceof Start) && !(cell instanceof Food)) return;
        this.ctx.drawImage(this.grassAsset,
            0, 0,
            128, 128,
            col * cellWidth, row * cellHeight,
            cellWidth, cellHeight);
        if (cell instanceof Food && cell.getFoodQuantity() >= 0.1) {
            const foodQuantityMultiplier = Math.max(cell.getFoodQuantity(), 0.5);

            this.ctx.drawImage(this.foodAndColonyAsset,
                cell.getRandomPattern() * 32, 14 * 32,
                32, 32,
                col * cellWidth + (1 - foodQuantityMultiplier) * cellWidth / 2,
                row * cellHeight + (1 - foodQuantityMultiplier) * cellHeight / 2,
                cellWidth * foodQuantityMultiplier,
                cellHeight * foodQuantityMultiplier);
        } else if (cell instanceof Start) {
            this.ctx.drawImage(this.foodAndColonyAsset,
                32 + cell.getRandomPattern() * 32, 20 * 32,
                32, 32,
                col * cellWidth, row * cellHeight,
                cellWidth, cellHeight);
        }
    }

    drawObstacles(cell, row, col, cellWidth, cellHeight) {
        if (cell instanceof Obstacle) {
            this.ctx.drawImage(this.grassAsset,
                0, 0,
                128, 128,
                col * cellWidth, row * cellHeight,
                cellWidth, cellHeight);
            this.ctx.drawImage(this.shadowAsset,
                45, 96,
                90, 56,
                col * cellWidth, row * cellHeight,
                cellWidth, cellHeight);
            this.ctx.drawImage(this.treeAsset,
                16, 16,
                138, 150,
                col * cellWidth - cellWidth * 0.2, row * cellHeight - cellHeight * 0.5,
                cellWidth * 1.5, cellHeight * 1.8);
        }
    }

    drawPheromones(cell, row, col, cellWidth, cellHeight, maxPheromone) {
        if (!(cell instanceof Free)) return;
        const pheromone = cell.getPheromone();
        const color = Math.floor(pheromone / maxPheromone * 255);
        if (pheromone > 0.01) {
            const numberOfCircle = Math.floor(RandomNumberGenerator.next() * 3) + 1;

            for (let i = 0; i < numberOfCircle; i++) {
                const x = col * cellWidth + (cell.getRandomPheromone().x + 0.1) * (cellWidth * 0.9);
                const y = row * cellHeight + (cell.getRandomPheromone().y + 0.1) * (cellHeight * 0.9);
                const radius = cell.getRandomPheromone().r;
                this.ctx.beginPath();
                this.ctx.arc(x, y, radius, 0, 2 * Math.PI);

                this.ctx.fillStyle = `rgb(${color}, 0, ${255 - color})`;
                this.ctx.fill();
            }
        }
    }

    drawDebug(cell, row, col, cellWidth, cellHeight) {
        if (Options.DEBUG_PHEROMONE_VALUE) {
            if (cell instanceof Free) {
                const color = Math.floor(cell.getPheromone() / 0.1 * 255);
                this.ctx.fillStyle = `rgb(${color}, 0, ${255 - color})`;
                this.ctx.fillRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
                this.ctx.fillStyle = "black";
                this.ctx.font = "10px Arial";
                this.ctx.fillText("" + Math.floor(cell.getPheromone() * 100) / 100, col * cellWidth + cellWidth / 2 - 10,
                    row * cellHeight + cellHeight / 2 + 5);
            }

            if (cell instanceof Food) {
                this.ctx.fillStyle = "yellow";
                this.ctx.fillRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
            }
        }
    }


    drawAnts(antsMap, cellWidth, cellHeight, deltaTime) {
        for (let ant of antsMap.keys()) {
            const cell = antsMap.get(ant);

            const initX = ant.getX();
            const initY = ant.getY();
            const destX = cell.col * cellWidth;
            const destY = cell.row * cellHeight;

            const angle = Math.atan2(destY - initY, destX - initX);
            const rotation = angle + Math.PI;

            this.ctx.save();
            this.ctx.translate(ant.getX() + cellWidth / 2, ant.getY() + cellHeight / 2);
            this.ctx.rotate(rotation);
            this.ctx.drawImage(this.antAsset, -cellWidth / 4, -cellHeight / 4, cellWidth / 2, cellHeight / 2);
            this.ctx.restore();

            if (ant.isBackToStartCell()) {
                const foodCell = ant.getFoodCellTransport();
                this.ctx.drawImage(this.foodAndColonyAsset,
                    foodCell.getRandomPattern() * 32, 14 * 32,
                    32, 32,
                    ant.getX() + cellWidth / 4, ant.getY() + cellHeight / 4,
                    cellWidth / 2, cellHeight / 2);
            }
        }
    }
}