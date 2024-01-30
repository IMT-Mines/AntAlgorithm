class AntsManager {

    constructor() {
        this.alpha = 1;
        this.explorationRate = 1;
        this.dropParameter = 0.5;
        this.alreadyVisitedMalus = 1;
        this.ants = new Map();
    }

    setAlpha(alpha) {
        this.alpha = alpha;
    }

    setAlreadyVisitedMalus(alreadyVisitedMalus) {
        this.alreadyVisitedMalus = alreadyVisitedMalus;
    }

    setExplorationRate(explorationRate) {
        this.explorationRate = explorationRate;
    }

    setDropParameter(dropParameter) {
        this.dropParameter = dropParameter;
    }

    initAnts(grid, antNumber, cellSize) {
        const startCell = grid.startCell;
        for (let i = 0; i < antNumber; i++) {
            const ant = new Ant();
            ant.setX(startCell.col * cellSize);
            ant.setY(startCell.row * cellSize);
            ant.getHistory().push(startCell)
            this.ants.set(ant, startCell);
            this.getNextGoal(ant, grid);
        }
    }

    hasReachGoal(ant, cellSize) {
        const goal = this.ants.get(ant);
        const goalX = goal.col * cellSize;
        const goalY = goal.row * cellSize;
        return Math.abs(ant.getX() - goalX) <= 5 && Math.abs(ant.getY() - goalY) <= 5;
    }

    getNextGoal(ant, grid) {
        let maxPheromone = 0;
        for (let col = 0; col < grid.cells.length; col++) {
            for (let row = 0; row < grid.cells[col].length; row++) {
                const cell = grid.cells[row][col];
                if (cell instanceof Free) {
                    maxPheromone = Math.max(maxPheromone, cell.getMaxPheromone());
                }
            }
        }

        grid.setMaxPheromone(maxPheromone);

        if (ant.isBackToStartCell()) {
            this.backToStartCell(ant);
            return;
        }
        const currentCell = this.ants.get(ant);
        const neighbours = grid.getNeighbours(currentCell);
        const probability = [];

        let sumDenominator = 0;
        let chosenCell = null;
        for (let neighbour of neighbours) {
            const malus = this.isAlreadyVisited(neighbour, ant) ? this.alreadyVisitedMalus : 0;
            sumDenominator += this.explorationRate + neighbour.getPheromone() ** this.alpha - malus;
            if (neighbour instanceof Food && neighbour.getFoodQuantity() >= 0.1) { // If the neighbour has food, we choose it
                chosenCell = neighbour;
                break;
            }
        }

        if (chosenCell == null) {
            for (let neighbour of neighbours) {
                const malus = this.isAlreadyVisited(neighbour, ant) ? this.alreadyVisitedMalus : 0;
                const numerator = this.explorationRate + neighbour.getPheromone() ** this.alpha - malus;
                const result = numerator / sumDenominator;
                probability.push(result);
            }

            chosenCell = this.selectCell(ant, neighbours, probability);
        }

        this.ants.set(ant, chosenCell);
        ant.getHistory().push(chosenCell);

        if (chosenCell instanceof Food && chosenCell.getFoodQuantity() >= 0.1) {
            ant.setTransportQuantity(0.1);
            grid.getCell(chosenCell.row, chosenCell.col).addFoodQuantity(-0.1);
            ant.setFoodCellTransport(chosenCell);
            ant.setBackToStartCell(true);
            grid.getShortestPath(chosenCell, ant);
            ant.setReturnPathLength(ant.getHistory().length);
            this.backToStartCell(ant)
        }
    }

    isAlreadyVisited(cell, ant) {
        const history = ant.getHistory();
        for (let i = history.length - 1; i > history.length - 10; i--) {
            if (history[i] === cell) {
                return true;
            }
        }
        return false;
    }

    selectCell(ant, cells, probabilities) {
        const probability = Math.random();
        let cumulativeProbability = 0;
        for (let i = 0; i < probabilities.length; i++) {
            cumulativeProbability += probabilities[i];
            if (probability < cumulativeProbability) {
                return cells[i];
            }
        }
        return cells[cells.length - 1];
    }

    backToStartCell(ant) {
        const cell = ant.getHistory().pop();
        if (!cell) return;
        this.ants.set(ant, cell);

        if (cell instanceof Start) {
            ant.getHistory().push(cell);
            cell.addFoodQuantity(ant.getTransportQuantity());
            ant.setTransportQuantity(0);
            ant.setReturnPathLength(0);
            ant.setBackToStartCell(false);
            ant.setFoodCellTransport(undefined);
        } else {
            this.dropPheromone(ant, cell);
        }
    }

    dropPheromone(ant, cell) {
        cell.addPheromone(this.dropParameter / ant.getReturnPathLength());
    }

    clone() {
        const clone = new AntsManager();
        for (let ant of this.ants.keys()) {
            const clonedAnt = ant.clone();
            clone.ants.set(clonedAnt, this.ants.get(ant).clone());
        }
        return clone;
    }
}