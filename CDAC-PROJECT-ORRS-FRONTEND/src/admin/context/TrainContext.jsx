import { createContext, useContext, useState, useEffect } from 'react';
import { adminService } from '../../services';
import toast from 'react-hot-toast';

const TrainContext = createContext();

export const useTrains = () => {
  const context = useContext(TrainContext);
  if (!context) {
    throw new Error('useTrains must be used within TrainProvider');
  }
  return context;
};

export const TrainProvider = ({ children }) => {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTrains = async () => {
    try {
      setLoading(true);
      const response = await adminService.trains.getAllTrains();
      if (response.data && response.data.status === 'SUCCESS') {
        setTrains(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching trains:', error);
      toast.error('Failed to fetch trains');
    } finally {
      setLoading(false);
    }
  };

  const addTrain = async (trainData) => {
    try {
      setLoading(true);
      const response = await adminService.trains.addTrain(trainData);
      if (response.data && response.data.status === 'SUCCESS') {
        await fetchTrains();
        return true;
      }
      toast.error(response.data?.message || 'Failed to add train');
      return false;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add train');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateTrain = async (trainId, trainData) => {
    try {
      setLoading(true);
      const response = await adminService.trains.updateTrain(trainId, trainData);
      if (response.data && response.data.status === 'SUCCESS') {
        await fetchTrains();
        return true;
      }
      toast.error(response.data?.message || 'Failed to update train');
      return false;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update train');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteTrain = async (trainId) => {
    try {
      setLoading(true);
      const response = await adminService.trains.deleteTrain(trainId);
      if (response.data && response.data.status === 'SUCCESS') {
        await fetchTrains();
        return true;
      }
      toast.error(response.data?.message || 'Failed to delete train');
      return false;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete train');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateTrainStatus = async (trainId, statusData) => {
    try {
      setLoading(true);
      const response = await adminService.trains.updateTrainStatus(trainId, statusData);
      if (response.data && response.data.status === 'SUCCESS') {
        await fetchTrains();
        return true;
      }
      toast.error(response.data?.message || 'Failed to update train status');
      return false;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update train status');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getTrainById = (trainId) => {
    return trains.find(t => t.id === trainId);
  };

  const value = {
    trains,
    loading,
    addTrain,
    updateTrain,
    deleteTrain,
    updateTrainStatus,
    getTrainById,
    fetchTrains
  };

  return (
    <TrainContext.Provider value={value}>
      {children}
    </TrainContext.Provider>
  );
};
