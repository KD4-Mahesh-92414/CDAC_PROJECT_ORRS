import { useState, useEffect } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';
import ConfirmDialog from '../components/ConfirmDialog';
import PrimaryButton from '../components/PrimaryButton';
import AdminInput from '../components/AdminInput';
import { adminService } from '../../services';
import { validateStation } from '../validations';
import toast from 'react-hot-toast';

export default function StationManagement() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      setLoading(true);
      const response = await adminService.stations.getAllStations();
      if (response.data?.status === 'SUCCESS') {
        setStations(response.data.data || []);
      }
    } catch (error) {
      toast.error('Failed to fetch stations');
    } finally {
      setLoading(false);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedStation, setSelectedStation] = useState(null);
  const [formData, setFormData] = useState({
    stationCode: '',
    stationName: '',
    city: '',
    state: '',
    zone: '',
    platforms: '',
    status: 'Active'
  });
  const [errors, setErrors] = useState({});

  const columns = [
    { key: 'stationCode', label: 'Station Code' },
    { key: 'stationName', label: 'Station Name' },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
    { key: 'zone', label: 'Zone' },
    { key: 'platforms', label: 'Platforms' },
    { 
      key: 'status', 
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
    setSelectedStation(null);
    setFormData({
      stationCode: '',
      stationName: '',
      city: '',
      state: '',
      zone: '',
      platforms: '',
      status: 'Active'
    });
    setErrors({});
    setShowModal(true);
  };

  const handleEdit = (station) => {
    setSelectedStation(station);
    setFormData({
      stationCode: station.stationCode,
      stationName: station.stationName,
      city: station.city,
      state: station.state,
      zone: station.zone,
      platforms: station.platforms,
      status: station.status
    });
    setErrors({});
    setShowModal(true);
  };

  const handleDelete = (station) => {
    setSelectedStation(station);
    setShowDeleteDialog(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateStation(formData);
    if (Object.keys(validationErrors).length > 0) {
      Object.values(validationErrors).forEach(error => toast.error(error));
      return;
    }

    let success = false;
    if (selectedStation) {
      success = await updateStation(selectedStation.id, formData);
      if (success) {
        toast.success('Station updated successfully!');
      }
    } else {
      success = await addStation(formData);
      if (success) {
        toast.success('Station added successfully!');
      }
    }
    
    if (success) {
      setShowModal(false);
      setErrors({});
    }
  };

  const confirmDelete = async () => {
    const success = await deleteStation(selectedStation.id);
    if (success) {
      toast.success('Station deleted successfully!');
    }
    setShowDeleteDialog(false);
  };

  const filteredStations = stations.filter(station =>
    station.stationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    station.stationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    station.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStations = filteredStations.slice(startIndex, startIndex + itemsPerPage);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Station Management</h1>
            <p className="text-gray-600">Manage railway stations and their details</p>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search stations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <PrimaryButton onClick={handleAdd}>
              Add Station
            </PrimaryButton>
          </div>
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          data={paginatedStations}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredStations.length)} of {filteredStations.length} results
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Add/Edit Modal */}
        <FormModal
          open={showModal}
          onClose={() => setShowModal(false)}
          title={selectedStation ? 'Edit Station' : 'Add Station'}
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            <AdminInput
              label="Station Code"
              name="stationCode"
              value={formData.stationCode}
              onChange={(e) => setFormData({...formData, stationCode: e.target.value})}
              error={errors.stationCode}
              required
            />

            <AdminInput
              label="Station Name"
              name="stationName"
              value={formData.stationName}
              onChange={(e) => setFormData({...formData, stationName: e.target.value})}
              error={errors.stationName}
              required
            />

            <AdminInput
              label="City"
              name="city"
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
            />

            <AdminInput
              label="State"
              name="state"
              value={formData.state}
              onChange={(e) => setFormData({...formData, state: e.target.value})}
            />

            <AdminInput
              label="Zone"
              name="zone"
              value={formData.zone}
              onChange={(e) => setFormData({...formData, zone: e.target.value})}
            />

            <AdminInput
              label="Platforms"
              name="platforms"
              type="number"
              value={formData.platforms}
              onChange={(e) => setFormData({...formData, platforms: parseInt(e.target.value) || ''})}
              error={errors.platforms}
            />

            <div className="col-span-2">
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 text-base"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Under Maintenance">Under Maintenance</option>
              </select>
            </div>
          </div>
        </FormModal>

        {/* Delete Confirmation */}
        <ConfirmDialog
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={confirmDelete}
          title="Delete Station"
          message={`Are you sure you want to delete ${selectedStation?.stationName}?`}
        />
      </div>
    </AdminLayout>
  );
}
