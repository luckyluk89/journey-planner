import * as L from 'leaflet';
import * as model from './model.js';

class View {
  #mapContainer = document.getElementById('map');
  #map;
  #mapZoomLevel = 18;

  //   constructor() {
  //     // Get user's position
  //     this.#loadMap.bind(this)(model.state.currentPosition);
  //   }

  //

  //   #onMapClick(e) {
  //     const { lat, lng } = e.latlng;
  //     const coord = [lat, lng];
  //     console.log(coord);
  //     this.#createMarker.bind(this)(coord);
  //   }

  //   #showForm() {}

  //   #createMarker(coord) {
  //     L.marker(coord).addTo(this.#map);
  //   }

  loadMap() {
    this.#map = L.map(this.#mapContainer).setView(
      model.state.currentPosition,
      this.#mapZoomLevel
    );

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);
    // this.#map.on('click', this.#onMapClick.bind(this));
  }
}

// #getCurrentPosition() {
//     navigator.geolocation.getCurrentPosition(
//       this.#loadMap.bind(this),
//       function () {
//         alert(
//           'Nie można ustalić Twojej pozycji. Powodem jest prawdopodobnie wyłączona usługa geolokalizacji w przeglądarce'
//         );
//       }
//     );
//   }

export default new View();
