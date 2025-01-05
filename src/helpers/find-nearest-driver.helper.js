import haversine from 'haversine-distance';

// Masofani hisoblaydigan funksiya
const calculateDistance = (clientCoords, driverCoords) => {
  const client = { lat: clientCoords.lat, lon: clientCoords.lon };
  const driver = { lat: driverCoords.lat, lon: driverCoords.lon };
  return haversine(client, driver); // Natija metrda
};

// Haydovchilar ro'yxati

// const drivers = [
//   { id: 1, lat: 41.311081, lon: 69.240562 }, // Tashkent
//   { id: 2, lat: 40.9983, lon: 71.67257 }, // Namangan
//   { id: 3, lat: 39.6543, lon: 66.9753 }, // Samarkand
// ];

// // Mijoz koordinatalari

// const clientCoords = { lat: 41.32003, lon: 69.2949 }; // Tashkent (Sharqiy)

export const findNearestDriver = (clientCoords, drivers) => {
  let nearestDriver = null;
  let minDistance = Infinity;

  drivers.forEach((driver) => {
    const distance = calculateDistance(clientCoords, driver);
    if (distance < minDistance) {
      minDistance = distance;
      nearestDriver = driver;
    }
  });

  return { nearestDriver, distance: minDistance };
};

const result = findNearestDriver(clientCoords, drivers);

console.log('Eng yaqin haydovchi:', result.nearestDriver);
console.log('Masofa (m):', result.distance);
