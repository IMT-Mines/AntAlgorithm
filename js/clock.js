class Clock {

    constructor(callBack) {
        this.fps = 0;
        this.lastTime = Date.now();
        this.deltaTime = 0;
        this.frameDuration = 1000 / this.fps;
        this.callBack = callBack;
    }

    setFps(fps) {
        this.fps = fps;
        this.frameDuration = 1000 / this.fps;
    }

    run() {
        this.now = Date.now();
        this.deltaTime = this.now - this.lastTime;
        if (this.deltaTime > this.frameDuration) {
            this.lastTime = this.now - (this.deltaTime % this.frameDuration);
            this.callBack(this.deltaTime);
        }
        requestAnimationFrame(this.run.bind(this));
    }
}