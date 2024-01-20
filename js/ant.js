class Ant {

    transport = 0;
    history = [];
    backToStartCell = false;
    x = 0;
    y = 0;

    constructor() {
        this.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    }

    getColor() {
        return this.color;
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
