class Ant {

    static SPEED = 40;

    constructor() {
        this.transportQuantity = 0;
        this.history = [];
        this.returnPathLength = 0;
        this.backToStartCell = false;
        this.foodCellTransport = undefined
        this.x = 0;
        this.y = 0;
    }

    move(goal, delaTime, cellSize) {
        const goalX = goal.col * cellSize;
        const goalY = goal.row * cellSize;
        const direction = Math.atan2(
            this.y - goalY,
            goalX - this.x
        );
        const dx = Math.cos(direction);
        const dy = Math.sin(direction) * -1;
        this.x += dx * Ant.SPEED / delaTime;
        this.y += dy * Ant.SPEED / delaTime;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    setX(x) {
        this.x = x;
    }

    setY(y) {
        this.y = y;
    }

    getReturnPathLength() {
        return this.returnPathLength;
    }

    setReturnPathLength(returnPathLength) {
        this.returnPathLength = returnPathLength;
    }

    setFoodCellTransport(foodCell) {
        this.foodCellTransport = foodCell;
    }

    getFoodCellTransport() {
        return this.foodCellTransport;
    }

    getTransportQuantity() {
        return this.transportQuantity;
    }

    setTransportQuantity(transportQuantity) {
        this.transportQuantity = transportQuantity;
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
