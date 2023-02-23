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

  //   renderJourney() {
  //     const html = `<li class="workout workout--cycling" data-id="${this.id}">
  //     <h2 class="workout__title">${this.place} w ${this.year} r.</h2>
  //     <div class="workout__details">
  //       <span class="workout__icon">✈️</span>
  //       <span class="workout__value">${this.distance}</span>
  //       <span class="workout__unit">km</span>
  //     </div>
  //     <div class="workout__details">
  //       <span class="workout__icon">💲</span>
  //       <span class="workout__value">${this.cost}</span>
  //       <span class="workout__unit">zł</span>
  //     </div>`;
  //     form.insertAdjacentHTML('afterend', html);
  //   }
}

class App {
  #mapContainer = document.getElementById('map');
  #map;
  #mapZoomLevel = 7;
  #clickCoords;
  #journeys = [];

  constructor() {
    // Get user's position
    this.#getCurrentPosition();
    form.addEventListener('submit', this.#createJourney.bind(this));
    containerWorkouts.addEventListener('click', this.#moveToMarker.bind(this));
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
      inputData.toString.length === 4 &&
      (inputData.toString().slice(0, 2) === '20' ||
        inputData.toString().slice(0, 2) === '19')
    );
  }

  #validInputNumber(inputNumber) {
    return isFinite(inputNumber);
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
  #clearInputFields() {
    inputPlace.value = '';
    inputDistance.value = '';
    inputCost.value = '';
    inputYear.value = '';
  }

  #validInputFields(year, cost, distance) {
    if (!this.#validInputYear(year)) {
      alert('Rok: nieprawiłowa wartość');
      return;
    }
    if (cost && !this.#validInputNumber(cost)) {
      alert('Koszt: nieprawiłowa wartość');
      return;
    }
    if (distance && !this.#validInputNumber(distance)) {
      alert('Dystans: nieprawiłowa wartość');
      return;
    }
  }

  #createJourney(event) {
    event.preventDefault();
    const place = inputPlace.value;
    const cost = +inputCost.value;
    const distance = +inputDistance.value;
    const year = +inputYear.value;
    // console.log(this.#validInputFields.bind(this)(year, cost, distance));
    console.log(this.#validInputYear(year));
    if (!this.#validInputFields.bind(this)(year, cost, distance)) return;

    const journey = new Journey(
      place,
      +cost,
      +distance,
      +year,
      this.#clickCoords
    );
    this.#renderJourney(journey);
    this.#createMarker.bind(this)(journey);
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
    </div>`;
    form.insertAdjacentHTML('afterend', html);
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

  #createMarker(journey) {
    L.marker(journey.coords)
      .addTo(this.#map)
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
  }
}

const app = new App();
