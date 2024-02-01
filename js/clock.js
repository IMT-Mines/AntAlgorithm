class Clock {

    constructor(callBack) {
        this.fps = 60;
        this.lastTime = null;
        this.deltaTime = 0;
        this.frameDuration = 1000 / this.fps;
        this.callBack = callBack;
        this.running = false;
        this.shouldBeDestroyed = false;
    }

    start() {
        this.lastTime = performance.now();
        this.running = true;
        this.run();
    }

    destroy() {
        this.shouldBeDestroyed = true;
    }

    stop() {
        this.running = false;
    }

    run() {
        this.now = performance.now();
        this.deltaTime = this.now - this.lastTime;
        if (this.deltaTime > this.frameDuration) {
            this.lastTime = this.now - (this.deltaTime % this.frameDuration);
            this.callBack(this.deltaTime);
        }
        if (!this.shouldBeDestroyed)
            requestAnimationFrame(this.run.bind(this));
    }

    isRunning() {
        return this.running;
    }
}