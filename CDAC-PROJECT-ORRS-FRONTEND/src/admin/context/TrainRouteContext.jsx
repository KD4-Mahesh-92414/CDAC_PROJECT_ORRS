import { createContext, useContext, useState, useEffect } from 'react';
import { adminService } from '../../services';
import toast from 'react-hot-toast';

const TrainRouteContext = createContext();

export const useTrainRoutes = () => {
  const context = useContext(TrainRouteContext);
  if (!context) {
    throw new Error('useTrainRoutes must be used within TrainRouteProvider');
  }
  return context;
};

export const TrainRouteProvider = ({ children }) => {
  const [trainRoutes, setTrainRoutes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch train routes from backend on component mount
  useEffect(() => {
    fetchTrainRoutes();
  }, []);

  const fetchTrainRoutes = async () => {
    try {
      setLoading(true);
      const response = await adminService.trainRoutes.getAllTrainRoutes();
      if (response.data && response.data.status === 'SUCCESS') {
        setTrainRoutes(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching train routes:', error);
      toast.error('Failed to fetch train routes');
    } finally {
      setLoading(false);
    }
  };

  const addTrainRoute = async (trainRouteData) => {
    try {
      setLoading(true);
      const response = await adminService.trainRoutes.addTrainRoute(trainRouteData);
      if (response.data && response.data.status === 'SUCCESS') {
        await fetchTrainRoutes(); // Refresh the list
        return true;
      }
    } catch (error) {
      console.error('Error adding train route:', error);
      toast.error(error.response?.data?.message || 'Failed to add train route');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateTrainRoute = async (trainRouteId, trainRouteData) => {
    try {
      setLoading(true);
      const response = await adminService.trainRoutes.updateTrainRoute(trainRouteId, trainRouteData);
      if (response.data && response.data.status === 'SUCCESS') {
        await fetchTrainRoutes(); // Refresh the list
        return true;
      }
    } catch (error) {
      console.error('Error updating train route:', error);
      toast.error(error.response?.data?.message || 'Failed to update train route');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteTrainRoute = async (trainRouteId) => {
    try {
      setLoading(true);
      const response = await adminService.trainRoutes.deleteTrainRoute(trainRouteId);
      if (response.data && response.data.status === 'SUCCESS') {
        await fetchTrainRoutes(); // Refresh the list
        return true;
      }
    } catch (error) {
      console.error('Error deleting train route:', error);
      toast.error(error.response?.data?.message || 'Failed to delete train route');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getTrainRouteById = (trainRouteId) => {
    return trainRoutes.find(tr => tr.id === trainRouteId);
  };

  const value = {
    trainRoutes,
    loading,
    addTrainRoute,
    updateTrainRoute,
    deleteTrainRoute,
    getTrainRouteById,
    fetchTrainRoutes
  };

  return (
    <TrainRouteContext.Provider value={value}>
      {children}
    </TrainRouteContext.Provider>
  );
};