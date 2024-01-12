class Model {
    constructor() {
        this.time = new Time();
    }

    bindDisplayChronometer(callBack) {
        this.updateChronometer = callBack;
    }

    run() {
        setInterval(() => {
            this.time.increment();
            this.updateChronometer(this.time.getFormattedTime());
        }, 1000);
    }
}

class View {
    constructor(divId) {
        this.div;
        this.chronometer;
        this.initView(divId);
    }

    initView(divId) {
        this.div = document.getElementById(divId);
        this.chronometer = document.getElementById("chronometer");
    }

    displayChronometer(value) {
        this.chronometer.innerHTML = value;
    }

}

class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.bindDisplayChronometer = this.bindDisplayChronometer.bind(this);
        this.model.bindDisplayChronometer(this.bindDisplayChronometer);

        this.model.run();
    }

    bindDisplayChronometer(value) {
        this.view.displayChronometer(value);
    }
}

const app = new Controller(new Model(), new View("app"));