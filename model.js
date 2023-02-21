import * as L from 'leaflet';

export const state = {
  currentPosition: [],
};

export const geolocate = function () {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

export const getPosition = async function () {
  try {
    const pos = await geolocate();
    const { latitude: lat, longitude: lng } = pos.coords;
    state.currentPosition = [lat, lng];
    // console.log(state.currentPosition);
  } catch (err) {
    alert(err);
  }
};
