import { useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';
import ConfirmDialog from '../components/ConfirmDialog';
import PrimaryButton from '../components/PrimaryButton';
import AdminInput from '../components/AdminInput';
import AdminSelect from '../components/AdminSelect';
import { useTrains } from '../context/TrainContext';
import toast from 'react-hot-toast';

export default function FareStructure() {
  const { trains } = useTrains();
  const [fares] = useState([
    {
      fareId: 1,
      trainId: 1,
      coachType: '3A',
      ratePerKm: 2.50,
      minFare: 50.00,
      isActive: true
    },
    {
      fareId: 2,
      trainId: 1,
      coachType: '2A',
      ratePerKm: 3.75,
      minFare: 75.00,
      isActive: true
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedFare, setSelectedFare] = useState(null);
  const [formData, setFormData] = useState({
    trainId: '',
    coachType: '',
    ratePerKm: '',
    minFare: '50.00',
    isActive: true
  });

  const getTrainName = (trainId) => {
    const train = trains.find(t => t.trainId === trainId);
    return train ? `${train.trainNumber} - ${train.trainName}` : 'N/A';
  };

  const columns = [
    { 
      key: 'trainId', 
      label: 'Train',
      render: (value) => getTrainName(value)
    },
    { 
      key: 'coachType', 
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
      render: (value) => `₹${value.toFixed(2)}`
    },
    { 
      key: 'minFare', 
      label: 'Minimum Fare',
      render: (value) => `₹${value.toFixed(2)}`
    },
    { 
      key: 'isActive', 
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ];

  const validateForm = () => {
    if (!formData.trainId) {
      toast.error('Please select a train');
      return false;
    }
    if (!formData.coachType) {
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
      coachType: '',
      ratePerKm: '',
      minFare: '50.00',
      isActive: true
    });
    setShowModal(true);
  };

  const handleEdit = (fare) => {
    setSelectedFare(fare);
    setFormData(fare);
    setShowModal(true);
  };

  const handleDelete = (fare) => {
    setSelectedFare(fare);
    setShowDeleteDialog(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      toast.success(selectedFare ? 'Fare rule updated successfully!' : 'Fare rule added successfully!');
      setShowModal(false);
    }
  };

  const confirmDelete = () => {
    toast.success('Fare rule deleted successfully!');
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

        <DataTable
          columns={columns}
          data={fares}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

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
                  ...trains.filter(t => t.trainActiveStatus === 'Active').map(train => ({
                    value: train.trainId,
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
                  name="coachType"
                  value={formData.coachType}
                  onChange={(e) => setFormData({...formData, coachType: e.target.value})}
                  required
                  options={[
                    { value: '', label: 'Select Coach Type' },
                    { value: 'SL', label: 'Sleeper (SL)' },
                    { value: '3A', label: 'AC 3 Tier (3A)' },
                    { value: '2A', label: 'AC 2 Tier (2A)' },
                    { value: '1A', label: 'AC First Class (1A)' },
                    { value: 'CC', label: 'Chair Car (CC)' },
                    { value: '2S', label: 'Second Sitting (2S)' }
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
                  label="Minimum Fare (₹)"
                  name="minFare"
                  type="number"
                  step="0.01"
                  value={formData.minFare}
                  onChange={(e) => setFormData({...formData, minFare: parseFloat(e.target.value)})}
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
