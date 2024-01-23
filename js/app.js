class Model {

    timeAccumulator = 0;

    constructor() {
        this.init();
    }

    init() {
        this.clock = new Clock(this.tick.bind(this));
        this.time = new Time();
        this.grid = new Grid(Options.SIZE, Options.FOOD_COUNT);
        this.antsManager = new AntsManager();
        this.antsManager.initAnts(this.grid.startCell, Options.ANTS_COUNT);
        this.history = [];
        if (this.updateActionButtonText)
            this.updateActionButtonText("Start");
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

    bindChangeGridSize(newSize) {
        Options.SIZE = newSize;
        this.init();
        this.updateCanvasCells(this.grid.getCells(), this.antsManager.ants);
    }

    bindChangeFood(newFood) {
        Options.FOOD_COUNT = newFood;
        this.init();
        this.updateCanvasCells(this.grid.getCells(), this.antsManager.ants);
    }

    bindChangeAnts(newAnts) {
        this.ANTS_COUNT = newAnts;
        this.init();
        this.updateCanvasCells(this.grid.getCells(), this.antsManager.ants);
    }

    tick(deltaTime) {
        this.timeAccumulator += deltaTime / 1000;

        if (this.timeAccumulator >= 1 / Options.CELL_PER_SECOND) {
            this.antsManager.moveAnts(this.grid);
            this.grid.updatePheromones(Options.PHEROMONE_EVAPORATION_RATE);
            this.updateHistory();
            this.timeAccumulator -= 1 / Options.CELL_PER_SECOND;
        }

        this.displayCanvasCells(this.grid.getCells(), this.antsManager.ants, deltaTime);
        this.updateChronometer(this.time.getFormattedElapsedTime());
    }

    updateHistory() {
        this.history.push({
            antsManager: this.antsManager.clone(),
            grid: this.grid.clone(),
        });
        if (this.history.length > Options.MAX_HISTORY_LENGTH)
            this.history.shift();
    }

    updateCanvasCells(cells, ants) {
        this.displayCanvasCells(cells, ants, 0);
    }

    bindBackwardButton() {
        if (this.history.length > 1) {
            const last = this.history.pop();
            this.grid = last.grid;
            this.time = last.time;
            this.antsManager = last.antsManager;
            this.updateChronometer(this.time.getFormattedElapsedTime());
            this.displayCanvasCells(this.grid.getCells(), this.antsManager.ants, 0);
        }
    }

    bindForwardButton() {
        if (!this.time.hasBeenStarted())
            this.time.start();
        this.tick(1000 / this.clock.fps * Options.CELL_PER_SECOND);
    }

    bindActionButton() {
        if (this.clock.isRunning()) {
            this.clock.stop();
            this.time.pause();
            this.updateActionButtonText("Resume");
        } else {
            if (this.time.isPaused()) {
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
        this.backwardButton;
        this.forwardButton;
        this.actionButton;
        this.gridSize;
        this.food;
        this.ants;
        this.initView();
    }

    bindBackwardButton(callback) {
        this.bindBackwardButton = callback;
    }

    bindForwardButton(callback) {
        this.bindForwardButton = callback;
    }

    bindActionButton(callback) {
        this.bindActionButton = callback;
    }

    bindChangeGridSize(callback) {
        this.bindChangeGridSize = callback;
    }

    bindChangeFood(callback) {
        this.bindChangeFood = callback;
    }

    bindChangeAnts(callback) {
        this.bindChangeAnts = callback;
    }

    initView() {
        this.canvas = new Canvas(document.getElementById('canvas').getContext('2d'));

        this.chronometer = document.getElementById("chronometer");

        this.backwardButton = document.getElementById('previous');
        this.backwardButton.addEventListener('click', () => {
            this.bindBackwardButton();
        });

        this.forwardButton = document.getElementById('next');
        this.forwardButton.addEventListener('click', () => {
            this.bindForwardButton();
        });

        this.actionButton = document.getElementById('action');
        this.actionButton.addEventListener('click', () => {
            this.bindActionButton();
        });

        this.gridSize = document.getElementById('gridSize');
        this.gridSize.addEventListener('change', () => {
            this.bindChangeGridSize();
        });

        this.food = document.getElementById('food');
        this.food.addEventListener('change', () => {
            this.bindChangeFood();
        });

        this.ants = document.getElementById('ants');
        this.ants.addEventListener('change', () => {
            this.bindChangeAnts();
        });

        this.slow = document.getElementById('slow');
        this.slow.addEventListener('click', () => {
            Options.CELL_PER_SECOND = 1;
        });

        this.medium = document.getElementById('normal');
        this.medium.addEventListener('click', () => {
            Options.CELL_PER_SECOND = 6;
        });

        this.fast = document.getElementById('fast');
        this.fast.addEventListener('click', () => {
            Options.CELL_PER_SECOND = 12;
        });

    }

    displayChronometer(value) {
        this.chronometer.innerHTML = value;
    }

    displayCanvasCells(cells, ants, deltaTime) {
        this.canvas.draw(cells, ants, deltaTime);
    }

    updateActionButtonText(text) {
        this.actionButton.innerText = text;
    }
}

class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.bindBackwardButton(this.bindBackwardButton.bind(this));
        this.view.bindForwardButton(this.bindForwardButton.bind(this));
        this.view.bindActionButton(this.bindActionButton.bind(this));
        this.view.bindChangeGridSize(this.bindChangeGridSize.bind(this));
        this.view.bindChangeFood(this.bindChangeFood.bind(this));
        this.view.bindChangeAnts(this.bindChangeAnts.bind(this));

        this.model.bindDisplayChronometer(this.bindDisplayChronometer.bind(this));
        this.model.bindDisplayCanvasCells(this.bindDisplayCanvasCells.bind(this));
        this.model.bindUpdateActionButtonText(this.bindUpdateActionButtonText.bind(this));

        this.model.updateCanvasCells(this.model.grid.cells, [], 0);
    }

    bindChangeGridSize() {
        this.model.bindChangeGridSize(this.view.gridSize.value);
    }

    bindChangeFood() {
        this.model.bindChangeFood(this.view.food.value);
    }

    bindChangeAnts() {
        this.model.bindChangeAnts(this.view.ants.value);
    }

    bindBackwardButton() {
        this.model.bindBackwardButton();
    }

    bindForwardButton() {
        this.model.bindForwardButton();
    }

    bindUpdateActionButtonText(text) {
        this.view.updateActionButtonText(text);
    }

    bindDisplayChronometer(value) {
        this.view.displayChronometer(value);
    }

    bindDisplayCanvasCells(cells, ants, deltaTime) {
        this.view.displayCanvasCells(cells, ants, deltaTime);
    }

    bindActionButton() {
        this.model.bindActionButton();
    }

}

class Options {

    static SIZE = 21;
    static FOOD_COUNT = 5;
    static ANTS_COUNT = 5;
    static PHEROMONE_EVAPORATION_RATE = 0.996;
    static MAX_HISTORY_LENGTH = 100;
    static CELL_PER_SECOND = 6;

}

// TODO: REMOVE IT (FOR TESTS ONLY)
RandomNumberGenerator.setSeed(10);

const app = new Controller(new Model(), new View());