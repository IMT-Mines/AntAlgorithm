class PriorityQueue {
    constructor() {
        this.heap = [];
    }

    getLeftChildIndex(parentIndex) {
        return 2 * parentIndex + 1;
    }
 
    getRightChildIndex(parentIndex) {
        return 2 * parentIndex + 2;
    }
 
    getParentIndex(childIndex) {
        return Math.floor((childIndex - 1) / 2);
    }
 
    hasLeftChild(index) {
        return this.getLeftChildIndex(index) < this.heap.length;
    }
 
    hasRightChild(index) {
        return this.getRightChildIndex(index) < this.heap.length;
    }

 
    hasParent(index) {
        return this.getParentIndex(index) >= 0;
    }

    priority(index) {
        return this.heap[index].priority;
    }

    leftChildPriority(index) {
        return this.priority(this.getLeftChildIndex(index));
    }

    rightChildPriority(index) {
        return this.priority(this.getRightChildIndex(index));
    }
 
    swap(indexOne, indexTwo) {
        const temp = this.heap[indexOne];
        this.heap[indexOne] = this.heap[indexTwo];
        this.heap[indexTwo] = temp;
    }

    remove() {
        if (this.heap.length === 0) {
            return null;
        }
        const data = this.heap[0];
        this.heap[0] = this.heap[this.heap.length - 1];
        this.heap.pop();
        this.heapifyDown();
        return data.cell;
    }
 
    add(cell, priority) {
        this.heap.push({cell, priority});
        this.heapifyUp();
    }
 
    heapifyUp() {
        let index = this.heap.length - 1;
        while (this.hasParent(index) && this.priority(this.getParentIndex(index)) > this.priority(index)) {
            this.swap(this.getParentIndex(index), index);
            index = this.getParentIndex(index);
        }
    }
 
    heapifyDown() {
        let index = 0;
        while (this.hasLeftChild(index)) {
            let smallerChildIndex = this.getLeftChildIndex(index);
            if (this.hasRightChild(index) && this.rightChildPriority(index)
                < this.leftChildPriority(index)) {
                smallerChildIndex = this.getRightChildIndex(index);
            }
            if (this.priority(index) < this.priority(smallerChildIndex)) {
                break;
            } else {
                this.swap(index, smallerChildIndex);
            }
            index = smallerChildIndex;
        }
    }

    isEmpty() {
        return this.heap.length === 0;
    }
}