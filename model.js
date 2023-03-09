import * as view from './view.js';

export const state = {
  map: '',
  mapZoomLevel: 4,
  position: '',
  clickCoords: [],
  journeys: [],
  markers: [],
};

export class Journey {
  place = '';
  cost = '';
  distance = '';
  year = '';
  coords = '';
  id = (Date.now() + '').slice(-10);

  constructor(place, cost, distance, year, coords = '') {
    this.place = place;
    this.distance = distance;
    this.cost = cost;
    this.year = year;
    this.coords = coords;
  }
}

export const getCurrentPosition = function (handler) {
  navigator.geolocation.getCurrentPosition(handler, function () {
    alert(
      'Nie można ustalić Twojej pozycji. Powodem jest prawdopodobnie wyłączona usługa geolokalizacji w przeglądarce'
    );
  });
};

export const setLocalStorage = function () {
  const data = localStorage.setItem('journeys', JSON.stringify(state.journeys));
};

export const getLocalStorage = function () {
  const data = JSON.parse(localStorage.getItem('journeys'));
  if (!data) return;
  state.journeys = data;
};

const validInputYear = function (inputData) {
  return (
    isFinite(inputData) &&
    inputData.length === 4 &&
    (inputData.slice(0, 2) === '20' || inputData.slice(0, 2) === '19')
  );
};

const validInputNumber = function (inputNumber) {
  return isFinite(inputNumber);
};

const validateInputValues = function (obj) {
  console.log(obj);
  if (obj.year && !validInputYear(obj.year)) {
    alert('Rok: nieprawiłowa wartość');
    return;
  }
  if (obj.cost && !validInputNumber(obj.cost)) {
    alert('Rok: nieprawiłowa wartość');
    return;
  }
  if (obj.distance && !validInputNumber(obj.distance)) {
    alert('Dystans: nieprawiłowa wartość');
    return;
  }
};

const getInputValues = function () {
  const place = view.inputPlace.value;
  const cost = view.inputCost.value;
  const distance = view.inputDistance.value;
  const year = view.inputYear.value;
  return { place: place, cost: cost, distance: distance, year: year };
};

export const getJourney = function () {
  const input = getInputValues();
  validateInputValues(input);

  const journey = new Journey(
    input.place,
    +input.cost,
    +input.distance,
    +input.year,
    state.clickCoords
  );
  return journey;
};
