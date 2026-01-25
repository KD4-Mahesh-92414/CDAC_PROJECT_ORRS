import { createContext, useContext, useState } from 'react';

const TrainContext = createContext();

export const useTrains = () => {
  const context = useContext(TrainContext);
  if (!context) {
    throw new Error('useTrains must be used within TrainProvider');
  }
  return context;
};

export const TrainProvider = ({ children }) => {
  const [trains, setTrains] = useState([
    {
      trainId: 1,
      trainNumber: '12951',
      trainName: 'Mumbai Rajdhani Express',
      trainType: 'Rajdhani',
      sourceStationId: 1,
      destinationStationId: 3,
      totalDistanceKm: 1384,
      avgSpeed: 85,
      daysOfRun: 'Daily',
      trainActiveStatus: 'Active',
      status: 'Running'
    },
    {
      trainId: 2,
      trainNumber: '12301',
      trainName: 'Howrah Rajdhani Express',
      trainType: 'Rajdhani',
      sourceStationId: 1,
      destinationStationId: 4,
      totalDistanceKm: 1441,
      avgSpeed: 82,
      daysOfRun: 'Daily',
      trainActiveStatus: 'Active',
      status: 'Running'
    },
    {
      trainId: 3,
      trainNumber: '12009',
      trainName: 'Shatabdi Express',
      trainType: 'Shatabdi',
      sourceStationId: 1,
      destinationStationId: 5,
      totalDistanceKm: 2180,
      avgSpeed: 75,
      daysOfRun: 'Mon-Fri',
      trainActiveStatus: 'Active',
      status: 'Running'
    },
    {
      trainId: 4,
      trainNumber: '12002',
      trainName: 'Bhopal Shatabdi',
      trainType: 'Shatabdi',
      sourceStationId: 1,
      destinationStationId: 2,
      totalDistanceKm: 707,
      avgSpeed: 90,
      daysOfRun: 'Daily',
      trainActiveStatus: 'Active',
      status: 'Running'
    },
    {
      trainId: 5,
      trainNumber: '12259',
      trainName: 'Duronto Express',
      trainType: 'Duronto',
      sourceStationId: 2,
      destinationStationId: 4,
      totalDistanceKm: 1968,
      avgSpeed: 78,
      daysOfRun: 'Tue-Thu-Sat',
      trainActiveStatus: 'Active',
      status: 'Running'
    }
  ]);

  const addTrain = (trainData) => {
    const newTrain = {
      ...trainData,
      trainId: Math.max(...trains.map(t => t.trainId), 0) + 1
    };
    setTrains([...trains, newTrain]);
    return newTrain;
  };

  const updateTrain = (trainId, trainData) => {
    setTrains(trains.map(t => 
      t.trainId === trainId ? { ...t, ...trainData } : t
    ));
  };

  const deleteTrain = (trainId) => {
    setTrains(trains.map(t => 
      t.trainId === trainId ? { ...t, trainActiveStatus: 'Inactive' } : t
    ));
  };

  const getTrainById = (trainId) => {
    return trains.find(t => t.trainId === trainId);
  };

  const value = {
    trains,
    addTrain,
    updateTrain,
    deleteTrain,
    getTrainById
  };

  return (
    <TrainContext.Provider value={value}>
      {children}
    </TrainContext.Provider>
  );
};
