class Model {

    constructor() {
        this.init();
    }

    init() {
        this.clock = new Clock(this.tick.bind(this));
        this.time = new Time();
        this.grid = new Grid(Options.SIZE, Options.FOOD_COUNT);
        this.cellSize = Options.CANVAS_SIZE / Options.SIZE;
        this.showPheromones = false;
        this.antsManager = new AntsManager();
        this.antsManager.initAnts(this.grid, Options.ANTS_COUNT, this.cellSize);
        this.history = [];
        if (this.updateActionButtonText)
            this.updateActionButtonText("Start");
    }

    bindDisplayChronometer(callBack) {
        this.updateChronometer = callBack;
    }

    bindShowPheromones() {
        this.showPheromones = !this.showPheromones;
        console.log("showPheromones: " + this.showPheromones)
    }

    bindDisplayCanvasCells(callBack) {
        this.displayCanvasCells = callBack;
    }

    bindUpdateActionButtonText(callback) {
        this.updateActionButtonText = callback;
    }

    bindParameters(parameters) {
        this.antsManager.setDropParameter(parseFloat(parameters.pheromonesDrop));
        this.antsManager.setExplorationRate(parseFloat(parameters.explorationRate));
        this.antsManager.setAlpha(parseFloat(parameters.alpha));
        this.antsManager.setAlreadyVisitedMalus(parseFloat(parameters.alreadyVisitedMalus));
        if (Options.SIZE !== parseInt(parameters.gridSize) ||
            Options.FOOD_COUNT !== parseInt(parameters.food) ||
            Options.ANTS_COUNT !== parseInt(parameters.ants) ||
            Options.PHEROMONE_EVAPORATION_RATE !== parseFloat(parameters.pheromonesEvaporation)) {
            Options.SIZE = parseInt(parameters.gridSize);
            Options.FOOD_COUNT = parseInt(parameters.food);
            Options.ANTS_COUNT = parseInt(parameters.ants);
            Options.PHEROMONE_EVAPORATION_RATE = parseFloat(parameters.pheromonesEvaporation);
            this.init();
            this.updateCanvasCells(this.grid, this.antsManager.ants);
        }
    }

    tick(deltaTime) {
        for (const [ant, goal] of this.antsManager.ants) {
            ant.move(goal, deltaTime, this.cellSize);
            this.grid.updatePheromones(Options.PHEROMONE_EVAPORATION_RATE);
            if (this.antsManager.hasReachGoal(ant, this.cellSize)) {
                this.antsManager.getNextGoal(ant, this.grid);
                this.grid.updatePheromones(Options.PHEROMONE_EVAPORATION_RATE / this.antsManager.ants.size);
                this.updateHistory();
            }
        }
        // this.updateHistory();
        this.displayCanvasCells(this.grid, this.antsManager.ants, deltaTime);
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
        this.displayCanvasCells(this.grid, ants, 0);
    }

    bindBackwardButton() {
        if (this.history.length > 1) {
            const last = this.history.pop();
            this.grid = last.grid;
            this.time = last.time;
            this.antsManager = last.antsManager;
            for (const [ant, goal] of this.antsManager.ants) {
                ant.move(goal, 18, this.cellSize);
            }
            this.displayCanvasCells(this.grid, this.antsManager.ants, 0);
        }
    }

    bindForwardButton() {
        if (!this.time.hasBeenStarted())
            this.time.start();
        for (const [ant, goal] of this.antsManager.ants) {
            ant.move(goal, 1, this.cellSize);
            this.antsManager.getNextGoal(ant, this.grid);
        }
        this.displayCanvasCells(this.grid, this.antsManager.ants, 0);
        this.updateChronometer(this.time.getFormattedElapsedTime());
    }

    bindChangeSpeed(fps) {
        for (const [ant, goal] of this.antsManager.ants) {
            ant.SPEED = fps;
        }
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
        this.parameters;
        this.showPheromones;
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

    bindParameters(callback) {
        this.bindParameters = callback;
    }

    bindChangeSpeed(callback) {
        this.bindChangeSpeed = callback;
    }

    bindShowPheromones(callback) {
        this.bindShowPheromones = callback;
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

        this.showPheromones = document.getElementById('showPheromones');
        this.showPheromones.addEventListener('click', () => {
            this.bindShowPheromones();
            this.showPheromones.classList.toggle("active");
        });


        this.parameters = document.getElementById('form');
        this.parameters.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(this.parameters);
            const data = Object.fromEntries(formData.entries());
            this.bindParameters(data);
        });


        this.slow = document.getElementById('slow');
        this.slow.addEventListener('click', () => {
            this.bindChangeSpeed(15);
        });

        this.medium = document.getElementById('normal');
        this.medium.addEventListener('click', () => {
            this.bindChangeSpeed(40);
        });

        this.fast = document.getElementById('fast');
        this.fast.addEventListener('click', () => {
            this.bindChangeSpeed(100);
        });

        this.veryFast = document.getElementById('crazy');
        this.veryFast.addEventListener('click', () => {
            this.bindChangeSpeed(200);
        });
    }

    displayChronometer(value) {
        this.chronometer.innerHTML = value;
    }

    displayCanvasCells(grid, ants, deltaTime) {
        this.canvas.draw(grid, ants, deltaTime);
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
        this.view.bindParameters(this.bindParameters.bind(this));
        this.view.bindChangeSpeed(this.bindChangeSpeed.bind(this));
        this.view.bindShowPheromones(this.bindShowPheromones.bind(this));

        this.model.bindDisplayChronometer(this.bindDisplayChronometer.bind(this));
        this.model.bindDisplayCanvasCells(this.bindDisplayCanvasCells.bind(this));
        this.model.bindUpdateActionButtonText(this.bindUpdateActionButtonText.bind(this));

        this.view.canvas.loadAssets().then(() => {
            this.model.updateCanvasCells(this.model.grid, [], 0);
        });
    }

    bindShowPheromones() {
        this.model.bindShowPheromones();
    }

    bindChangeSpeed(fps) {
        this.model.bindChangeSpeed(fps);
    }

    bindParameters(parameters) {
        this.model.bindParameters(parameters);
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

    bindDisplayCanvasCells(grid, ants, deltaTime) {
        this.view.displayCanvasCells(grid, ants, deltaTime);
    }

    bindActionButton() {
        this.model.bindActionButton();
    }
}

class Options {
    static SIZE = 17;
    static FOOD_COUNT = 5;
    static ANTS_COUNT = 10;
    static PHEROMONE_EVAPORATION_RATE = 0.005;
    static MAX_HISTORY_LENGTH = 100;
    static CANVAS_SIZE = 500;
}

// TODO: REMOVE IT (FOR TESTS ONLY or not?)
RandomNumberGenerator.setSeed(14933);

const app = new Controller(new Model(), new View());