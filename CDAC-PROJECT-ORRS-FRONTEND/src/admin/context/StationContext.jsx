import { createContext, useContext, useState } from 'react';

const StationContext = createContext();

export const useStations = () => {
  const context = useContext(StationContext);
  if (!context) {
    throw new Error('useStations must be used within StationProvider');
  }
  return context;
};

export const StationProvider = ({ children }) => {
  const [stations, setStations] = useState([
    {
      stationId: 1,
      stationCode: 'NDLS',
      stationName: 'New Delhi',
      city: 'Delhi',
      state: 'Delhi',
      zone: 'Northern Railway',
      platforms: 16,
      status: 'Active'
    },
    {
      stationId: 2,
      stationCode: 'CSMT',
      stationName: 'Chhatrapati Shivaji Maharaj Terminus',
      city: 'Mumbai',
      state: 'Maharashtra',
      zone: 'Central Railway',
      platforms: 18,
      status: 'Active'
    },
    {
      stationId: 3,
      stationCode: 'BCT',
      stationName: 'Mumbai Central',
      city: 'Mumbai',
      state: 'Maharashtra',
      zone: 'Western Railway',
      platforms: 7,
      status: 'Active'
    },
    {
      stationId: 4,
      stationCode: 'HWH',
      stationName: 'Howrah Junction',
      city: 'Howrah',
      state: 'West Bengal',
      zone: 'Eastern Railway',
      platforms: 23,
      status: 'Active'
    },
    {
      stationId: 5,
      stationCode: 'MAS',
      stationName: 'Chennai Central',
      city: 'Chennai',
      state: 'Tamil Nadu',
      zone: 'Southern Railway',
      platforms: 12,
      status: 'Active'
    }
  ]);

  const addStation = (stationData) => {
    const newStation = {
      ...stationData,
      stationId: Math.max(...stations.map(s => s.stationId), 0) + 1
    };
    setStations([...stations, newStation]);
    return newStation;
  };

  const updateStation = (stationId, stationData) => {
    setStations(stations.map(s => 
      s.stationId === stationId ? { ...s, ...stationData } : s
    ));
  };

  const deleteStation = (stationId) => {
    setStations(stations.map(s => 
      s.stationId === stationId ? { ...s, status: 'Inactive' } : s
    ));
  };

  const getStationById = (stationId) => {
    return stations.find(s => s.stationId === stationId);
  };

  const value = {
    stations,
    addStation,
    updateStation,
    deleteStation,
    getStationById
  };

  return (
    <StationContext.Provider value={value}>
      {children}
    </StationContext.Provider>
  );
};
