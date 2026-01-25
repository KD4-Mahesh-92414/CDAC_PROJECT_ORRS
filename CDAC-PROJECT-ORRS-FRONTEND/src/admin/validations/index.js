export const validateStation = (data) => {
  const errors = {};

  if (!data.stationCode?.trim()) {
    errors.stationCode = 'Station code is required';
  } else if (data.stationCode.length > 10) {
    errors.stationCode = 'Station code must be 10 characters or less';
  }

  if (!data.stationName?.trim()) {
    errors.stationName = 'Station name is required';
  }

  if (data.platforms && (data.platforms < 1 || data.platforms > 50)) {
    errors.platforms = 'Platforms must be between 1 and 50';
  }

  return errors;
};

export const validateTrain = (data) => {
  const errors = {};

  if (!data.trainNumber?.trim()) {
    errors.trainNumber = 'Train number is required';
  } else if (!/^\d{5}$/.test(data.trainNumber)) {
    errors.trainNumber = 'Train number must be 5 digits';
  }

  if (!data.trainName?.trim()) {
    errors.trainName = 'Train name is required';
  }

  if (!data.sourceStationId) {
    errors.sourceStationId = 'Source station is required';
  }

  if (!data.destinationStationId) {
    errors.destinationStationId = 'Destination station is required';
  }

  if (data.sourceStationId && data.destinationStationId && 
      data.sourceStationId === data.destinationStationId) {
    errors.destinationStationId = 'Source and destination cannot be same';
  }

  if (data.totalDistanceKm && (data.totalDistanceKm < 1 || data.totalDistanceKm > 5000)) {
    errors.totalDistanceKm = 'Distance must be between 1 and 5000 km';
  }

  if (data.avgSpeed && (data.avgSpeed < 10 || data.avgSpeed > 200)) {
    errors.avgSpeed = 'Speed must be between 10 and 200 km/h';
  }

  return errors;
};
