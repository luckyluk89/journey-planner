import * as L from 'leaflet';

class App {
  #mapContainer = document.getElementById('map');
  #map = L.map(this.#mapContainer).setView([51.505, -0.09], 13);
  // #map;
  #position;

  constructor() {
    this.#loadMap.bind(this)();
    this.#getCurrentPosition();
  }

  #getCurrentPosition() {
    const position = navigator.geolocation.getCurrentPosition(position => {
      position;
      console.log(position);
    });
  }
  #loadMap() {
    // const coord = this.#getCurrentPosition;

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.#map);
  }
}

const app = new App();
