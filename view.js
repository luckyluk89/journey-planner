const mapContainer = document.getElementById('map');

export { mapContainer };

const onMapClick = function (e) {
  const { lat, lng } = e.latlng;
  const coords = [lat, lng];
  model.state.clickCoords = coords;
  showForm();
};

const showForm = function () {
  if (form.classList.contains('hidden')) form.classList.remove('hidden');
  inputPlace.focus();
};

const hideForm = function () {
  if (!form.classList.contains('hidden')) form.classList.add('hidden');
};

const loadMap = function (position) {
  const { latitude } = position.coords;
  const { longitude } = position.coords;

  const coords = [latitude, longitude];

  model.state.map = L.map(view.mapContainer).setView(
    coords,
    model.state.mapZoomLevel
  );
  L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(model.state.map);
  model.state.map.on('click', onMapClick);
  model.state.journeys.forEach(journey => {
    createMarker(journey, journey.id);
  });
};

const createMarker = function (journey, journeyId) {
  const marker = L.marker(journey.coords)
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

  marker.addTo(model.state.map);
  model.state.markers.push({ marker: marker, markerId: journeyId });
};
