class Model {

    constructor() {
        this.clock = new Clock(this.tick.bind(this));
        this.time = new Time();
        this.grid = new Grid();
        this.clock.run();
    }

    bindDisplayChronometer(callBack) {
        this.updateChronometer = callBack;
    }

    bindDisplayCanvasPoint(callBack) {
        this.displayCanvasPoint = callBack;
    }

    tick(deltaTime) {
        this.time.increment(deltaTime);
        this.updateChronometer(this.time.getFormattedTime());
        this.displayCanvasPoint(Math.random() * 500, Math.random() * 500);
    }

    bindActionButton() {
        this.clock.setFps(60);
    }
}

class View {
    constructor(divId) {
        this.div;
        this.chronometer;
        this.canvas;
        this.initView(divId);
    }

    bindActionButton(callback) {
        this.bindActionButton = callback;
    }

    initView(divId) {
        this.div = document.getElementById(divId);
        this.chronometer = document.getElementById("chronometer");
        const canvas = document.getElementById('canvas');
        this.canvas = new Canvas(canvas.getContext('2d'));
        const actionButton = document.getElementById('action');
        actionButton.addEventListener('click', () => {
            this.bindActionButton();
        });
    }

    displayChronometer(value) {
        this.chronometer.innerHTML = value;
    }

    displayCanvasPoint(x, y) {
        this.canvas.drawPoint(x, y)
    }
}

class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.bindDisplayChronometer = this.bindDisplayChronometer.bind(this);
        this.model.bindDisplayChronometer(this.bindDisplayChronometer);

        this.bindDisplayCanvasPoint = this.bindDisplayCanvasPoint.bind(this);
        this.model.bindDisplayCanvasPoint(this.bindDisplayCanvasPoint);

        this.bindActionButton = this.bindActionButton.bind(this);
        this.view.bindActionButton(this.bindActionButton);
    }

    bindDisplayChronometer(value) {
        this.view.displayChronometer(value);
    }

    bindDisplayCanvasPoint(x, y) {
        this.view.displayCanvasPoint(x, y);
    }

    bindActionButton () {
        this.model.bindActionButton();
    }

}

const app = new Controller(new Model(), new View("app"));