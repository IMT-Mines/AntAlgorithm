class Canvas {

    // BLOCK_WIDTH = 512;
    // BLOCK_PER_ROW = 5;

    // // pattern: "top right bottom left" (0 = no wall, 1 = wall)
    // wallPlacement = [
    //     { pattern: "0110", blockIndex: 0 },
    //     { pattern: "0111", blockIndex: 1 },
    //     { pattern: "0011", blockIndex: 2 },
    //     { pattern: "0010", blockIndex: 3 },
    //     { pattern: "1110", blockIndex: 5 },
    //     { pattern: "1111", blockIndex: 6 },
    //     { pattern: "1011", blockIndex: 7 },
    //     { pattern: "1010", blockIndex: 8 },
    //     { pattern: "1100", blockIndex: 10 },
    //     { pattern: "1101", blockIndex: 11 },
    //     { pattern: "1001", blockIndex: 12 },
    //     { pattern: "1000", blockIndex: 13 },
    //     { pattern: "0100", blockIndex: 15 },
    //     { pattern: "0101", blockIndex: 16 },
    //     { pattern: "0001", blockIndex: 17 },
    //     { pattern: "0000", blockIndex: 18 },
    // ]

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
                this.drawPheromones(cell, row, col, cellWidth, cellHeight, maxPheromone);
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
        if (cell instanceof Food && cell.getFoodQuantity() > 0) {
            const foodQuantityMultiplier = Math.max(cell.getFoodQuantity(), 0.7);

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
                const x = col * cellWidth + cell.getRandomPheromone().x * cellWidth;
                const y = row * cellHeight + cell.getRandomPheromone().y * cellHeight;
                const radius = cell.getRandomPheromone().r;
                this.ctx.beginPath();
                this.ctx.arc(x, y, radius, 0, 2 * Math.PI);

                this.ctx.fillStyle = `rgb(${color}, 0, ${255 - color})`;
                this.ctx.fill();
            }
        }
    }


    drawAnts(antsMap, cellWidth, cellHeight, deltaTime) {
        for (let ant of antsMap.keys()) {
            const cell = antsMap.get(ant);

            const initX = ant.x;
            const initY = ant.y;
            const destX = cell.col * cellWidth;
            const destY = cell.row * cellHeight;

            const angle = Math.atan2(destY - initY, destX - initX);
            const rotation = angle + Math.PI;

            this.ctx.save();
            this.ctx.translate(ant.x + cellWidth / 2, ant.y + cellHeight / 2);
            this.ctx.rotate(rotation);
            this.ctx.drawImage(this.antAsset, -cellWidth / 4, -cellHeight / 4, cellWidth / 2, cellHeight / 2);
            this.ctx.restore();

            if (ant.isBackToStartCell()) {
                const foodCell = ant.foodTransport;
                this.ctx.drawImage(this.foodAndColonyAsset,
                    foodCell.getRandomPattern() * 32, 14 * 32,
                    32, 32,
                    ant.x + cellWidth / 4, ant.y + cellHeight / 4,
                    cellWidth / 2, cellHeight / 2);
            }
        }
    }

    // drawObstacles() {
    //     // TODO: DRAW OBASTACLES ON A DIFFERENT CANVAS (different layer to only draw once)
    //     for (let col = 1; col < grid.cells.length - 1; col++) {
    //         for (let row = 1; row < grid.cells[0].length - 1; row++) {
    //             const cell = grid.cells[row][col];
    //             if (cell instanceof Obstacle) {
    //                 const neighbours = grid.getNeighbours(cell, false);
    //                 const pattern = neighbours.map(neighbour => neighbour instanceof Obstacle ? 1 : 0).join('');
    //                 const { blockX, blockY } = this.getWallAssetFromPattern(pattern);
    //                 this.ctx.drawImage(this.tilesetAsset,
    //                     blockX * this.BLOCK_WIDTH, blockY * this.BLOCK_WIDTH,
    //                     this.BLOCK_WIDTH, this.BLOCK_WIDTH,
    //                     col * cellWidth, row * cellHeight,
    //                     cellWidth, cellHeight);
    //             }
    //         }
    //     }
    //
    //     // const top = this.getWallAssetFromPattern("1101");
    //     // const right = this.getWallAssetFromPattern("1110");
    //     // const bottom = this.getWallAssetFromPattern("0111");
    //     // const left = this.getWallAssetFromPattern("1011");
    //     const top = this.getWallAssetFromPattern("1111");
    //     const right = this.getWallAssetFromPattern("1111");
    //     const bottom = this.getWallAssetFromPattern("1111");
    //     const left = this.getWallAssetFromPattern("1111");
    //
    //     for (let i = 0; i < grid.cells.length; i++) {
    //         this.ctx.drawImage(this.tilesetAsset,
    //             top.blockX * this.BLOCK_WIDTH, top.blockY * this.BLOCK_WIDTH,
    //             this.BLOCK_WIDTH, this.BLOCK_WIDTH,
    //             i * cellWidth, 0,
    //             cellWidth, cellHeight);
    //
    //         this.ctx.drawImage(this.tilesetAsset,
    //             right.blockX * this.BLOCK_WIDTH, right.blockY * this.BLOCK_WIDTH,
    //             this.BLOCK_WIDTH, this.BLOCK_WIDTH,
    //             (grid.cells.length - 1) * cellWidth, i * cellHeight,
    //             cellWidth, cellHeight);
    //
    //         this.ctx.drawImage(this.tilesetAsset,
    //             left.blockX * this.BLOCK_WIDTH, left.blockY * this.BLOCK_WIDTH,
    //             this.BLOCK_WIDTH, this.BLOCK_WIDTH,
    //             0, i * cellHeight,
    //             cellWidth, cellHeight);
    //
    //         this.ctx.drawImage(this.tilesetAsset,
    //             bottom.blockX * this.BLOCK_WIDTH, bottom.blockY * this.BLOCK_WIDTH,
    //             this.BLOCK_WIDTH, this.BLOCK_WIDTH,
    //             i * cellWidth, (grid.cells[0].length - 1) * cellHeight,
    //             cellWidth, cellHeight);
    //     }
    // }

    getWallAssetFromPattern(pattern) {
        const wall = this.wallPlacement.find(wall => wall.pattern === pattern);
        if (!wall)
            this.missingPattern.push(pattern);
        const blockIndex = wall ? wall.blockIndex : 6;
        const blockX = blockIndex % this.BLOCK_PER_ROW;
        const blockY = Math.floor(blockIndex / this.BLOCK_PER_ROW);
        return {blockX, blockY};
    }

}