import { EyeIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import AdminLayout from '../layouts/AdminLayout';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';
import ConfirmDialog from '../components/ConfirmDialog';
import PrimaryButton from '../components/PrimaryButton';
import SeatLayoutForm from '../components/SeatLayoutForm';
import { useSeatLayouts } from '../context/SeatLayoutContext';
import toast from 'react-hot-toast';

export default function SeatLayoutListPage() {
  const navigate = useNavigate();
  const { seatLayouts, addSeatLayout, updateSeatLayout, deleteSeatLayout, fetchSeatLayouts } = useSeatLayouts();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [formData, setFormData] = useState({
    coachTypeId: '',
    seatNumber: '',
    seatType: ''
  });

  useEffect(() => {
    fetchSeatLayouts();
  }, []);

  const columns = [
    { 
      key: 'coachTypeCode', 
      label: 'Coach Type',
      render: (value) => (
        <span className="px-2 py-1 text-xs bg-violet-100 text-violet-800 rounded-full">
          {value}
        </span>
      )
    },
    { key: 'coachTypeName', label: 'Coach Type Name' },
    { key: 'seatNumber', label: 'Seat Number' },
    { 
      key: 'seatType', 
      label: 'Seat Type',
      render: (value) => (
        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
          {value?.replace('_', ' ')}
        </span>
      )
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
    if (!formData.coachTypeId) {
      toast.error('Please select coach type');
      return false;
    }
    if (!formData.seatNumber || formData.seatNumber <= 0) {
      toast.error('Seat number must be greater than 0');
      return false;
    }
    if (!formData.seatType) {
      toast.error('Please select seat type');
      return false;
    }
    return true;
  };

  const handleAdd = () => {
    setSelectedLayout(null);
    setFormData({
      coachTypeId: '',
      seatNumber: '',
      seatType: ''
    });
    setShowModal(true);
  };

  const handleEdit = (layout) => {
    setSelectedLayout(layout);
    setFormData({
      coachTypeId: layout.coachTypeId,
      seatNumber: layout.seatNumber,
      seatType: layout.seatType
    });
    setShowModal(true);
  };

  const handleDelete = (layout) => {
    setSelectedLayout(layout);
    setShowDeleteDialog(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    let success = false;
    if (selectedLayout) {
      success = await updateSeatLayout(selectedLayout.id, formData);
      if (success) {
        toast.success('Seat Layout updated successfully!');
      }
    } else {
      success = await addSeatLayout(formData);
      if (success) {
        toast.success('Seat Layout added successfully!');
      }
    }
    
    if (success) {
      setShowModal(false);
    }
  };

  const confirmDelete = async () => {
    const success = await deleteSeatLayout(selectedLayout.id);
    if (success) {
      toast.success('Seat Layout deleted successfully!');
    }
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