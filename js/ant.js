class Ant {

    SPEED = 25;

    transport = 0;
    history = [];
    pathLength = 0;
    backToStartCell = false;
    x = 0;
    y = 0;

    move(goal, delaTime, cellSize) {
        const goalX = goal.col * cellSize;
        const goalY = goal.row * cellSize;
        const direction = Math.atan2(
            this.y - goalY,
            goalX - this.x
        );
        const dx = Math.cos(direction);
        const dy = Math.sin(direction) * -1;
        this.x += dx * this.SPEED / delaTime;
        this.y += dy * this.SPEED / delaTime;
    }

    getTransport() {
        return this.transport;
    }

    setTransport(transport) {
        this.transport = transport;
    }

    getHistory() {
        return this.history;
    }

    setHistory(history) {
        this.history = history;
    }

    isBackToStartCell() {
        return this.backToStartCell;
    }

    setBackToStartCell(backToStartCell) {
        this.backToStartCell = backToStartCell;
    }
}
