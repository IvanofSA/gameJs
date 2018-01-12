export default class View {
    constructor(conf) {
        this.$elem = conf.$elem;
        this.onTapMovement = null;
        // this.onClickReload = null;
    }

    addMatrix(matrix, width, height) {
        for (let i = 1; i <= matrix.y; i++) {
            for (let k = 1; k <= matrix.x; k++) {
                let div = document.createElement('div');
                div.classList.add('cell');
                div.setAttribute('data-row', i);
                div.setAttribute('data-column', k);
                div.style.width = width + 'px';
                div.style.height = height + 'px';
                this.$elem.appendChild(div);
            }
        }
        this.insert();
    }

    addColorCell(cell) {
        cell.classList.add('black');
    }

    drawMan(cell) {
        cell.classList.toggle('man');
        cell.classList.remove('dragBlock');

    }

    drawBlock(cell) {
        cell.classList.toggle('block');
    }
    drawDragBlock(cell) {
        cell.classList.toggle('dragBlock');
        cell.classList.remove('floor');
    }
    drawFloorBlock(cell) {
        cell.classList.remove('block');
        // cell.classList.toggle('floor');

        if(cell.classList.contains('dragBlock')) {
            cell.classList.remove('dragBlock');
        }

        cell.classList.toggle('floor');
    }

    insert() {
        window.addEventListener('keyup', this.onTapMovement);
    }
}