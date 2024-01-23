class Canvas {

    BLOCK_WIDTH = 512;
    BLOCK_PER_ROW = 5;

    assets = {
        ant: "assets/ant.svg", // this.antAsset
        tileset: "assets/tileset.png", // this.wallAsset
    }

    // pattern: "top right bottom left" (0 = no wall, 1 = wall)
    wallPlacement = [
        { pattern: "0110", blockIndex: 0 },
        { pattern: "0111", blockIndex: 1 },
        { pattern: "0011", blockIndex: 2 },
        { pattern: "0010", blockIndex: 3 },
        { pattern: "1110", blockIndex: 5 },
        { pattern: "1111", blockIndex: 6 },
        { pattern: "1011", blockIndex: 7 },
        { pattern: "1010", blockIndex: 8 },
        { pattern: "1100", blockIndex: 10 },
        { pattern: "1101", blockIndex: 11 },
        { pattern: "1001", blockIndex: 12 },
        { pattern: "1000", blockIndex: 13 },
        { pattern: "0100", blockIndex: 15 },
        { pattern: "0101", blockIndex: 16 },
        { pattern: "0001", blockIndex: 17 },
        { pattern: "0000", blockIndex: 18 },
    ]

    constructor(ctx, grid) {
        this.ctx = ctx;
        this.grid = grid;
        this.ctx.imageSmoothingEnabled = false;
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
        const cellWidth = this.width / grid.cells[0].length;
        const cellHeight = this.height / grid.cells.length;
        this.drawCells(grid, cellWidth, cellHeight);
        this.drawAnts(antsMap, cellWidth, cellHeight, deltaTime);
    }

    drawCells(grid, cellWidth, cellHeight) {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // TODO: DRAW OBASTACLES ON A DIFFERENT CANVAS (different layer to only draw once)
        for (let col = 1; col < grid.cells.length - 1; col++) {
            for (let row = 1; row < grid.cells[0].length - 1; row++) {
                const cell = grid.cells[row][col];
                if (cell instanceof Obstacle) {
                    const neighbours = grid.getNeighbours(cell, false);
                    const pattern = neighbours.map(neighbour => neighbour instanceof Obstacle ? 1 : 0).join('');
                    const { blockX, blockY } = this.getWallAssetFromPattern(pattern);
                    this.ctx.drawImage(this.tilesetAsset,
                        blockX * this.BLOCK_WIDTH, blockY * this.BLOCK_WIDTH,
                        this.BLOCK_WIDTH, this.BLOCK_WIDTH,
                        col * cellWidth, row * cellHeight,
                        cellWidth, cellHeight);
                }
            }
        }

        // const top = this.getWallAssetFromPattern("1101");
        // const right = this.getWallAssetFromPattern("1110");
        // const bottom = this.getWallAssetFromPattern("0111");
        // const left = this.getWallAssetFromPattern("1011");
        const top = this.getWallAssetFromPattern("1111");
        const right = this.getWallAssetFromPattern("1111");
        const bottom = this.getWallAssetFromPattern("1111");
        const left = this.getWallAssetFromPattern("1111");

        for (let i = 0; i < grid.cells.length; i++) {
            this.ctx.drawImage(this.tilesetAsset,
                top.blockX * this.BLOCK_WIDTH, top.blockY * this.BLOCK_WIDTH,
                this.BLOCK_WIDTH, this.BLOCK_WIDTH,
                i * cellWidth, 0,
                cellWidth, cellHeight);

            this.ctx.drawImage(this.tilesetAsset,
                right.blockX * this.BLOCK_WIDTH, right.blockY * this.BLOCK_WIDTH,
                this.BLOCK_WIDTH, this.BLOCK_WIDTH,
                (grid.cells.length - 1) * cellWidth, i * cellHeight,
                cellWidth, cellHeight);

            this.ctx.drawImage(this.tilesetAsset,
                left.blockX * this.BLOCK_WIDTH, left.blockY * this.BLOCK_WIDTH,
                this.BLOCK_WIDTH, this.BLOCK_WIDTH,
                0, i * cellHeight,
                cellWidth, cellHeight);

            this.ctx.drawImage(this.tilesetAsset,
                bottom.blockX * this.BLOCK_WIDTH, bottom.blockY * this.BLOCK_WIDTH,
                this.BLOCK_WIDTH, this.BLOCK_WIDTH,
                i * cellWidth, (grid.cells[0].length - 1) * cellHeight,
                cellWidth, cellHeight);
        }

        const missingPattern = [...new Set(this.missingPattern)];
        if (missingPattern.length > 0) {
            console.log(missingPattern);
            this.missingPattern = [];
        }


        for (let col = 0; col < grid.cells.length; col++) {
            for (let row = 0; row < grid.cells[col].length; row++) {
                const cell = grid.cells[row][col];

                if (cell instanceof Food) {
                    this.ctx.fillStyle = cell.color;
                    if (cell.getFoodQuantity() < 0)
                        this.ctx.fillStyle = "orange";
                } else if (cell instanceof Free) {
                    const pheromone = cell.getPheromone();
                    const color = Math.floor(pheromone * 255);
                    this.ctx.globalAlpha = (pheromone < 0.05) ? pheromone / 0.05 : 1;
                    this.ctx.fillStyle = color === 0 ? "white" : `rgb(${color}, 0, ${255 - color})`;
                }

                this.ctx.globalAlpha = 1;

                if (cell instanceof Obstacle) {
                    continue;
                }

                this.ctx.fillRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);

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

    missingPattern = [];

    getWallAssetFromPattern(pattern) {
        const wall = this.wallPlacement.find(wall => wall.pattern === pattern);
        if (!wall)
            this.missingPattern.push(pattern);
        const blockIndex = wall ? wall.blockIndex : 6;
        const blockX = blockIndex % this.BLOCK_PER_ROW;
        const blockY = Math.floor(blockIndex / this.BLOCK_PER_ROW);
        return { blockX, blockY };
    }

}