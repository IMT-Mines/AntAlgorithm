class AntsManager {

    // map ant to cell


    constructor() {
        this.ants = new Map();
    }

    initAnts(cell, antNumber) {
        for (let i = 0; i < antNumber; i++) {
            const ant = new Ant();
            this.ants.set(ant, cell);
        }
    }


    moveAnts(grid) {
        for (let ant of this.ants.keys()) {
            const neighbours = grid.getNeighbours(this.ants.get(ant));

            for (let neighbour of neighbours) {


            }

            // stub
            const random = Math.floor(Math.random() * neighbours.length);
            const cell = neighbours[random];
            this.ants.set(ant, cell);
        }
    }

    getAntsMap() {
        return this.ants;
    }

}