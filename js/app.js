class Model {

    constructor() {
        this.clock = new Clock(this.tick.bind(this));
        this.time = new Time();
        this.grid = new Grid(20);
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
        this.updateChronometer(this.time.getFormattedElapsedTime());
        this.displayCanvasCells(this.grid.getCells());
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

    displayCanvasCells(cells) {
        this.canvas.drawCells(cells);
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

    bindDisplayCanvasCells(x, y) {
        this.view.displayCanvasCells(x, y);
    }

    bindActionButton () {
        this.model.bindActionButton();
    }

}

const app = new Controller(new Model(), new View());