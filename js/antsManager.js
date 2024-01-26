class AntsManager {

    ALREADY_VISITED_MALUS = 0.1;

    constructor() {
        this.alpha = 1;
        this.explorationRate = 0.1;
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


    initAnts(startCell, antNumber) {
        for (let i = 0; i < antNumber; i++) {
            const ant = new Ant();
            ant.x = startCell.col;
            ant.y = startCell.row;
            ant.getHistory().push(startCell)
            this.ants.set(ant, startCell);
        }
    }

    moveAnts(grid) {
        for (let ant of this.ants.keys()) {
            if (ant.isBackToStartCell()) {
                this.backToStartCell(ant);
                continue;
            }
            const currentCell = this.ants.get(ant);
            const neighbours = grid.getNeighbours(currentCell);
            const probability = [];

            let sumDenominator = 0;
            for (let neighbour of neighbours) {
                const malus = this.isAlreadyVisited(neighbour, ant) ? this.ALREADY_VISITED_MALUS : 0;
                sumDenominator += this.explorationRate + neighbour.getPheromone() ** this.alpha;
            }

            for (let neighbour of neighbours) {
                const malus = this.isAlreadyVisited(neighbour, ant) ? this.ALREADY_VISITED_MALUS : 0;
                const numerator = this.explorationRate + neighbour.getPheromone() ** this.alpha;
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
    }

    isAlreadyVisited(cell, ant) {
        const history = ant.getHistory();
        for (let i = history.length - 1; i >= history.length / 2; i--) {
            if (history[i] === cell) {
                return true;
            }
        }
        return false;
    }


    /**
     * Find the cell with the highest probability, but if the cell has already been visited, it will be penalized
     * by ALREADY_VISITED_MALUS factor
     * @param ant The ant
     * @param cells The cells to choose from
     * @param probabilities The probabilities of each cell
     * @returns {*}  // TODO Review return code (can return undefined ??)
     */
    selectCell(ant, cells, probabilities) {
        // for (let cell of cells) {
        //     const history = ant.getHistory();
        //     for (let i = history.length - 1; i >= 0; i--) {
        //         if (history[i] === cell) {
        //             probabilities[cells.indexOf(cell)] *= this.ALREADY_VISITED_MALUS;
        //         }
        //     }
        // }

        const probability = Math.random();
        console.log("Probability = " + probability);
        console.log("List of probabilities : " + probabilities);

        let cumulativeProbability = 0;
        for (let i = 0; i < probabilities.length; i++) {
            cumulativeProbability += probabilities[i];
            console.log(cumulativeProbability);
            if (probability < cumulativeProbability) {
                console.log("SELECTED CELL Probability = " + probabilities[i]);
                console.log("================================")
                return cells[i];
            }
        }

        console.log("================================")
        return cells[cells.length - 1];


        // return potentialCells[Math.floor(Math.random() * potentialCells.length)];

        // const maxProbability = Math.max(...probabilities);
        // const potentialCells = [];
        // for (let i = 0; i < probabilities.length; i++) {
        //     if (probabilities[i] === maxProbability) {
        //         potentialCells.push(cells[i]);
        //     }
        // }
        //
        // return potentialCells[Math.floor(Math.random() * potentialCells.length)];
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