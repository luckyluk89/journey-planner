import * as L from 'leaflet';
import * as model from './model.js';
export { mapContainer };

// Query selectors
////////////////////////////////////////////

const mapContainer = document.getElementById('map');
export const inputPlace = document.querySelector('.form__input--place');
export const inputDistance = document.querySelector('.form__input--distance');
export const inputCost = document.querySelector('.form__input--cost');
export const inputYear = document.querySelector('.form__input--date');
const form = document.querySelector('.form');
const containerJourneys = document.querySelector('.journeys');
const resetButton = document.querySelector('.reset');

// Form view
////////////////////////////////////////////

export const showForm = function () {
  if (form.classList.contains('hidden')) form.classList.remove('hidden');
  inputPlace.focus();
};

export const hideForm = function () {
  if (!form.classList.contains('hidden')) form.classList.add('hidden');
};

export const clearInputFields = function () {
  inputPlace.value = '';
  inputDistance.value = '';
  inputCost.value = '';
  inputYear.value = '';
};

// Map view
////////////////////////////////////////////

export const loadMap = function (position) {
  const { latitude, longitude } = position.coords;

  const coords = [latitude, longitude];

  model.state.map = L.map(mapContainer).setView(
    coords,
    model.state.mapZoomLevel
  );
  L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(model.state.map);
  model.state.map.on('click', onMapClick);
  model.state.journeys.forEach(journey => {
    createMarker(journey, journey.id);
  });
};
const onMapClick = function (e) {
  const { lat, lng } = e.latlng;
  const coords = [lat, lng];
  model.state.clickCoords = coords;
  showForm();
};

export const createMarker = function (journey, journeyId) {
  const marker = L.marker(journey.coords)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 75,
        autoClose: false,
        closeOnClick: false,
        className: `running-popup`,
      })
    )
    .setPopupContent(`✈️ ${journey.place} ${journey.year}`);

  marker.addTo(model.state.map);
  model.state.markers.push({ marker: marker, markerId: journeyId });
  console.log(model.state.clickCoords);
};

// Manipulating DOM
////////////////////////////////////////////
export const renderJourneysFromStorage = function () {
  if (!model.state.journeys) return;
  model.state.journeys.forEach(journey => {
    const html = generateJourneyMarkup(journey);
    containerJourneys.insertAdjacentHTML('beforeend', html);
  });
};

export const renderJourney = function (journey) {
  const html = generateJourneyMarkup(journey);
  containerJourneys.insertAdjacentHTML('beforeend', html);
};

export const generateJourneyMarkup = function (journey) {
  const html = `<li class="journey" data-id="${journey.id}">
  <h2 class="journey__title">${journey.place} w ${journey.year} r.</h2>
  <img class="journey-flag" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Bandera_de_Espa%C3%B1a.svg/1200px-Bandera_de_Espa%C3%B1a.svg.png">
  <div class="journey-summary">
  <div class="journey-details">  
<div class="journey-distance">
    <span class="journey__icon">✈️</span>
    <span class="journey__value">${journey.distance}</span>
    <span class="journey__unit">km</span>
  </div>
  <div class="journey-cost">
    <span class="journey__icon">💲</span>
    <span class="journey__value">${journey.cost}</span>
    <span class="journey__unit">zł</span>
  </div></div>
  <div class="trash"><i class="fa fa-trash-o" style="font-size: 2.2rem"></i></div></div>
  </li>`;
  return html;
};

export const toggleResetButton = function () {
  if (!(model.state.journeys.length === 0)) {
    resetButton.classList.remove('hidden');
  } else {
    resetButton.classList.add('hidden');
  }
};
