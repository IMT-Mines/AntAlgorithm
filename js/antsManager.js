class AntsManager {

    // map ant to cell


    constructor() {
        this.ants = new Map();
    }

    initAnts(cell, antNumber) {
        for (let i = 0; i < antNumber; i++) {
            const ant = new Ant();
            ant.history.push(cell);
            this.ants.set(ant, cell);
        }
    }


    moveAnts(grid) {
        const EXPLORATION_RATE = 0.2;
        const ALPHA = 1;

        for (let ant of this.ants.keys()) {

            if (!ant.isBackToStartCell) {


                const currentCell = this.ants.get(ant);
                const neighbours = grid.getNeighbours(currentCell);

                let sumDenominator = 0;

                for (let neighbour of neighbours) {
                    if (neighbour instanceof Start) continue;

                    sumDenominator += EXPLORATION_RATE + neighbour.pheromone ** ALPHA;
                }

                let probability = new Map();
                for (let neighbour of neighbours) {
                    if (neighbour instanceof Start) continue;

                    const numerator = EXPLORATION_RATE + neighbour.pheromone ** ALPHA;
                    const result = numerator / sumDenominator;

                    probability.set(neighbour, result);
                }

                const chosenCell = this.selectCell(Array.from(probability.keys()), Array.from(probability.values()));

                // Mise à jour de la position de la fourmi
                this.ants.set(ant, chosenCell);
                ant.history.push(chosenCell);

                // Gestion du cas où la fourmi est de retour à la cellule de départ
                if (chosenCell instanceof Food) {
                    ant.isBackToStartCell = true;

                }
            } else {
                this.backToStartCell(ant);
            }
        }
    }

    selectCell(cells, probabilities) {
        const choice = Math.random();
        let cumulativeProbability = 0;

        for (let i = 0; i < cells.length; i++) {
            cumulativeProbability += probabilities[i];
            if (choice <= cumulativeProbability) {
                return cells[i];
            }
        }
        return cells[cells.length - 1];
    }

    backToStartCell(ant) {
        const cell = ant.history[ant.history.length - 1];
        if (!cell) return;
        ant.history.pop();
        this.ants.set(ant, cell);

        if (!(cell instanceof Start)) {
            cell.pheromone += 1;
        } else {
            ant.isBackToStartCell = false;
        }
    }

    getAntsMap() {
        return this.ants;
    }

}