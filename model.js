import * as L from 'leaflet';

const inputCountry = document.querySelector('.form__input--country');
const inputDistance = document.querySelector('.form__input--distance');
const inputCost = document.querySelector('.form__input--cost');
const inputYear = document.querySelector('.form__input--date');
const form = document.querySelector('.form');

class Journey {
  #country = '';
  #cost = '';
  #distance = '';
  #year = '';
  #coords = '';

  constructor(country, cost, distance, year, coords = '') {
    this.#country = country;
    this.#distance = distance;
    this.#cost = cost;
    this.#year = year;
    this.#coords = coords;
  }

  renderJourney() {
    const html = `<li class="workout workout--cycling" data-id="1234567891">
    <h2 class="workout__title">${this.#country} w ${this.#year} r.</h2>
    <div class="workout__details">
      <span class="workout__icon">🛬</span>
      <span class="workout__value">${this.#distance}</span>
      <span class="workout__unit">km</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">💲</span>
      <span class="workout__value">${this.#cost}</span>
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
    form.addEventListener('submit', this.#getJourneyData.bind(this));
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
    this.#createMarker.bind(this)(coords);
    this.#showForm.bind(this)();
  }

  #showForm() {
    if (form.classList.contains('hidden')) form.classList.remove('hidden');
  }

  // #submitForm() {
  //   form.addEventListener('submit', function (e) {
  //     e.preventDefault();
  //     this.#getJourneyData();
  //   });
  // }

  #getJourneyData(event) {
    event.preventDefault();
    const country = inputCountry.value;
    const cost = inputCost.value;
    const distance = inputDistance.value;
    const year = inputYear.value;

    let journey;
    journey = new Journey(country, cost, distance, year, this.#clickCoords);
    journey.renderJourney();
  }

  #createMarker(coords) {
    L.marker(coords).addTo(this.#map);
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
