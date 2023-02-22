import * as L from 'leaflet';

export const state = {
  currentPosition: [],
};

export const geoLocate = function () {
  return new Promise(resolve => {
    navigator.geolocation.getCurrentPosition(position => {
      resolve(getPosition(position));
    });
  });
};

// export const geoLocate = async function () {
//   try {
//     return new Promise(resolve => {
//       navigator.geolocation.getCurrentPosition(position => {
//         resolve(getPosition(position));
//       });
//     });
//   } catch (err) {
//     console.error(err);
//   }
// };

export const getPosition = function (position) {
  const { latitude: lat, longitude: lng } = position.coords;
  state.currentPosition = [lat, lng];
};
