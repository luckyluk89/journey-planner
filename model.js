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
  flagSource = '';
  id = (Date.now() + '').slice(-10);

  constructor(place, cost, distance, year, coords = '', flagSource) {
    this.place = place;
    this.distance = distance;
    this.cost = cost;
    this.year = year;
    this.coords = coords;
    this.flagSource = flagSource;
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

export const validateInputValues = function (obj) {
  if (obj.year && !validInputYear(obj.year)) {
    alert('Rok: nieprawiłowa wartość');
    return 0;
  }
  if (obj.cost && !validInputNumber(obj.cost)) {
    alert('Koszt: nieprawiłowa wartość');
    return 0;
  }
  if (obj.distance && !validInputNumber(obj.distance)) {
    alert('Dystans: nieprawiłowa wartość');
    return 0;
  }
  return 1;
};

export const getInputValues = function () {
  const place = view.inputPlace.value;
  const cost = view.inputCost.value;
  const distance = view.inputDistance.value;
  const year = view.inputYear.value;
  return { place: place, cost: cost, distance: distance, year: year };
};

export const getJourney = async function () {
  try {
    const input = getInputValues();
    validateInputValues(input);
    const flagSource = await getCountryFlag();
    console.log(flagSource);
    const journey = new Journey(
      input.place,
      +input.cost,
      +input.distance,
      +input.year,
      state.clickCoords,
      flagSource
    );
    return journey;
  } catch (err) {
    console.error(err);
  }
};

const getCountryCode = async function () {
  try {
    const coords = state.clickCoords;
    const { lat, lng } = coords;
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
    );
    const data = await response.json();
    const countryCode = data.countryCode;
    return countryCode;
  } catch (err) {
    console.error(err);
  }
};

const getCountryFlag = async function () {
  try {
    const countryCode = await getCountryCode();
    const response = await fetch(
      `https://restcountries.com/v3.1/alpha/${countryCode}`
    );
    const data = await response.json();
    const flag = data[0].flags.png;
    console.log(flag);
    return flag;
  } catch (err) {
    console.error(err);
  }
};
