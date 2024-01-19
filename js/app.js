class Model {

    SIZE = 31;
    ANTS_COUNT = 3;
    PHEROMONE_EVAPORATION_RATE = 0.995;

    constructor() {
        this.clock = new Clock(this.tick.bind(this));
        this.time = new Time();
        this.grid = new Grid(this.SIZE, 1);
        this.antsManager = new AntsManager(this.grid);
        this.antsManager.initAnts(this.grid.startCell, this.ANTS_COUNT);
    }

    bindDisplayChronometer(callBack) {
        this.updateChronometer = callBack;
    }

    bindDisplayCanvasCells(callBack) {
        this.displayCanvasCells = callBack;
    }

    bindUpdateActionButtonText(callback) {
        this.updateActionButtonText = callback;
    }

    tick(deltaTime) {
        // this.updateChronometer(this.clock.actualFps);
        this.updateChronometer(this.time.getFormattedElapsedTime());

        // apply rules for ants
        this.antsManager.moveAnts(this.grid);
        this.grid.updatePheromones(this.PHEROMONE_EVAPORATION_RATE);


        this.displayCanvasCells(this.grid.getCells(), this.antsManager.ants);
    }

    bindActionButton() {
        if (this.clock.running) {
            this.clock.stop();
            this.time.pause();
            this.updateActionButtonText("Resume");
        } else {
            if (this.time.paused) {
                this.time.resume();
            } else {
                this.time.start();
            }
            this.updateActionButtonText("Pause");
            this.clock.start();
        }
    }
}

class View {
    constructor() {
        this.chronometer;
        this.canvas;
        this.actionButton;
        this.initView();
    }

    bindActionButton(callback) {
        this.bindActionButton = callback;
    }

    initView() {
        this.chronometer = document.getElementById("chronometer");
        this.canvas = new Canvas(document.getElementById('canvas').getContext('2d'));
        this.actionButton = document.getElementById('action');
        this.actionButton.addEventListener('click', () => {
            this.bindActionButton();
        });
    }

    displayChronometer(value) {
        this.chronometer.innerHTML = value;
    }

    displayCanvasCells(cells, ants) {
        this.canvas.draw(cells, ants);
    }

    updateActionButtonText(text) {
        this.actionButton.innerText = text;
    }
}

class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.bindDisplayChronometer = this.bindDisplayChronometer.bind(this);
        this.model.bindDisplayChronometer(this.bindDisplayChronometer);

        this.bindDisplayCanvasCells = this.bindDisplayCanvasCells.bind(this);
        this.model.bindDisplayCanvasCells(this.bindDisplayCanvasCells);

        this.bindActionButton = this.bindActionButton.bind(this);
        this.view.bindActionButton(this.bindActionButton);

        this.bindUpdateActionButtonText = this.bindUpdateActionButtonText.bind(this);
        this.model.bindUpdateActionButtonText(this.bindUpdateActionButtonText);
    }

    bindUpdateActionButtonText(text) {
        this.view.updateActionButtonText(text);
    }

    bindDisplayChronometer(value) {
        this.view.displayChronometer(value);
    }

    bindDisplayCanvasCells(cells, ants) {
        this.view.displayCanvasCells(cells, ants);
    }

    bindActionButton () {
        this.model.bindActionButton();
    }

}

const app = new Controller(new Model(), new View());