class Time {

    constructor() {
        this.time = 0;
    }

    getFormattedTime() {
        let minutes = Math.floor(this.time / 60);
        let seconds = Math.floor(this.time % 60);
        return `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
    }

    getTime() {
        return this.time;
    }

    setTime(time) {
        this.time = time;
    }

    increment(deltaTime) {
        this.time += deltaTime / 1000;
    }

}