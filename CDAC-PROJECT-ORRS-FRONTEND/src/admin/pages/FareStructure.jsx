import { useState, useEffect } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';
import ConfirmDialog from '../components/ConfirmDialog';
import PrimaryButton from '../components/PrimaryButton';
import AdminInput from '../components/AdminInput';
import AdminSelect from '../components/AdminSelect';
import { adminService } from '../../services';
import toast from 'react-hot-toast';

export default function FareStructure() {
  const [trains, setTrains] = useState([]);
  const [fares, setFares] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFares();
    fetchTrains();
  }, []);

  const fetchFares = async () => {
    try {
      setLoading(true);
      const response = await adminService.fares.getAllFares();
      if (Array.isArray(response.data)) {
        setFares(response.data);
      } else if (response.data?.status === 'SUCCESS') {
        setFares(response.data.data || []);
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

  const fetchTrains = async () => {
    try {
      const response = await adminService.trains.getAllTrains();
      if (response.data?.status === 'SUCCESS') {
        setTrains(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch trains');
    }
  };

  const addFare = async (fareData) => {
    try {
      setLoading(true);
      const response = await adminService.fares.addFare(fareData);
      if (response.data?.status === 'SUCCESS') {
        await fetchFares();
        return true;
      }
      toast.error(response.data?.message || 'Failed to add fare');
      return false;
    } catch (error) {
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
      if (response.data?.status === 'SUCCESS') {
        await fetchFares();
        return true;
      }
      toast.error(response.data?.message || 'Failed to update fare');
      return false;
    } catch (error) {
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
      if (response.data?.status === 'SUCCESS') {
        await fetchFares();
        return true;
      }
      toast.error(response.data?.message || 'Failed to delete fare');
      return false;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete fare');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedFare, setSelectedFare] = useState(null);
  const [formData, setFormData] = useState({
    trainId: '',
    coachTypeId: '',
    ratePerKm: '',
    baseFare: '50.00',
    isActive: true
  });

  const getTrainName = (trainId) => {
    const train = trains.find(t => t.id === trainId);
    return train ? `${train.trainNumber} - ${train.trainName}` : 'N/A';
  };

  const columns = [
    { 
      key: 'trainId', 
      label: 'Train',
      render: (value) => getTrainName(value)
    },
    { 
      key: 'coachTypeCode', 
      label: 'Coach Type',
      render: (value) => (
        <span className="px-2 py-1 text-xs bg-violet-100 text-violet-800 rounded-full">
          {value}
        </span>
      )
    },
    { 
      key: 'ratePerKm', 
      label: 'Rate per KM',
      render: (value) => `₹${value}`
    },
    { 
      key: 'baseFare', 
      label: 'Base Fare',
      render: (value) => `₹${value}`
    },
    { 
      key: 'isActive', 
      label: 'Status',
      render: (value, row) => {
        const isActive = value === true || row.active === true;
        return (
          <span className={`px-2 py-1 text-xs rounded-full ${
            isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
        );
      }
    }
  ];

  const validateForm = () => {
    if (!formData.trainId) {
      toast.error('Please select a train');
      return false;
    }
    if (!formData.coachTypeId) {
      toast.error('Please select coach type');
      return false;
    }
    if (!formData.ratePerKm || formData.ratePerKm <= 0) {
      toast.error('Rate per KM must be greater than 0');
      return false;
    }
    return true;
  };

  const handleAdd = () => {
    setSelectedFare(null);
    setFormData({
      trainId: '',
      coachTypeId: '',
      ratePerKm: '',
      baseFare: '50.00',
      isActive: true
    });
    setShowModal(true);
  };

  const handleEdit = (fare) => {
    setSelectedFare(fare);
    const coachTypeMap = {
      'SL': 1, '3A': 2, '2A': 3, '1A': 4, 'CC': 5, '2S': 6
    };
    const activeStatus = fare.isActive ?? fare.active ?? true;
    setFormData({
      trainId: fare.trainId || '',
      coachTypeId: coachTypeMap[fare.coachTypeCode] || '',
      ratePerKm: fare.ratePerKm || '',
      baseFare: fare.baseFare || '50.00',
      isActive: Boolean(activeStatus)
    });
    setShowModal(true);
  };

  const handleDelete = (fare) => {
    setSelectedFare(fare);
    setShowDeleteDialog(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      trainId: formData.trainId,
      coachTypeId: formData.coachTypeId,
      ratePerKm: formData.ratePerKm,
      baseFare: formData.baseFare,
      active: formData.isActive
    };

    let success = false;
    if (selectedFare) {
      success = await updateFare(selectedFare.fareId || selectedFare.id, payload);
      if (success) {
        toast.success('Fare rule updated successfully!');
      }
    } else {
      success = await addFare(payload);
      if (success) {
        toast.success('Fare rule added successfully!');
      }
    }
    
    if (success) {
      setShowModal(false);
    }
  };

  const confirmDelete = async () => {
    const success = await deleteFare(selectedFare.fareId || selectedFare.id);
    if (success) {
      toast.success('Fare rule deleted successfully!');
    }
    setShowDeleteDialog(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fare Structure</h1>
            <p className="text-gray-600">Manage train fare rates by coach type</p>
          </div>
          <PrimaryButton onClick={handleAdd}>
            Add Fare Rule
          </PrimaryButton>
        </div>

        {!loading && fares.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No fare data available. Add some fare rules to get started.
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={fares}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
            <span className="ml-2 text-gray-600">Loading fares...</span>
          </div>
        )}

        <FormModal
          open={showModal}
          onClose={() => setShowModal(false)}
          title={selectedFare ? 'Edit Fare Rule' : 'Add Fare Rule'}
          onSubmit={handleSubmit}
        >
          <div className="space-y-6">
            {/* Train Selection */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Train Selection</h3>
              <AdminSelect
                label="Train"
                name="trainId"
                value={formData.trainId}
                onChange={(e) => setFormData({...formData, trainId: parseInt(e.target.value)})}
                required
                options={[
                  { value: '', label: 'Select Train' },
                  ...trains.filter(t => t.trainStatus === 'ACTIVE').map(train => ({
                    value: train.id,
                    label: `${train.trainNumber} - ${train.trainName}`
                  }))
                ]}
              />
            </div>

            {/* Fare Details */}
            <div className="border-t-2 border-violet-100 pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Fare Details</h3>
              <div className="grid grid-cols-2 gap-6">
                <AdminSelect
                  label="Coach Type"
                  name="coachTypeId"
                  value={formData.coachTypeId}
                  onChange={(e) => setFormData({...formData, coachTypeId: parseInt(e.target.value)})}
                  required
                  options={[
                    { value: '', label: 'Select Coach Type' },
                    { value: 1, label: 'Sleeper (SL)' },
                    { value: 2, label: 'AC 3 Tier (3A)' },
                    { value: 3, label: 'AC 2 Tier (2A)' },
                    { value: 4, label: 'AC First Class (1A)' },
                    { value: 5, label: 'Chair Car (CC)' },
                    { value: 6, label: 'Second Sitting (2S)' }
                  ]}
                />
                <AdminInput
                  label="Rate per KM (₹)"
                  name="ratePerKm"
                  type="number"
                  step="0.01"
                  value={formData.ratePerKm}
                  onChange={(e) => setFormData({...formData, ratePerKm: parseFloat(e.target.value)})}
                  required
                />
              </div>
            </div>

            {/* Additional Settings */}
            <div className="border-t-2 border-violet-100 pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Additional Settings</h3>
              <div className="grid grid-cols-2 gap-6">
                <AdminInput
                  label="Base Fare (₹)"
                  name="baseFare"
                  type="number"
                  step="0.01"
                  value={formData.baseFare}
                  onChange={(e) => setFormData({...formData, baseFare: parseFloat(e.target.value)})}
                />
                <div className="flex items-end pb-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm font-semibold text-gray-900">
                    Active
                  </label>
                </div>
              </div>
            </div>
          </div>
        </FormModal>

        <ConfirmDialog
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={confirmDelete}
          title="Delete Fare Rule"
          message="Are you sure you want to delete this fare rule?"
        />
      </div>
    </AdminLayout>
  );
}

