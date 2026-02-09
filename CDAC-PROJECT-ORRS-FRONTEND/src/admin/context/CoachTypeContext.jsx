import { createContext, useContext, useState, useEffect } from 'react';
import { adminService } from '../../services';
import toast from 'react-hot-toast';

const CoachTypeContext = createContext();

export const useCoachTypes = () => {
  const context = useContext(CoachTypeContext);
  if (!context) {
    throw new Error('useCoachTypes must be used within CoachTypeProvider');
  }
  return context;
};

export const CoachTypeProvider = ({ children }) => {
  const [coachTypes, setCoachTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCoachTypes = async () => {
    try {
      setLoading(true);
      const response = await adminService.coachTypes.getAllCoachTypes();
      if (response.data && response.data.status === 'SUCCESS') {
        setCoachTypes(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching coach types:', error);
      toast.error('Failed to fetch coach types');
    } finally {
      setLoading(false);
    }
  };

  const addCoachType = async (coachTypeData) => {
    try {
      setLoading(true);
      const response = await adminService.coachTypes.addCoachType(coachTypeData);
      if (response.data && response.data.status === 'SUCCESS') {
        await fetchCoachTypes();
        return true;
      }
      toast.error(response.data?.message || 'Failed to add coach type');
      return false;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add coach type');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateCoachType = async (coachTypeId, coachTypeData) => {
    try {
      setLoading(true);
      const response = await adminService.coachTypes.updateCoachType(coachTypeId, coachTypeData);
      if (response.data && response.data.status === 'SUCCESS') {
        await fetchCoachTypes();
        return true;
      }
      toast.error(response.data?.message || 'Failed to update coach type');
      return false;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update coach type');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteCoachType = async (coachTypeId) => {
    try {
      setLoading(true);
      const response = await adminService.coachTypes.deleteCoachType(coachTypeId);
      if (response.data && response.data.status === 'SUCCESS') {
        await fetchCoachTypes();
        return true;
      }
      toast.error(response.data?.message || 'Failed to delete coach type');
      return false;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete coach type');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getCoachTypeById = (coachTypeId) => {
    return coachTypes.find(ct => ct.id === coachTypeId);
  };

  const value = {
    coachTypes,
    loading,
    addCoachType,
    updateCoachType,
    deleteCoachType,
    getCoachTypeById,
    fetchCoachTypes
  };

  return (
    <CoachTypeContext.Provider value={value}>
      {children}
    </CoachTypeContext.Provider>
  );
};