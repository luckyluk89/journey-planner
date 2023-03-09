export const state = {
  mapZoomLevel: 4,
  clickCoords: [],
  journeys: [],
  markers: [],
};

export class Journey {
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
