class AntsManager {

    ALREADY_VISITED_MALUS = 1;

    constructor() {
        this.alpha = 1;
        this.explorationRate = 1;
        this.dropParameter = 0.5;
        this.ants = new Map();
    }

    setAlpha(alpha) {
        this.alpha = alpha;
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
            ant.x = startCell.col * cellSize;
            ant.y = startCell.row * cellSize;
            ant.getHistory().push(startCell)
            this.ants.set(ant, startCell);
            this.getNextGoal(ant, grid);
        }
    }

    hasReachGoal(ant, cellSize) {
        const goal = this.ants.get(ant);
        const goalX = goal.col * cellSize;
        const goalY = goal.row * cellSize;
        return Math.abs(ant.x - goalX) <= 5 && Math.abs(ant.y - goalY) <= 5;
    }

    getNextGoal(ant, grid) {
        if (ant.isBackToStartCell()) {
            this.backToStartCell(ant);
            return;
        }
        const currentCell = this.ants.get(ant);
        const neighbours = grid.getNeighbours(currentCell);
        const probability = [];

        let sumDenominator = 0;
        for (let neighbour of neighbours) {
            const malus = this.isAlreadyVisited(neighbour, ant) ? this.ALREADY_VISITED_MALUS : 0;
            sumDenominator += this.explorationRate + neighbour.getPheromone() ** this.alpha - malus;
        }

        for (let neighbour of neighbours) {
            const malus = this.isAlreadyVisited(neighbour, ant) ? this.ALREADY_VISITED_MALUS : 0;
            const numerator = this.explorationRate + neighbour.getPheromone() ** this.alpha - malus;
            const result = numerator / sumDenominator;
            probability.push(result);
        }

        const chosenCell = this.selectCell(ant, neighbours, probability);

        this.ants.set(ant, chosenCell);
        ant.getHistory().push(chosenCell);

        if (chosenCell instanceof Food && chosenCell.getFoodQuantity() > 0) {
            ant.setTransport(0.1);
            grid.getCell(chosenCell.row, chosenCell.col).addFoodQuantity(-0.1);
            ant.setBackToStartCell(true);
            grid.getShortestPath(chosenCell, ant);
            ant.pathLength = ant.getHistory().length;
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

    /**
     * The ant goes back to the start cell by depiling the history. if the cell is start cell, the ant will drop the food and
     * go back to the exploration, else it will drop pheromone on the path with a quantity depending on the length of the path
     * // TODO Adapt quantity with length of path
     * @param ant
     */
    backToStartCell(ant) {
        const cell = ant.getHistory().pop();
        if (!cell) return;
        this.ants.set(ant, cell);

        if (cell instanceof Start) {
            ant.getHistory().push(cell);
            ant.setTransport(0);
            cell.addFoodQuantity(ant.getTransport());
            ant.pathLength = 0;
            ant.setBackToStartCell(false);
        } else {
            this.dropPheromone(ant, cell);
        }
    }


    dropPheromone(ant, cell) {
        cell.addPheromone(this.dropParameter / ant.pathLength);
    }

    clone() {
        const clone = new AntsManager();
        for (let ant of this.ants.keys()) {
            const clonedAnt = new Ant();
            const clonedHistory = [];
            for (let cell of ant.getHistory()) {
                clonedHistory.push(cell); // Todo maybe clone cell
            }
            clonedAnt.setHistory(clonedHistory);
            clonedAnt.setBackToStartCell(ant.isBackToStartCell());
            clone.ants.set(clonedAnt, this.ants.get(ant));
        }
        return clone;
    }
}