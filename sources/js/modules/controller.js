export default class Controller {
    constructor(view, model) {
        this.model = model;
        this.view = view;
        this.interval = null;
        this.intervalJump = null;
    }

    onTapMovement(e) {
        if (e.keyCode == this.model.KEY.LEFT) {
            this.moveMan('left');
        } else if (e.keyCode == this.model.KEY.RIGHT) {
            this.moveMan('right');
        } else if (e.keyCode == this.model.KEY.UP) {
            this.moveMan('up');
        }
    }

    addPlayingField() {
        this.model.width = Math.floor(this.view.$elem.offsetWidth / this.model.matrix.x);
        this.model.height = Math.floor(this.view.$elem.offsetHeight / this.model.matrix.y);
        this.model.cols = Math.floor(this.view.$elem.offsetWidth / this.model.width);
        this.model.rows = Math.floor(this.view.$elem.offsetHeight / this.model.height);
        this.view.addMatrix(this.model.matrix, this.model.width, this.model.height);
    }

    getCellNode(row, col) {
        let cellAddress = (row - 1) * this.model.cols + col - 1;
        return this.view.$elem.querySelectorAll('.cell')[cellAddress];
    }

    serialNumber() {
        let cell = this.getCellNode(this.model.body[0].y, this.model.body[0].x);
        return {row: +cell.getAttribute('data-row'), col: +cell.getAttribute('data-column')};
    }

    randomInteger(min, max) {
        let rand = min - 0.5 + Math.random() * (max - min + 1);
        return Math.round(rand);
    }

    getDragBlock(row, col) {
        let cell = this.getCellNode(row, col);
        if (cell && cell.classList.contains('dragBlock')) {
            return cell;
        } else {
            return false;
        }
    }

    getFloor(row, col) {
        let cell = this.getCellNode(row, col);
        if (cell && cell.classList.contains('floor')) {
            return cell;
        } else {
            return false;
        }
    }

    getMan(row, col) {
        let cell = this.getCellNode(row, col);
        if (cell && cell.classList.contains('man')) {
            return true;
        } else {
            return false;
        }
    }

    setDragBlock(row, col) {
        let cell = this.getCellNode(row, col);
        this.view.drawDragBlock(cell);
    }

    setCellMan(row, col) {
        let cell = this.getCellNode(row, col);
        this.view.drawMan(cell);
    }

    setfloorBlock(row, col) {
        let cell = this.getCellNode(row, col);
        this.view.drawFloorBlock(cell);
    }

    setStartCordFallingblock() {
        this.model.currentBlock[0].x = this.randomInteger(1, 15);
        this.model.currentBlock[0].y = 1;
        this.setCellFallingblock(this.model.currentBlock[0].y, this.model.currentBlock[0].x);
        this.moveBlock();
    }

    setCellFallingblock(row, col) {
        let cell = this.getCellNode(row, col);
        this.view.drawBlock(cell);
    }

    // двжиение человека
    //toDO сделать возможность одного шага в прыжка (сейчас сколько угодно)
    moveMan(side) {
        switch (side) {
            case 'right':
                this.moveManRight();
                break;

            case 'left':
                this.moveManLeft();
                break;

            case 'up':
                this.moveManJump();
                break;

            default:
                console.log('default');
        }

    }

    moveManRight() {
        this.model.stopRunLeft = true;
        if (this.model.stopRunRight) {
            this.model.body.unshift({});

            if (this.model.serialNum.col < this.model.cols) {

                this.model.body[0].x = this.model.body[1].x + 1;
                this.model.body[0].y = this.model.body[1].y;

                if (!this.getFloor(this.model.body[0].y, this.model.body[0].x) && this.model.body[0].y < this.model.matrix.y) {
                    this.jumpDown();
                }
                if (this.getFloor(this.model.body[0].y, this.model.body[0].x) || this.getDragBlock(this.model.body[0].y, this.model.body[0].x)) {
                    this.dragBlock('right', this.model.body[0].y, this.model.body[0].x);
                    // this.model.body[0].x = this.model.body[1].x;
                }

            } else {
                this.model.body[0].x = this.model.cols;
                this.model.body[0].y = this.model.body[1].y;
            }
            this.renderingMan();
        }
    }

    moveManLeft() {
        if (this.model.stopRunLeft) {
            this.model.stopRunRight = true;
            this.model.body.unshift({});

            if (this.model.serialNum.col > 1) {
                this.model.body[0].x = this.model.body[1].x - 1;
                this.model.body[0].y = this.model.body[1].y;
                if (!this.getFloor(this.model.body[0].y, this.model.body[0].x) && this.model.body[0].y < this.model.matrix.y) {
                    this.jumpDown();
                }
                if (this.getFloor(this.model.body[0].y, this.model.body[0].x) || this.getDragBlock(this.model.body[0].y, this.model.body[0].x)) {
                    this.dragBlock('left', this.model.body[0].y, this.model.body[0].x);
                }
                //toDO убрать драг с блока при отходе в сторону
            } else {
                this.model.body[0].x = 1;
                this.model.body[0].y = this.model.body[1].y;
            }
            this.renderingMan();

        }
    }

    moveManJump() {
        if (!this.model.flag) {
            this.model.body.unshift({});
            this.model.flag = true;
            if (this.model.body[1].y > 1) {

                this.model.body[0].x = this.model.body[1].x;
                this.model.body[0].y = this.model.body[1].y - 1;

                let cell = this.getCellNode(this.model.dragBlock[0].y, this.model.dragBlock[0].x);

                if (!this.getFloor(this.model.body[0].y, this.model.body[0].x) && cell.classList.contains('dragBlock')) {
                    this.setfloorBlock(this.model.dragBlock[0].y, this.model.dragBlock[0].x);
                }

            } else {
                this.model.body[0].x = this.model.body[1].x;
                this.model.body[0].y = this.model.body[1].y;
            }
            this.renderingMan();
            this.jumpDown();
        }
    }

    jumpDown() {
        let that = this;
        this.intervalJump = setTimeout(function () {
            that.model.body.unshift({});
            that.model.body[0].x = that.model.body[1].x;
            that.model.body[0].y = that.model.body[1].y;
            if (that.model.body[0].y < that.model.matrix.y) {

                if (that.getFloor(that.model.body[0].y + 1, that.model.body[0].x)) {
                    that.renderingMan();
                    that.model.flag = false;
                    clearInterval(this.intervalJump);
                } else {
                    that.model.body[0].x = that.model.body[1].x;
                    that.model.body[0].y = that.model.body[1].y + 1;
                    that.renderingMan();
                    that.model.flag = false;

                }
            }
        }, 300);
    }

    renderingMan(side) {
        if (this.model.serialNum.col <= this.model.cols && this.model.serialNum.col >= 1) {
            this.model.serialNum = this.serialNumber();
            this.clearMan();
        }
        this.setCellMan(this.model.body[0].y, this.model.body[0].x);
    }

    clearMan() {
        this.setCellMan(this.model.body[1].y, this.model.body[1].x);
        this.model.body.pop();
    }

    clearDragBlock() {
        this.setDragBlock(this.model.dragBlock[1].y, this.model.dragBlock[1].x);
        this.model.dragBlock.pop();
    }

    dragBlock(side, currentRow, currentCol) {
        this.model.dragBlock.unshift({});
        this.model.dragBlock[1].x = currentCol;
        this.model.dragBlock[1].y = currentRow;
        this.model.dragBlock[0].x = this.model.dragBlock[1].x;
        this.model.dragBlock[0].y = this.model.dragBlock[1].y;
        this.setDragBlock(this.model.dragBlock[1].y, this.model.dragBlock[1].x);

        if (side === 'right') {
            this.model.dragBlock[0].x = this.model.dragBlock[1].x + 1;
            this.model.dragBlock[0].y = this.model.dragBlock[1].y;

            if (this.model.dragBlock[0].x >= this.model.matrix.x) {
                this.model.stopRunRight = false;
            }
            // this.model.dragBlock.unshift({});
            //
            // this.model.dragBlock[0].x = this.model.dragBlock[1].x + 1;
            // this.model.dragBlock[0].y = this.model.dragBlock[1].y;

        } else {
            this.model.dragBlock[0].x = this.model.dragBlock[1].x - 1;
            this.model.dragBlock[0].y = this.model.dragBlock[1].y;

            if (this.model.dragBlock[0].x <= 1) {
                this.model.stopRunLeft = false;
            }
            // this.model.dragBlock.unshift({});
            //
            // this.model.dragBlock[0].x = this.model.dragBlock[1].x + 1;
            // this.model.dragBlock[0].y = this.model.dragBlock[1].y;
        }
        this.setDragBlock(this.model.dragBlock[0].y, this.model.dragBlock[0].x);
        this.clearDragBlock();
    }

    // падение блока создание пола
    moveBlock() {
        let that = this;
        this.interval = setTimeout(function () {
            that.dropBlock();
        }, 150);
    }


    dropBlock() {
        let isCheckFieldMan = this.getMan(this.model.currentBlock[0].y, this.model.currentBlock[0].x);
        let isCheckFieldFloor = this.getFloor(this.model.currentBlock[0].y, this.model.currentBlock[0].x);
        this.model.currentBlock.unshift({});
        if (this.model.currentBlock[1].y < this.model.matrix.y) {
            if (isCheckFieldMan || isCheckFieldFloor) {
                this.processingMotion(isCheckFieldMan, isCheckFieldFloor);
            } else {
                this.model.currentBlock[0].x = this.model.currentBlock[1].x;
                this.model.currentBlock[0].y = this.model.currentBlock[1].y + 1;
                this.setCellFallingblock(this.model.currentBlock[0].y, this.model.currentBlock[0].x);
                this.setCellFallingblock(this.model.currentBlock[1].y, this.model.currentBlock[1].x);
                this.model.currentBlock.pop();
                this.moveBlock();
            }
        } else {
            if (isCheckFieldMan || isCheckFieldFloor) {
                this.processingMotion(isCheckFieldMan, isCheckFieldFloor);

            } else {
                this.isEndPlayground();
            }
        }

        // if (this.model.currentBlock[1].y < this.model.matrix.y) {
        //     this.model.currentBlock[0].x = this.model.currentBlock[1].x;
        //     this.model.currentBlock[0].y = this.model.currentBlock[1].y + 1;
        //     this.setCellFallingblock(this.model.currentBlock[0].y, this.model.currentBlock[0].x);
        //     this.moveBlock();
        //     this.clearBlock();
        //     // this.isEndPlayground();
        //
        // } else {
        //     this.isEndPlayground();
        //     this.addFloorBlock();
        // }
    }

    isEndPlayground() {

        this.model.currentBlock.shift();
        this.model.floor[0].x = this.model.currentBlock[0].x;
        this.model.floor[0].y = this.model.currentBlock[0].y;
        // this.setfloorBlock(this.model.floor[0].y, this.model.floor[0].x);
        // this.model.floor.unshift({});
        this.addFloorBlock();
        // this.setStartCordFallingblock();

    }

    processingMotion(man, floor) {
        if (man) {
            console.log('GameOver');
        } else {
            if (this.model.currentBlock[1].x >= 1) {
                this.model.floor[0].x = this.model.currentBlock[1].x;
                this.model.floor[0].y = this.model.currentBlock[1].y - 1;
                this.setfloorBlock(this.model.floor[0].y, this.model.floor[0].x);
                this.model.floor.unshift({});

                this.setStartCordFallingblock();
            }

        }
    }


    addFloorBlock() {
        // this.model.currentBlock.shift();
        // this.model.floor[0].x = this.model.currentBlock[0].x;
        // this.model.floor[0].y = this.model.currentBlock[0].y;
        this.setfloorBlock(this.model.floor[0].y, this.model.floor[0].x);
        this.model.floor.unshift({});

        // this.setStartCordFallingblock();
    }

    clearBlock() {
        this.setCellFallingblock(this.model.currentBlock[1].y, this.model.currentBlock[1].x);
        this.model.currentBlock.pop();
    }


    gamePlay() {
        let that = this;
        that.setCellMan(this.model.body[0].y, this.model.body[0].x);
        that.setStartCordFallingblock();
    }

    startGame() {
        this.model.body = [{x: 1, y: this.model.rows}];
        this.model.playscore = 0;
        this.gamePlay();
    }

    init() {
        this.view.onTapMovement = this.onTapMovement.bind(this);
        this.addPlayingField();
        this.startGame();
    }
}

// const result = arr.filter(el => el.x !== targetX || el.y !== targetY);