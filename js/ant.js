class Ant {

    transport = 0;
    history = [];
    pathLength = 0;
    backToStartCell = false;
    x = 0;
    y = 0;

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
