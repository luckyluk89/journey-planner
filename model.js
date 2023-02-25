import * as L from 'leaflet';

const inputPlace = document.querySelector('.form__input--place');
const inputDistance = document.querySelector('.form__input--distance');
const inputCost = document.querySelector('.form__input--cost');
const inputYear = document.querySelector('.form__input--date');
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');

class Journey {
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

class App {
  #mapContainer = document.getElementById('map');
  #map;
  #mapZoomLevel = 4;
  #clickCoords;
  #journeys = [];
  #markers = [];

  constructor() {
    // Get user's position
    this.#getCurrentPosition();
    this.#getLocalStorage.bind(this)();
    this.#renderJourneysFromStorage.bind(this)();
    form.addEventListener('submit', this.#createJourney.bind(this));
    containerWorkouts.addEventListener(
      'click',
      this.#journeysContClickHandler.bind(this)
    );
    // containerWorkouts.addEventListener('click', this.#trashBtnHandler);
  }

  #getCurrentPosition() {
    navigator.geolocation.getCurrentPosition(
      this.#loadMap.bind(this),
      function () {
        alert(
          'Nie można ustalić Twojej pozycji. Powodem jest prawdopodobnie wyłączona usługa geolokalizacji w przeglądarce'
        );
      }
    );
  }

  #onMapClick(e) {
    const { lat, lng } = e.latlng;
    const coords = [lat, lng];
    this.#clickCoords = coords;
    this.#showForm.bind(this)();
  }

  #showForm() {
    if (form.classList.contains('hidden')) form.classList.remove('hidden');
    inputPlace.focus();
  }

  #hideForm() {
    if (!form.classList.contains('hidden')) form.classList.add('hidden');
  }

  #validInputYear(inputData) {
    return (
      isFinite(inputData) &&
      inputData.length === 4 &&
      (inputData.slice(0, 2) === '20' || inputData.slice(0, 2) === '19')
    );
  }

  #validInputNumber(inputNumber) {
    return isFinite(inputNumber);
  }

  #journeysContClickHandler(e) {
    const parentElement = e.target.closest('.workout');
    if (e.target !== parentElement.querySelector('.fa'))
      return this.#moveToMarker.bind(this)(e);
    this.#trashClickHandler(parentElement);
  }

  #moveToMarker(e) {
    if (!this.#map) return;
    const selectedJourneyItem = e.target.closest('.workout');
    if (!selectedJourneyItem) return;
    const selectedJourney = this.#journeys.find(
      journey => journey.id === selectedJourneyItem.dataset.id
    );
    this.#map.setView(selectedJourney.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }

  #removeMarker(markerId) {
    const marker = this.#markers.find(
      marker => markerId === marker.markerId
    ).marker;
    this.#map.removeLayer(marker);
  }

  #trashClickHandler(parentElement) {
    const journeyIdToRemove = parentElement.dataset.id;
    const index = this.#journeys.findIndex(
      journey => journey.id === journeyIdToRemove
    );
    if (index < 0) return;
    this.#journeys.splice(index, 1);
    this.#removeElement.bind(this)(parentElement);
    this.#removeMarker.bind(this)(journeyIdToRemove);
    this.#setLocalStorage.bind(this)();
    this.#getLocalStorage.bind(this)();
  }

  #clearInputFields() {
    inputPlace.value = '';
    inputDistance.value = '';
    inputCost.value = '';
    inputYear.value = '';
  }

  #createJourney(event) {
    event.preventDefault();
    const place = inputPlace.value;
    const cost = inputCost.value;
    const distance = inputDistance.value;
    const year = inputYear.value;
    if (year && !this.#validInputYear(year)) {
      alert('Rok: nieprawiłowa wartość');
      return;
    }
    if (cost && !this.#validInputNumber(cost)) {
      alert('Rok: nieprawiłowa wartość');
      return;
    }
    if (distance && !this.#validInputNumber(distance)) {
      alert('Dystans: nieprawiłowa wartość');
      return;
    }

    const journey = new Journey(
      place,
      +cost,
      +distance,
      +year,
      this.#clickCoords
    );
    this.#renderJourney(journey);
    this.#createMarker.bind(this)(journey, journey.id);
    this.#hideForm.bind(this)();
    this.#clearInputFields();
    this.#journeys.push(journey);
    this.#setLocalStorage.bind(this)();
  }

  #renderJourney(journey) {
    const html = `<li class="workout workout--cycling" data-id="${journey.id}">
    <h2 class="workout__title">${journey.place} w ${journey.year} r.</h2>
    <div class="workout__details">
      <span class="workout__icon">✈️</span>
      <span class="workout__value">${journey.distance}</span>
      <span class="workout__unit">km</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">💲</span>
      <span class="workout__value">${journey.cost}</span>
      <span class="workout__unit">zł</span>
    </div>
    <div><i class="fa fa-trash-o" style="font-size:30px"></i></div>
    </li>`;

    containerWorkouts.insertAdjacentHTML('beforeend', html);
  }

  #renderJourneysFromStorage() {
    if (!this.#journeys) return;
    this.#journeys.forEach(journey => {
      const html = `<li class="workout workout--cycling" data-id="${journey.id}">
    <h2 class="workout__title">${journey.place} w ${journey.year} r.</h2>
    <div class="workout__details">
      <span class="workout__icon">✈️</span>
      <span class="workout__value">${journey.distance}</span>
      <span class="workout__unit">km</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">💲</span>
      <span class="workout__value">${journey.cost}</span>
      <span class="workout__unit">zł</span>
    </div>
    <div><i class="fa fa-trash-o" style="font-size:30px"></i></div>
    </li>`;

      containerWorkouts.insertAdjacentHTML('beforeend', html);
    });
  }

  #removeElement(parentElement) {
    parentElement.remove();
  }

  #setLocalStorage() {
    const data = localStorage.setItem(
      'journeys',
      JSON.stringify(this.#journeys)
    );
  }

  #getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('journeys'));
    if (!data) return;
    this.#journeys = data;
  }

  #createMarker(journey, journeyId) {
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

    marker.addTo(this.#map);
    this.#markers.push({ marker: marker, markerId: journeyId });
    // .openPopup();
  }

  #loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    const coords = [latitude, longitude];

    this.#map = L.map(this.#mapContainer).setView(coords, this.#mapZoomLevel);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);
    this.#map.on('click', this.#onMapClick.bind(this));
    this.#journeys.forEach(journey => {
      this.#createMarker.bind(this)(journey, journey.id);
    });
  }
}

const app = new App();
