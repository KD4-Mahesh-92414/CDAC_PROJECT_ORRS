import { createContext, useContext, useState, useEffect } from 'react';
import { adminService } from '../../services';
import toast from 'react-hot-toast';

const FareContext = createContext();

export const useFares = () => {
  const context = useContext(FareContext);
  if (!context) {
    throw new Error('useFares must be used within FareProvider');
  }
  return context;
};

export const FareProvider = ({ children }) => {
  const [fares, setFares] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch fares from backend on component mount
  useEffect(() => {
    fetchFares();
  }, []);

  const fetchFares = async () => {
    try {
      setLoading(true);
      const response = await adminService.fares.getAllFares();
      console.log('Fare API Response:', response);
      
      // Handle different response structures
      if (response.data) {
        if (response.data.status === 'SUCCESS') {
          setFares(response.data.data || []);
        } else if (Array.isArray(response.data)) {
          setFares(response.data);
        } else {
          setFares([]);
        }
      } else {
        setFares([]);
      }
    } catch (error) {
      console.error('Error fetching fares:', error);
      toast.error('Failed to fetch fares');
      setFares([]);
    } finally {
      setLoading(false);
    }
  };

  const addFare = async (fareData) => {
    try {
      setLoading(true);
      const response = await adminService.fares.addFare(fareData);
      if (response.data && response.data.status === 'SUCCESS') {
        await fetchFares(); // Refresh the list
        return true;
      }
    } catch (error) {
      console.error('Error adding fare:', error);
      toast.error(error.response?.data?.message || 'Failed to add fare');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateFare = async (fareId, fareData) => {
    try {
      setLoading(true);
      const response = await adminService.fares.updateFare(fareId, fareData);
      if (response.data && response.data.status === 'SUCCESS') {
        await fetchFares(); // Refresh the list
        return true;
      }
    } catch (error) {
      console.error('Error updating fare:', error);
      toast.error(error.response?.data?.message || 'Failed to update fare');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteFare = async (fareId) => {
    try {
      setLoading(true);
      const response = await adminService.fares.deleteFare(fareId);
      if (response.data && response.data.status === 'SUCCESS') {
        await fetchFares(); // Refresh the list
        return true;
      }
    } catch (error) {
      console.error('Error deleting fare:', error);
      toast.error(error.response?.data?.message || 'Failed to delete fare');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateFareStatus = async (fareId, statusData) => {
    try {
      setLoading(true);
      const response = await adminService.fares.updateFareStatus(fareId, statusData);
      if (response.data && response.data.status === 'SUCCESS') {
        await fetchFares(); // Refresh the list
        return true;
      }
    } catch (error) {
      console.error('Error updating fare status:', error);
      toast.error(error.response?.data?.message || 'Failed to update fare status');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getFareById = (fareId) => {
    return fares.find(f => f.fareId === fareId);
  };

  const value = {
    fares,
    loading,
    addFare,
    updateFare,
    deleteFare,
    updateFareStatus,
    getFareById,
    fetchFares
  };

  return (
    <FareContext.Provider value={value}>
      {children}
    </FareContext.Provider>
  );
};