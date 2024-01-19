class Ant {

    transportCapacity = 10;
    history = [];
    backToStartCell = false;

    constructor() {
        this.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    }

    getColor() {
        return this.color;
    }

    getHistory() {
        return this.history;
    }

    isBackToStartCell() {
        return this.backToStartCell;
    }

    setBackToStartCell(backToStartCell) {
        this.backToStartCell = backToStartCell;
    }

}