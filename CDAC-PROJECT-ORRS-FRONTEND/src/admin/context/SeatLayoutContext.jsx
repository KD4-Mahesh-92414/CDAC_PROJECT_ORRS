import { createContext, useContext, useState, useEffect } from 'react';
import { adminService } from '../../services';
import toast from 'react-hot-toast';

const SeatLayoutContext = createContext();

export const useSeatLayouts = () => {
  const context = useContext(SeatLayoutContext);
  if (!context) {
    throw new Error('useSeatLayouts must be used within SeatLayoutProvider');
  }
  return context;
};

export const SeatLayoutProvider = ({ children }) => {
  const [seatLayouts, setSeatLayouts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSeatLayouts = async () => {
    try {
      setLoading(true);
      const response = await adminService.seatLayouts.getAllSeatLayouts();
      if (response.data && response.data.status === 'SUCCESS') {
        setSeatLayouts(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching seat layouts:', error);
      toast.error('Failed to fetch seat layouts');
    } finally {
      setLoading(false);
    }
  };

  const addSeatLayout = async (seatLayoutData) => {
    try {
      setLoading(true);
      const response = await adminService.seatLayouts.addSeatLayout(seatLayoutData);
      if (response.data && response.data.status === 'SUCCESS') {
        await fetchSeatLayouts();
        return true;
      }
      toast.error(response.data?.message || 'Failed to add seat layout');
      return false;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add seat layout');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateSeatLayout = async (seatLayoutId, seatLayoutData) => {
    try {
      setLoading(true);
      const response = await adminService.seatLayouts.updateSeatLayout(seatLayoutId, seatLayoutData);
      if (response.data && response.data.status === 'SUCCESS') {
        await fetchSeatLayouts();
        return true;
      }
      toast.error(response.data?.message || 'Failed to update seat layout');
      return false;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update seat layout');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteSeatLayout = async (seatLayoutId) => {
    try {
      setLoading(true);
      const response = await adminService.seatLayouts.deleteSeatLayout(seatLayoutId);
      if (response.data && response.data.status === 'SUCCESS') {
        await fetchSeatLayouts();
        return true;
      }
      toast.error(response.data?.message || 'Failed to delete seat layout');
      return false;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete seat layout');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getSeatLayoutById = (seatLayoutId) => {
    return seatLayouts.find(sl => sl.id === seatLayoutId);
  };

  const value = {
    seatLayouts,
    loading,
    addSeatLayout,
    updateSeatLayout,
    deleteSeatLayout,
    getSeatLayoutById,
    fetchSeatLayouts
  };

  return (
    <SeatLayoutContext.Provider value={value}>
      {children}
    </SeatLayoutContext.Provider>
  );
};