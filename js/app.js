class Model {

    constructor() {
        this.init();
    }

    init() {
        RandomNumberGenerator.setSeed(Options.SEED);
        this.clock = new Clock(this.tick.bind(this));
        this.time = new Time();
        this.grid = new Grid(Options.SIZE, Options.FOOD_COUNT);
        this.cellSize = Options.CANVAS_SIZE / Options.SIZE;
        this.antsManager = new AntsManager();
        this.antsManager.initAnts(this.grid, Options.ANTS_COUNT, this.cellSize);
        this.history = [];
        if (this.updateActionButtonText)
            this.updateActionButtonText("Start");
    }

    tick(deltaTime) {
        if (this.clock.isRunning()) {
            for (const [ant, goal] of this.antsManager.ants) {
                for (let i = 0; i < Options.SPEED; i++) {
                    ant.move(goal, deltaTime, this.cellSize);
                    if (this.antsManager.hasReachGoal(ant, this.cellSize)) {
                        this.antsManager.getNextGoal(ant, this.grid);
                        this.grid.updatePheromones(Options.PHEROMONE_EVAPORATION_RATE / this.antsManager.ants.size);
                        this.updateHistory();
                    }
                }
            }
            // because of the IEEE 754 standard, we can't compare two floating point numbers so we use a threshold
            this.updateChronometer(this.time.getFormattedElapsedTime());
            if (this.grid.startCell.getFoodQuantity() >= this.grid.foodPlaced - 0.1) this.clock.stop();
        }
        // Allow to toggle the display of pheromones / debug despite the clock is stopped
        this.displayCanvasCells(this.grid, this.antsManager.ants, deltaTime);
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
        this.displayCanvasCells(this.grid, ants);
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

    bindDrawBackgroundAndObstacles(callback) {
        this.drawBackgroundAndObstacles = callback;
    }

    bindParameters(parameters) {
        this.antsManager.setDropParameter(parseFloat(parameters.pheromonesDrop));
        this.antsManager.setExplorationRate(parseFloat(parameters.explorationRate));
        this.antsManager.setAlpha(parseFloat(parameters.alpha));
        this.antsManager.setAlreadyVisitedMalus(parseFloat(parameters.alreadyVisitedMalus));
        Options.PHEROMONE_EVAPORATION_RATE = parseFloat(parameters.pheromonesEvaporation);

        if (Options.SIZE !== parseInt(parameters.gridSize) ||
            Options.FOOD_COUNT !== parseInt(parameters.food) ||
            Options.ANTS_COUNT !== parseInt(parameters.ants) ||
            parseInt(parameters.seed) === 0 || Options.SEED !== parseInt(parameters.seed)
        ) {
            this.clock.destroy();
            Options.SEED = parseInt(parameters.seed);
            if (Options.SEED === 0) {
                Options.SEED = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
            }

            Options.SIZE = parseInt(parameters.gridSize);
            Options.FOOD_COUNT = parseInt(parameters.food);
            Options.ANTS_COUNT = parseInt(parameters.ants);
            Options.PHEROMONE_EVAPORATION_RATE = parseFloat(parameters.pheromonesEvaporation);
            this.init();
            this.bindActionButton();
            this.updateChronometer(this.time.getFormattedElapsedTime());
            this.drawBackgroundAndObstacles(this.grid);
            this.updateCanvasCells(this.grid, this.antsManager.ants);
        }
    }

    bindBackwardButton() {
        if (this.history.length > 1) {
            const last = this.history.pop();
            this.grid = last.grid;
            this.antsManager = last.antsManager;
            for (const [ant, goal] of this.antsManager.ants) {
                ant.move(goal, 20, this.cellSize);
            }
            this.displayCanvasCells(this.grid, this.antsManager.ants);
        }
    }

    bindForwardButton() {
        if (!this.time.hasBeenStarted())
            this.time.start();
        if (this.clock.isRunning()) return;
        const previousSpeed = Options.SPEED;
        Options.SPEED = 1;
        this.clock.start();
        this.tick(5);
        this.clock.stop();
        Options.SPEED = previousSpeed;
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

    initView() {
        const background = document.getElementById('background').getContext('2d');
        const canvas = document.getElementById('canvas').getContext('2d');
        const obstacle = document.getElementById('obstacle').getContext('2d');
        this.canvas = new Canvas(background, canvas, obstacle);

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
            Options.DISPLAY_PHEROMONE = !Options.DISPLAY_PHEROMONE;
            this.showPheromones.classList.toggle("active");
        });

        this.showDebug = document.getElementById("showDebug");
        this.showDebug.addEventListener('click', () => {
            Options.DEBUG_PHEROMONE_VALUE = !Options.DEBUG_PHEROMONE_VALUE;
            this.showDebug.classList.toggle("active");
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
            Options.SPEED = 1;
        });

        this.medium = document.getElementById('normal');
        this.medium.addEventListener('click', () => {
            Options.SPEED = 2;
        });

        this.fast = document.getElementById('fast');
        this.fast.addEventListener('click', () => {
            Options.SPEED = 4;
        });

        this.veryFast = document.getElementById('crazy');
        this.veryFast.addEventListener('click', () => {
            Options.SPEED = 20;
        });
    }

    drawBackgroundAndObstacles(grid) {
        this.canvas.drawBackgroundAndObstacles(grid);
    }

    displayChronometer(value) {
        this.chronometer.innerHTML = value;
    }

    displayCanvasCells(grid, ants) {
        this.canvas.draw(grid, ants);
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

        this.model.bindDisplayChronometer(this.bindDisplayChronometer.bind(this));
        this.model.bindDisplayCanvasCells(this.bindDisplayCanvasCells.bind(this));
        this.model.bindUpdateActionButtonText(this.bindUpdateActionButtonText.bind(this));
        this.model.bindDrawBackgroundAndObstacles(this.bindDrawBackgroundAndObstacles.bind(this));

        this.view.canvas.loadAssets().then(() => {
            this.view.drawBackgroundAndObstacles(this.model.grid);
            this.model.updateCanvasCells(this.model.grid, []);
        });
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

    bindDisplayCanvasCells(grid, ants) {
        this.view.displayCanvasCells(grid, ants);
    }

    bindDrawBackgroundAndObstacles(grid) {
        this.view.drawBackgroundAndObstacles(grid);
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
    static MAX_HISTORY_LENGTH = 500;
    static CANVAS_SIZE = 500;
    static SEED = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    static DISPLAY_PHEROMONE = false;
    static DEBUG_PHEROMONE_VALUE = false;
    static SPEED = 2;
}

const app = new Controller(new Model(), new View());