export class _Node{

    constructor(xStart, xEnd, zStart, zEnd) {
        this.xStart = xStart;
        this.xEnd = xEnd;
        this.zStart = zStart;
        this.zEnd = zEnd;
        this.left = null;
        this.right = null;
    }

    isLeaf = () => this.right === null;
}