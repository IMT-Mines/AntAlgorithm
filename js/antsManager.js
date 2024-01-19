class AntsManager {

    constructor() {
        this.ants = new Map();
    }

    initAnts(cell, antNumber) {
        for (let i = 0; i < antNumber; i++) {
            const ant = new Ant();
            ant.getHistory().push(cell)
            this.ants.set(ant, cell);
        }
    }


    moveAnts(grid) {
        const EXPLORATION_RATE = 0.2;
        const ALPHA = 1;

        for (let ant of this.ants.keys()) {

            if (!ant.isBackToStartCell()) {
                const currentCell = this.ants.get(ant);
                const neighbours = grid.getNeighbours(currentCell);
                const probability = [];

                let sumDenominator = 0;

                for (let neighbour of neighbours) {
                    if (neighbour instanceof Start) continue;
                    sumDenominator += EXPLORATION_RATE + neighbour.pheromone ** ALPHA;
                }

                for (let neighbour of neighbours) {
                    if (neighbour instanceof Start) {
                        probability.push(0);
                    }

                    const numerator = EXPLORATION_RATE + neighbour.pheromone ** ALPHA;
                    const result = numerator / sumDenominator;

                    probability.push(result);
                }

                const chosenCell = this.selectCell(ant, neighbours, probability);

                this.ants.set(ant, chosenCell);
                ant.getHistory().push(chosenCell);

                if (chosenCell instanceof Food) {
                    ant.setBackToStartCell(true);
                }
            } else {
                this.backToStartCell(ant);
            }
        }
    }

    selectCell(ant, cells, probabilities) {
        const isProbabilityEquivalent = probabilities.length > 1 && probabilities.every(probability => probability === probabilities[0]);
        if (isProbabilityEquivalent) {
            for (let cell of cells) {
                const history = ant.getHistory();
                for (let i = history.length - 1; i >= 0; i--) {
                    if (history[i] === cell) {
                        probabilities[cells.indexOf(cell)] *= 0.5;
                    }
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
        console.log(probabilities)
        console.log("Cells", cells)
        console.log("potentialCells", potentialCells);
        console.log("maxProbability", maxProbability);

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
            cell.pheromone += 1;
        } else {
            ant.setBackToStartCell(false);
        }
    }
}