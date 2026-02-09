import { useState, useEffect } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';
import ConfirmDialog from '../components/ConfirmDialog';
import PrimaryButton from '../components/PrimaryButton';
import AdminInput from '../components/AdminInput';
import AdminSelect from '../components/AdminSelect';
import { adminService } from '../../services';
import { validateTrain } from '../validations';
import toast from 'react-hot-toast';

export default function TrainManagement() {
  const [trains, setTrains] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
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
    trainStatus: 'ACTIVE'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchTrains();
    fetchStations();
  }, []);

  const fetchTrains = async () => {
    try {
      setLoading(true);
      const response = await adminService.trains.getAllTrains();
      if (response.data?.status === 'SUCCESS') {
        setTrains(response.data.data || []);
      }
    } catch (error) {
      toast.error('Failed to fetch trains');
    } finally {
      setLoading(false);
    }
  };

  const fetchStations = async () => {
    try {
      const response = await adminService.stations.getAllStations();
      if (response.data?.status === 'SUCCESS') {
        setStations(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch stations');
    }
  };

  const getStationName = (stationId) => {
    const station = stations.find(s => s.id === stationId);
    return station ? station.stationName : 'N/A';
  };

  const columns = [
    { key: 'trainNumber', label: 'Train Number' },
    { key: 'trainName', label: 'Train Name' },
    { key: 'trainType', label: 'Type' },
    { 
      key: 'sourceStation', 
      label: 'Source',
      render: (value) => value || 'N/A'
    },
    { 
      key: 'destinationStation', 
      label: 'Destination',
      render: (value) => value || 'N/A'
    },
    { key: 'totalDistanceKm', label: 'Distance (km)' },
    { key: 'daysOfRun', label: 'Running Days' },
    { 
      key: 'trainStatus', 
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === 'ACTIVE' ? 'bg-green-100 text-green-800' :
          value === 'INACTIVE' ? 'bg-red-100 text-red-800' :
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
      trainStatus: 'ACTIVE'
    });
    setErrors({});
    setShowModal(true);
  };

  const handleEdit = (train) => {
    setSelectedTrain(train);
    setFormData({
      trainNumber: train.trainNumber || '',
      trainName: train.trainName || '',
      trainType: train.trainType || '',
      sourceStationId: train.sourceStationId || '',
      destinationStationId: train.destinationStationId || '',
      totalDistanceKm: train.totalDistanceKm || '',
      avgSpeed: train.avgSpeed || '',
      daysOfRun: train.daysOfRun || '',
      trainStatus: train.trainStatus || 'ACTIVE'
    });
    setErrors({});
    setShowModal(true);
  };

  const handleDelete = (train) => {
    setSelectedTrain(train);
    setShowDeleteDialog(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateTrain(formData);
    if (Object.keys(validationErrors).length > 0) {
      Object.values(validationErrors).forEach(error => toast.error(error));
      return;
    }

    try {
      if (selectedTrain) {
        const response = await adminService.trains.updateTrain(selectedTrain.id, formData);
        if (response.data?.status === 'SUCCESS') {
          toast.success('Train updated successfully!');
          fetchTrains();
          setShowModal(false);
          setErrors({});
        }
      } else {
        const response = await adminService.trains.addTrain(formData);
        if (response.data?.status === 'SUCCESS') {
          toast.success('Train added successfully!');
          fetchTrains();
          setShowModal(false);
          setErrors({});
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const confirmDelete = async () => {
    try {
      const response = await adminService.trains.deleteTrain(selectedTrain.id);
      if (response.data?.status === 'SUCCESS') {
        toast.success('Train deleted successfully!');
        fetchTrains();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
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
                  ...stations.filter(s => s.status === 'ACTIVE').map(station => ({
                    value: station.id,
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
                  ...stations.filter(s => s.status === 'ACTIVE').map(station => ({
                    value: station.id,
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
                label="Train Status"
                name="trainStatus"
                value={formData.trainStatus}
                onChange={(e) => setFormData({...formData, trainStatus: e.target.value})}
                options={[
                  { value: 'ACTIVE', label: 'Active' },
                  { value: 'INACTIVE', label: 'Inactive' },
                  { value: 'UNDER_MAINRENANCE', label: 'Under Maintenance' }
                ]}
              />
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