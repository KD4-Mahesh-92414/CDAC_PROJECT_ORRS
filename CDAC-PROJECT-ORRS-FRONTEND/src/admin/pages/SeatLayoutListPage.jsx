import { EyeIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import AdminLayout from '../layouts/AdminLayout';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';
import ConfirmDialog from '../components/ConfirmDialog';
import PrimaryButton from '../components/PrimaryButton';
import SeatLayoutForm from '../components/SeatLayoutForm';
import toast from 'react-hot-toast';

export default function SeatLayoutListPage() {
  const navigate = useNavigate();
  
  const [seatLayouts] = useState([
    {
      id: 1,
      coachType: 'SL',
      layoutName: 'Standard Sleeper Layout',
      totalSeats: 72,
      rows: 24,
      seatsPerRow: 3,
      layoutConfig: '{"berths": {"lower": 18, "middle": 18, "upper": 18, "side_lower": 9, "side_upper": 9}}',
      description: 'Standard sleeper coach layout with 72 berths'
    },
    {
      id: 2,
      coachType: '3A',
      layoutName: 'AC 3 Tier Layout',
      totalSeats: 64,
      rows: 16,
      seatsPerRow: 4,
      layoutConfig: '{"berths": {"lower": 16, "middle": 16, "upper": 16, "side_lower": 8, "side_upper": 8}}',
      description: 'AC 3 tier coach layout with 64 berths'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [formData, setFormData] = useState({
    coachType: '',
    layoutName: '',
    totalSeats: '',
    rows: '',
    seatsPerRow: '',
    layoutConfig: '',
    description: ''
  });

  const columns = [
    { 
      key: 'coachType', 
      label: 'Coach Type',
      render: (value) => (
        <span className="px-2 py-1 text-xs bg-violet-100 text-violet-800 rounded-full">
          {value}
        </span>
      )
    },
    { key: 'layoutName', label: 'Layout Name' },
    { key: 'totalSeats', label: 'Total Seats' },
    { key: 'rows', label: 'Rows' },
    { key: 'seatsPerRow', label: 'Seats/Row' },
    { 
      key: 'description', 
      label: 'Description',
      render: (value) => value ? value.substring(0, 50) + '...' : '-'
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/admin/seat-layouts/view/${row.id}`)}
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
    if (!formData.coachType) {
      toast.error('Please select coach type');
      return false;
    }
    if (!formData.layoutName) {
      toast.error('Layout name is required');
      return false;
    }
    if (!formData.totalSeats || formData.totalSeats <= 0) {
      toast.error('Total seats must be greater than 0');
      return false;
    }
    if (!formData.rows || formData.rows <= 0) {
      toast.error('Rows must be greater than 0');
      return false;
    }
    if (!formData.seatsPerRow || formData.seatsPerRow <= 0) {
      toast.error('Seats per row must be greater than 0');
      return false;
    }
    return true;
  };

  const handleAdd = () => {
    setSelectedLayout(null);
    setFormData({
      coachType: '',
      layoutName: '',
      totalSeats: '',
      rows: '',
      seatsPerRow: '',
      layoutConfig: '',
      description: ''
    });
    setShowModal(true);
  };

  const handleEdit = (layout) => {
    setSelectedLayout(layout);
    setFormData(layout);
    setShowModal(true);
  };

  const handleDelete = (layout) => {
    setSelectedLayout(layout);
    setShowDeleteDialog(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      toast.success(selectedLayout ? 'Seat Layout updated successfully!' : 'Seat Layout added successfully!');
      setShowModal(false);
    }
  };

  const confirmDelete = () => {
    toast.success('Seat Layout deleted successfully!');
    setShowDeleteDialog(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Seat Layout Management</h1>
            <p className="text-gray-600">Manage seat layouts for different coach types</p>
          </div>
          <PrimaryButton onClick={handleAdd}>
            Add Seat Layout
          </PrimaryButton>
        </div>

        <DataTable
          columns={columns}
          data={seatLayouts}
          onEdit={handleEdit}
          onDelete={handleDelete}
          showActions={true}
        />

        <FormModal
          open={showModal}
          onClose={() => setShowModal(false)}
          title={selectedLayout ? 'Edit Seat Layout' : 'Add Seat Layout'}
          onSubmit={handleSubmit}
        >
          <SeatLayoutForm
            formData={formData}
            setFormData={setFormData}
          />
        </FormModal>

        <ConfirmDialog
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={confirmDelete}
          title="Delete Seat Layout"
          message={`Are you sure you want to delete ${selectedLayout?.layoutName}?`}
        />
      </div>
    </AdminLayout>
  );
}