import { useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';
import ConfirmDialog from '../components/ConfirmDialog';
import PrimaryButton from '../components/PrimaryButton';
import AdminInput from '../components/AdminInput';
import AdminSelect from '../components/AdminSelect';
import { useTrains } from '../context/TrainContext';
import { useStations } from '../context/StationContext';
import { validateTrain } from '../validations';
import toast from 'react-hot-toast';

export default function TrainManagement() {
  const { trains, addTrain, updateTrain, deleteTrain } = useTrains();
  const { stations } = useStations();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [formData, setFormData] = useState({
    trainNumber: '',
    trainName: '',
    trainType: '',
    sourceStationId: '',
    destinationStationId: '',
    totalDistanceKm: '',
    avgSpeed: '',
    daysOfRun: '',
    trainActiveStatus: 'Active',
    status: 'Not Started'
  });
  const [errors, setErrors] = useState({});

  const getStationName = (stationId) => {
    const station = stations.find(s => s.stationId === stationId);
    return station ? station.stationName : 'N/A';
  };

  const columns = [
    { key: 'trainNumber', label: 'Train Number' },
    { key: 'trainName', label: 'Train Name' },
    { key: 'trainType', label: 'Type' },
    { 
      key: 'sourceStationId', 
      label: 'Source',
      render: (value) => getStationName(value)
    },
    { 
      key: 'destinationStationId', 
      label: 'Destination',
      render: (value) => getStationName(value)
    },
    { key: 'totalDistanceKm', label: 'Distance (km)' },
    { key: 'daysOfRun', label: 'Running Days' },
    { 
      key: 'trainActiveStatus', 
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === 'Active' ? 'bg-green-100 text-green-800' :
          value === 'Inactive' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {value}
        </span>
      )
    }
  ];



  const handleAdd = () => {
    setSelectedTrain(null);
    setFormData({
      trainNumber: '',
      trainName: '',
      trainType: '',
      sourceStationId: '',
      destinationStationId: '',
      totalDistanceKm: '',
      avgSpeed: '',
      daysOfRun: '',
      trainActiveStatus: 'Active',
      status: 'Not Started'
    });
    setErrors({});
    setShowModal(true);
  };

  const handleEdit = (train) => {
    setSelectedTrain(train);
    setFormData({
      trainNumber: train.trainNumber,
      trainName: train.trainName,
      trainType: train.trainType,
      sourceStationId: train.sourceStationId,
      destinationStationId: train.destinationStationId,
      totalDistanceKm: train.totalDistanceKm,
      avgSpeed: train.avgSpeed,
      daysOfRun: train.daysOfRun,
      trainActiveStatus: train.trainActiveStatus,
      status: train.status
    });
    setErrors({});
    setShowModal(true);
  };

  const handleDelete = (train) => {
    setSelectedTrain(train);
    setShowDeleteDialog(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateTrain(formData);
    if (Object.keys(validationErrors).length > 0) {
      Object.values(validationErrors).forEach(error => toast.error(error));
      return;
    }

    if (selectedTrain) {
      updateTrain(selectedTrain.trainId, formData);
      toast.success('Train updated successfully!');
    } else {
      addTrain(formData);
      toast.success('Train added successfully!');
    }
    
    setShowModal(false);
    setErrors({});
  };

  const confirmDelete = () => {
    deleteTrain(selectedTrain.trainId);
    toast.success('Train deleted successfully!');
    setShowDeleteDialog(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Train Management</h1>
            <p className="text-gray-600">Manage trains and their schedules</p>
          </div>
          <PrimaryButton onClick={handleAdd}>
            Add Train
          </PrimaryButton>
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          data={trains}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Add/Edit Modal */}
        <FormModal
          open={showModal}
          onClose={() => setShowModal(false)}
          title={selectedTrain ? 'Edit Train' : 'Add Train'}
          onSubmit={handleSubmit}
        >
          <div className="space-y-6">
            {/* Train Information */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Train Information</h3>
              <div className="grid grid-cols-2 gap-6">
                <AdminInput
                  label="Train Number"
                  name="trainNumber"
                  value={formData.trainNumber}
                  onChange={(e) => setFormData({...formData, trainNumber: e.target.value})}
                  error={errors.trainNumber}
                  required
                />
                <AdminInput
                  label="Train Name"
                  name="trainName"
                  value={formData.trainName}
                  onChange={(e) => setFormData({...formData, trainName: e.target.value})}
                  error={errors.trainName}
                  required
                />
              </div>
            </div>

            {/* Route Details */}
            <div className="border-t-2 border-violet-100 pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Route Details</h3>
              <div className="grid grid-cols-2 gap-6">
                <AdminSelect
                  label="Source Station"
                  name="sourceStationId"
                  value={formData.sourceStationId}
                  onChange={(e) => setFormData({...formData, sourceStationId: parseInt(e.target.value) || ''})}
                  error={errors.sourceStationId}
                  required
                  options={[
                    { value: '', label: 'Select Source Station' },
                    ...stations.filter(s => s.status === 'Active').map(station => ({
                      value: station.stationId,
                      label: `${station.stationName} (${station.stationCode})`
                    }))
                  ]}
                />
                <AdminSelect
                  label="Destination Station"
                  name="destinationStationId"
                  value={formData.destinationStationId}
                  onChange={(e) => setFormData({...formData, destinationStationId: parseInt(e.target.value) || ''})}
                  error={errors.destinationStationId}
                  required
                  options={[
                    { value: '', label: 'Select Destination Station' },
                    ...stations.filter(s => s.status === 'Active').map(station => ({
                      value: station.stationId,
                      label: `${station.stationName} (${station.stationCode})`
                    }))
                  ]}
                />
              </div>
            </div>

            {/* Train Specifications */}
            <div className="border-t-2 border-violet-100 pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Train Specifications</h3>
              <div className="grid grid-cols-2 gap-6">
                <AdminInput
                  label="Train Type"
                  name="trainType"
                  value={formData.trainType}
                  onChange={(e) => setFormData({...formData, trainType: e.target.value})}
                  placeholder="Express, Rajdhani, etc."
                />
                <AdminInput
                  label="Total Distance (km)"
                  name="totalDistanceKm"
                  type="number"
                  value={formData.totalDistanceKm}
                  onChange={(e) => setFormData({...formData, totalDistanceKm: parseInt(e.target.value) || ''})}
                  error={errors.totalDistanceKm}
                />
                <AdminInput
                  label="Average Speed (km/h)"
                  name="avgSpeed"
                  type="number"
                  value={formData.avgSpeed}
                  onChange={(e) => setFormData({...formData, avgSpeed: parseInt(e.target.value) || ''})}
                  error={errors.avgSpeed}
                />
                <AdminInput
                  label="Days of Run"
                  name="daysOfRun"
                  value={formData.daysOfRun}
                  onChange={(e) => setFormData({...formData, daysOfRun: e.target.value})}
                  placeholder="Daily, Mon-Wed-Fri, etc."
                />
              </div>
            </div>

            {/* Status Settings */}
            <div className="border-t-2 border-violet-100 pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Status Settings</h3>
              <div className="grid grid-cols-2 gap-6">
                <AdminSelect
                  label="Active Status"
                  name="trainActiveStatus"
                  value={formData.trainActiveStatus}
                  onChange={(e) => setFormData({...formData, trainActiveStatus: e.target.value})}
                  options={[
                    { value: 'Active', label: 'Active' },
                    { value: 'Inactive', label: 'Inactive' },
                    { value: 'Under Maintenance', label: 'Under Maintenance' }
                  ]}
                />
                <AdminSelect
                  label="Current Status"
                  name="status"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  options={[
                    { value: 'Running', label: 'Running' },
                    { value: 'Cancelled', label: 'Cancelled' },
                    { value: 'Not Started', label: 'Not Started' }
                  ]}
                />
              </div>
            </div>
          </div>
        </FormModal>

        {/* Delete Confirmation */}
        <ConfirmDialog
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={confirmDelete}
          title="Delete Train"
          message={`Are you sure you want to delete ${selectedTrain?.trainName}?`}
        />
      </div>
    </AdminLayout>
  );
}