import * as model from './model.js';
import * as view from './view.js';

const form = document.querySelector('.form');
const containerJourneys = document.querySelector('.journeys');
const resetButton = document.querySelector('.reset');

class App {
  constructor() {
    // Get user's position

    this.#openApp();
    form.addEventListener('submit', this.#createJourney.bind(this));
    containerJourneys.addEventListener(
      'click',
      this.#journeysContClickHandler.bind(this)
    );
    resetButton.addEventListener('click', this.#reset.bind(this));
  }

  #openApp() {
    model.getCurrentPosition(view.loadMap);
    model.getLocalStorage();
    view.toggleResetButton();
    view.renderJourneysFromStorage();
    this.#getFlagSource();
  }

  async #geocode() {
    try {
      const response = await fetch(
        'https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=50.88&longitude=12&localityLanguage=en'
      );
      const data = await response.json();
      const countryCode = data.countryCode;
      console.log(countryCode);
      return;
    } catch (err) {
      console.error(err);
    }
  }

  async #getFlagSource() {
    try {
      const response = await fetch('https://restcountries.com/v3.1/alpha/DE');
      const data = await response.json();
      const flag = data[0].flags.png;
      console.log(data);
      console.log(flag);
    } catch (err) {
      console.error(err);
    }
  }

  #journeysContClickHandler(e) {
    const parentElement = e.target.closest('.journey');
    if (!parentElement) return;
    if (e.target !== parentElement.querySelector('.fa'))
      return this.#moveToMarker.bind(this)(e);
    this.#trashClickHandler(parentElement);
  }
  #reset() {
    model.state.journeys.forEach(journey => {
      this.#removeMarker(journey.id);
    });
    containerJourneys.innerHTML = '';
    model.state.journeys = [];
    model.setLocalStorage();
    view.toggleResetButton();
  }

  #moveToMarker(e) {
    if (!model.state.map) return;
    const selectedJourneyItem = e.target.closest('.journey');
    if (!selectedJourneyItem) return;
    const selectedJourney = model.state.journeys.find(
      journey => journey.id === selectedJourneyItem.dataset.id
    );
    model.state.map.setView(selectedJourney.coords, model.state.mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }

  #removeMarker(markerId) {
    const marker = model.state.markers.find(
      marker => markerId === marker.markerId
    ).marker;
    model.state.map.removeLayer(marker);
  }

  #trashClickHandler(parentElement) {
    const journeyIdToRemove = parentElement.dataset.id;
    const index = model.state.journeys.findIndex(
      journey => journey.id === journeyIdToRemove
    );
    if (index < 0) return;
    model.state.journeys.splice(index, 1);
    this.#removeElement.bind(this)(parentElement);
    view.toggleResetButton();
    this.#removeMarker.bind(this)(journeyIdToRemove);
    model.setLocalStorage();
    model.getLocalStorage();
  }

  #createJourney(event) {
    event.preventDefault();
    const input = model.getInputValues();
    if (!model.validateInputValues(input)) return;
    const journey = model.getJourney();
    view.renderJourney(journey);
    view.createMarker(journey, journey.id);
    view.hideForm();
    view.clearInputFields();
    model.state.journeys.push(journey);
    model.setLocalStorage();
    view.toggleResetButton();
  }

  #removeElement(parentElement) {
    parentElement.remove();
  }
}
const app = new App();
