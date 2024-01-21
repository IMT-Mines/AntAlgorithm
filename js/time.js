class Time {

    constructor() {
        this.startTime = null;
        this.pausedTime = null;
        this.paused = false;
    }

    start() {
        this.startTime = new Date();
    }

    pause() {
        this.pausedTime = new Date();
        this.paused = true;
    }

    resume() {
        this.paused = false;
        this.startTime = new Date(this.startTime.getTime() + (new Date().getTime() - this.pausedTime.getTime()));
    }

    getElapsedTime() {
        return this.paused ? this.pausedTime - this.startTime : new Date() - this.startTime;
    }

    getFormattedElapsedTime() {
        const elapsedTime = this.getElapsedTime();
        const minutes = Math.floor(elapsedTime / 60000);
        const seconds = Math.floor((elapsedTime - minutes * 60000) / 1000);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}