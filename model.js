import * as L from 'leaflet';

class App {
  #mapContainer = document.getElementById('map');
  #map;
  #mapZoomLevel = 3;

  constructor() {
    // Get user's position
    this.#getCurrentPosition();
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
    const coord = [lat, lng];
    console.log(coord);
    this.#createMarker.bind(this)(coord);
  }

  #showForm() {}

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
