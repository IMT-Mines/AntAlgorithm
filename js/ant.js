class Ant {

    transportCapacity = 10;
    history = [];
    isBackToStartCell = false;

    constructor() {
        this.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    }

    getColor() {
        return this.color;
    }

}
