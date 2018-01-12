export default class Model {
    constructor(conf) {
        // this.rows = 8;
        // this.cols = 8;
        this.width = 0;
        this.height = 0;
        this.rows = 0;
        this.cols = 0;
        this.blockRow = 1;
        this.blockCol = 1;
        this.flag = false;
        this.flagJump = 0;
        this.stopRunRight = true;
        this.stopRunLeft = true;
        this.dragBlock = [{x: 1, y: 1}];
        this.matrix = {x: 15, y: 8};
        this.serialNum = {row:1, col:1};
        this.body = [{x: 1, y: this.rows}];
        this.currentBlock = [{x: 1, y: 1}];
        this.floor = [{x: 0, y:0}];
        this.stepSpeed = 15;
        this.KEY = {
            'LEFT': 37,
            'RIGHT': 39,
            'UP': 38,
            'DOWN': 40
        };
    }
}