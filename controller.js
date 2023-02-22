import view from './view.js';
import * as model from './model.js';

// const controlLoadingMap = async function () {
//   try {
//     await model.geoLocate();
//     view.loadMap();
//   } catch (err) {
//     console.error(err);
//   }
// };
// controlLoadingMap();

const controlLoadingMap = async function () {
  try {
    await model.geoLocate();
    const map = new view();
  } catch (err) {
    console.error(err);
  }
};
controlLoadingMap();

// const init = async function () {
//   try {
//     await controlLoadingMap();
//   } catch (err) {
//     console.error(err);
//   }
// };

// init();

// const controlLoadMap = async function () {
//   try {
//     await model.geoLocate();
//   } catch (err) {
//     console.error(err);
//   }
// };

// controlLoadMap();

// console.log(model.state.currentPosition);

// view.loadMap();
