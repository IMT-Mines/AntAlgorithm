class AntsManager {

    constructor() {
        this.ants = new Map();
    }

    initAnts(cell, antNumber) {
        for (let i = 0; i < antNumber; i++) {
            const ant = new Ant();
            ant.x = cell.col;
            ant.y = cell.row;
            ant.getHistory().push(cell)
            this.ants.set(ant, cell);
        }
    }


    moveAnts(grid) {
        const EXPLORATION_RATE = 2;
        const ALPHA = 2;

        for (let ant of this.ants.keys()) {
            if (!ant.isBackToStartCell()) {
                const currentCell = this.ants.get(ant);
                const neighbours = grid.getNeighbours(currentCell);
                const probability = [];

                let sumDenominator = 0;

                for (let neighbour of neighbours) {
                    sumDenominator += EXPLORATION_RATE + neighbour.pheromone ** ALPHA;
                }

                for (let neighbour of neighbours) {
                    const numerator = EXPLORATION_RATE + neighbour.pheromone ** ALPHA;
                    const result = numerator / sumDenominator;

                    probability.push(result);
                }

                const chosenCell = this.selectCell(ant, neighbours, probability);

                this.ants.set(ant, chosenCell);
                ant.getHistory().push(chosenCell);

                if (chosenCell instanceof Food && chosenCell.foodQuantity > 0) {
                    ant.transport += 10;
                    grid.getCell(chosenCell.row, chosenCell.col).foodQuantity -= 10;
                    ant.setBackToStartCell(true);
                    grid.getShortestPath(chosenCell, ant);
                }
            } else {
                this.backToStartCell(ant);
            }
        }
    }

    selectCell(ant, cells, probabilities) {
        const ALREADY_VISITED_MALUS = 0.2;


        for (let cell of cells) {
            const history = ant.getHistory();
            for (let i = history.length - 1; i >= 0; i--) {
                if (history[i] === cell) {
                    probabilities[cells.indexOf(cell)] *= ALREADY_VISITED_MALUS;
                }
            }
        }

        const maxProbability = Math.max(...probabilities);
        const potentialCells = [];
        for (let i = 0; i < probabilities.length; i++) {
            if (probabilities[i] === maxProbability) {
                potentialCells.push(cells[i]);
            }
        }

        const finalCell = potentialCells[Math.floor(Math.random() * potentialCells.length)];
        if (!finalCell) {
            return cells[0];
        }
        return finalCell

    }

    backToStartCell(ant) {
        const cell = ant.getHistory().pop();
        if (!cell) return;
        this.ants.set(ant, cell);

        if (!(cell instanceof Start)) {
            // TODO Adapt quantity with length of path
            cell.pheromone += 1;
            cell.total += 1;
        } else {
            ant.getHistory().push(cell);
            ant.transport = 0;
            cell.foodQuantity += 10;
            ant.setBackToStartCell(false);
        }
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