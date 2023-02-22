import * as L from 'leaflet';

const inputPlace = document.querySelector('.form__input--place');
const inputDistance = document.querySelector('.form__input--distance');
const inputCost = document.querySelector('.form__input--cost');
const inputYear = document.querySelector('.form__input--date');
const form = document.querySelector('.form');

class Journey {
  place = '';
  cost = '';
  distance = '';
  year = '';
  coords = '';

  constructor(place, cost, distance, year, coords = '') {
    this.place = place;
    this.distance = distance;
    this.cost = cost;
    this.year = year;
    this.coords = coords;
  }

  renderJourney() {
    const html = `<li class="workout workout--cycling" data-id="1234567891">
    <h2 class="workout__title">${this.place} w ${this.year} r.</h2>
    <div class="workout__details">
      <span class="workout__icon">✈️</span>
      <span class="workout__value">${this.distance}</span>
      <span class="workout__unit">km</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">💲</span>
      <span class="workout__value">${this.cost}</span>
      <span class="workout__unit">zł</span>
    </div>`;
    form.insertAdjacentHTML('afterend', html);
  }
}

class App {
  #mapContainer = document.getElementById('map');

  #map;
  #mapZoomLevel = 3;
  #clickCoords;

  constructor() {
    // Get user's position
    this.#getCurrentPosition();
    form.addEventListener('submit', this.#createJourney.bind(this));
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
  }

  #hideForm() {
    if (!form.classList.contains('hidden')) form.classList.add('hidden');
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

    const journey = new Journey(place, cost, distance, year, this.#clickCoords);
    journey.renderJourney();
    console.log(journey.coords);
    this.#createMarker.bind(this)(journey);
    this.#hideForm.bind(this)();
    this.#clearInputFields();
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
