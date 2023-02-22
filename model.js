import * as L from 'leaflet';

const inputCountry = document.querySelector('.form__input--country');
const inputDistance = document.querySelector('.form__input--distance');
const inputCost = document.querySelector('.form__input--cost');
const inputYear = document.querySelector('.form__input--date');

class Journey {
  #country = '';
  #cost = '';
  #distance = '';
  #year = '';
  #coords = '';

  constructor(country, distance, cost, year, coords = '') {
    this.#country = country;
    this.#distance = distance;
    this.#coords = coords;
    this.#cost = cost;
    this.#year = year;
  }
}

class App {
  #mapContainer = document.getElementById('map');
  #form = document.querySelector('.form');
  #map;
  #mapZoomLevel = 3;
  #clickCoords;

  constructor() {
    // Get user's position
    this.#getCurrentPosition();
    this.#form.addEventListener('submit', this.#getJourneyData);
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
    console.log(coords);
    this.#createMarker.bind(this)(coords);
    this.#showForm.bind(this)();
  }

  #showForm() {
    if (this.#form.classList.contains('hidden'))
      this.#form.classList.remove('hidden');
  }

  // #submitForm() {
  //   this.#form.addEventListener('submit', function (e) {
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
    journey = new Journey(country, cost, distance, year);
    console.log(journey);
  }

  #createMarker(coord) {
    L.marker(coord).addTo(this.#map);
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
