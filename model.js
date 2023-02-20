import * as L from 'leaflet';

class App {
  #mapContainer = document.getElementById('map');
  #map = L.map(this.#mapContainer).setView([51.505, -0.09], 13);

  constructor() {
    this.#loadMap.bind(this)();
    this.#getCurrentPosition();
    console.log('test');
  }

  #getCurrentPosition() {
    navigator.geolocation.getCurrentPosition(position => position);
  }
  #loadMap() {
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.#map);
  }
}

const app = new App();
