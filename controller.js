import view from './view.js';
import * as model from './model.js';

(async function () {
  try {
    model.getPosition();
  } catch (err) {
    console.error(err);
  }
})();
console.log(model.state.currentPosition);

// view.loadMap();
