import { EyeIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import AdminLayout from '../layouts/AdminLayout';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';
import ConfirmDialog from '../components/ConfirmDialog';
import PrimaryButton from '../components/PrimaryButton';
import TrainRouteForm from '../components/TrainRouteForm';
import { useTrains } from '../context/TrainContext';
import { useStations } from '../context/StationContext';
import { useTrainRoutes } from '../context/TrainRouteContext';
import toast from 'react-hot-toast';

export default function TrainRouteListPage() {
  const navigate = useNavigate();
  const { trains, fetchTrains } = useTrains();
  const { stations, fetchStations } = useStations();
  const { trainRoutes, addTrainRoute, updateTrainRoute, deleteTrainRoute, fetchTrainRoutes } = useTrainRoutes();

  useEffect(() => {
    fetchTrainRoutes();
    fetchTrains();
    fetchStations();
  }, []);
  
  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [formData, setFormData] = useState({
    trainId: '',
    stationId: '',
    sequenceNo: '',
    arrivalTime: '',
    departureTime: '',
    haltMinutes: '',
    distanceFromSource: '',
    dayNumber: 1,
    isMajorStation: false,
    stopType: 'REGULAR'
  });

  const getTrainName = (trainId) => {
    const train = trains.find(t => t.id === trainId);
    return train ? `${train.trainNumber} - ${train.trainName}` : 'N/A';
  };

  const getStationName = (stationId) => {
    const station = stations.find(s => s.id === stationId);
    return station ? `${station.stationCode} - ${station.stationName}` : 'N/A';
  };

  const columns = [
    { 
      key: 'trainId', 
      label: 'Train',
      render: (value) => getTrainName(value)
    },
    { 
      key: 'stationId', 
      label: 'Station',
      render: (value) => getStationName(value)
    },
    { key: 'sequenceNo', label: 'Sequence' },
    { key: 'arrivalTime', label: 'Arrival' },
    { key: 'departureTime', label: 'Departure' },
    { 
      key: 'distanceFromSource', 
      label: 'Distance (KM)',
      render: (value) => value ? `${value} km` : '-'
    },
    { 
      key: 'stopType', 
      label: 'Stop Type',
      render: (value) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === 'REGULAR' ? 'bg-green-100 text-green-800' :
          value === 'TECHNICAL' ? 'bg-yellow-100 text-yellow-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/admin/train-routes/view/${row.id}`)}
            className="text-blue-600 hover:text-blue-900"
            title="View"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const validateForm = () => {
    if (!formData.trainId) {
      toast.error('Please select a train');
      return false;
    }
    if (!formData.stationId) {
      toast.error('Please select a station');
      return false;
    }
    if (!formData.sequenceNo || formData.sequenceNo <= 0) {
      toast.error('Sequence number must be greater than 0');
      return false;
    }
    return true;
  };

  const handleAdd = () => {
    setSelectedRoute(null);
    setFormData({
      trainId: '',
      stationId: '',
      sequenceNo: '',
      arrivalTime: '',
      departureTime: '',
      haltMinutes: '',
      distanceFromSource: '',
      dayNumber: 1,
      isMajorStation: false,
      stopType: 'REGULAR'
    });
    setShowModal(true);
  };

  const handleEdit = (route) => {
    setSelectedRoute(route);
    setFormData({
      trainId: route.trainId,
      stationId: route.stationId,
      sequenceNo: route.sequenceNo,
      arrivalTime: route.arrivalTime,
      departureTime: route.departureTime,
      haltMinutes: route.haltMinutes,
      distanceFromSource: route.distanceFromSource,
      dayNumber: route.dayNumber,
      isMajorStation: route.isMajorStation,
      stopType: route.stopType
    });
    setShowModal(true);
  };

  const handleDelete = (route) => {
    setSelectedRoute(route);
    setShowDeleteDialog(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    let success = false;
    if (selectedRoute) {
      success = await updateTrainRoute(selectedRoute.id, formData);
      if (success) {
        toast.success('Train Route updated successfully!');
      }
    } else {
      success = await addTrainRoute(formData);
      if (success) {
        toast.success('Train Route added successfully!');
      }
    }
    
    if (success) {
      setShowModal(false);
    }
  };

  const confirmDelete = async () => {
    const success = await deleteTrainRoute(selectedRoute.id);
    if (success) {
      toast.success('Train Route deleted successfully!');
    }
    setShowDeleteDialog(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Train Route Management</h1>
            <p className="text-gray-600">Manage train routes and station stops</p>
          </div>
          <PrimaryButton onClick={handleAdd}>
            Add Train Route
          </PrimaryButton>
        </div>

        <DataTable
          columns={columns}
          data={trainRoutes}
          onEdit={handleEdit}
          onDelete={handleDelete}
          showActions={true}
        />

        <FormModal
          open={showModal}
          onClose={() => setShowModal(false)}
          title={selectedRoute ? 'Edit Train Route' : 'Add Train Route'}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <TrainRouteForm
              formData={formData}
              setFormData={setFormData}
            />
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <PrimaryButton type="submit">
                {selectedRoute ? 'Update Route' : 'Add Route'}
              </PrimaryButton>
            </div>
          </form>
        </FormModal>

        <ConfirmDialog
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={confirmDelete}
          title="Delete Train Route"
          message={`Are you sure you want to delete this train route?`}
        />
      </div>
    </AdminLayout>
  );
}
