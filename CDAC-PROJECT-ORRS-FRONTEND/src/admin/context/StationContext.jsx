import { createContext, useContext, useState, useEffect } from 'react';
import { adminService } from '../../services';
import toast from 'react-hot-toast';

const StationContext = createContext();

export const useStations = () => {
  const context = useContext(StationContext);
  if (!context) {
    throw new Error('useStations must be used within StationProvider');
  }
  return context;
};

export const StationProvider = ({ children }) => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch stations from backend on component mount
  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      setLoading(true);
      const response = await adminService.stations.getAllStations();
      if (response.data && response.data.status === 'SUCCESS') {
        setStations(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching stations:', error);
      toast.error('Failed to fetch stations');
    } finally {
      setLoading(false);
    }
  };

  const addStation = async (stationData) => {
    try {
      setLoading(true);
      const response = await adminService.stations.addStation(stationData);
      if (response.data && response.data.status === 'SUCCESS') {
        await fetchStations(); // Refresh the list
        return true;
      }
    } catch (error) {
      console.error('Error adding station:', error);
      toast.error(error.response?.data?.message || 'Failed to add station');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateStation = async (stationId, stationData) => {
    try {
      setLoading(true);
      const response = await adminService.stations.updateStation(stationId, stationData);
      if (response.data && response.data.status === 'SUCCESS') {
        await fetchStations(); // Refresh the list
        return true;
      }
    } catch (error) {
      console.error('Error updating station:', error);
      toast.error(error.response?.data?.message || 'Failed to update station');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteStation = async (stationId) => {
    try {
      setLoading(true);
      const response = await adminService.stations.deleteStation(stationId);
      if (response.data && response.data.status === 'SUCCESS') {
        await fetchStations(); // Refresh the list
        return true;
      }
    } catch (error) {
      console.error('Error deleting station:', error);
      toast.error(error.response?.data?.message || 'Failed to delete station');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateStationStatus = async (stationId, statusData) => {
    try {
      setLoading(true);
      const response = await adminService.stations.updateStationStatus(stationId, statusData);
      if (response.data && response.data.status === 'SUCCESS') {
        await fetchStations(); // Refresh the list
        return true;
      }
    } catch (error) {
      console.error('Error updating station status:', error);
      toast.error(error.response?.data?.message || 'Failed to update station status');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getStationById = (stationId) => {
    return stations.find(s => s.id === stationId);
  };

  const value = {
    stations,
    loading,
    addStation,
    updateStation,
    deleteStation,
    updateStationStatus,
    getStationById,
    fetchStations
  };

  return (
    <StationContext.Provider value={value}>
      {children}
    </StationContext.Provider>
  );
};
