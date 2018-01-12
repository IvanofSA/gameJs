import Controller from './modules/controller';
import Model from './modules/model';
import View from './modules/view';

let elem = document.getElementById('content');
console.log(elem);


let model = new Model(),
    view = new View({$elem: elem}),
    controller = new Controller(view, model);
    controller.init();






// let map = [[true, true, false, false, false],
//     [false, true, true, false, false],
//     [false, false, true, true, false],
//     [false, false, false, true, true],
//     [false, false, false, false, true]];
//
// let cuurentCoord = {x: 0, y: 0};
//
//
// function solve(map, miner, exit) {
//
//     let downMove = 'down';
//     let upMove = 'up';
//     let leftMove = 'left';
//     let rightMove = 'right';
//     let mapLength = map.length;
//
//     // map.forEach((item, i) => {
//     //     console.log(item);
//     //     console.log(item[0]);
//     // });
//
//
//     for (let i = 0; i < map.length; i++) {
//         let column = map[i];
//
//         switch (1 + 1) {
//             case 2:
//
//                 break;
//
//             case 3:
//
//                 break;
//
//             case 4:
//
//                 break;
//
//             case 4:
//
//                 break;
//             default:
//                 console.log('default');
//         }
//
//
//     }
//
//
//
//     console.log(cuurentCoord);
//
//     return [];
// }


// console.log(solve(map, {x: 0, y: 0}, {x: 4, y: 4}));