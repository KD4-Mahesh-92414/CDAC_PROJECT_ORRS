import { EyeIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import AdminLayout from '../layouts/AdminLayout';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';
import ConfirmDialog from '../components/ConfirmDialog';
import PrimaryButton from '../components/PrimaryButton';
import CoachTypeForm from '../components/CoachTypeForm';
import { useCoachTypes } from '../context/CoachTypeContext';
import toast from 'react-hot-toast';

export default function CoachTypeListPage() {
  const navigate = useNavigate();
  const { coachTypes, addCoachType, updateCoachType, deleteCoachType, fetchCoachTypes } = useCoachTypes();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCoachType, setSelectedCoachType] = useState(null);
  const [formData, setFormData] = useState({
    typeCode: '',
    typeName: '',
    description: '',
    totalSeats: '',
    coachImageUrl: ''
  });

  useEffect(() => {
    fetchCoachTypes();
  }, []);

  const columns = [
    { key: 'typeCode', label: 'Type Code' },
    { key: 'typeName', label: 'Type Name' },
    { key: 'description', label: 'Description' },
    { key: 'totalSeats', label: 'Total Seats' },
    { 
      key: 'coachImageUrl', 
      label: 'Image',
      render: (value) => value ? 'Yes' : 'No'
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/admin/coach-types/view/${row.id}`)}
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
    if (!formData.typeCode) {
      toast.error('Type Code is required');
      return false;
    }
    if (!formData.typeName) {
      toast.error('Type Name is required');
      return false;
    }
    if (!formData.totalSeats || formData.totalSeats <= 0) {
      toast.error('Total Seats must be greater than 0');
      return false;
    }
    return true;
  };

  const handleAdd = () => {
    setSelectedCoachType(null);
    setFormData({
      typeCode: '',
      typeName: '',
      description: '',
      totalSeats: '',
      coachImageUrl: ''
    });
    setShowModal(true);
  };

  const handleEdit = (coachType) => {
    setSelectedCoachType(coachType);
    setFormData(coachType);
    setShowModal(true);
  };

  const handleDelete = (coachType) => {
    setSelectedCoachType(coachType);
    setShowDeleteDialog(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    let success = false;
    if (selectedCoachType) {
      success = await updateCoachType(selectedCoachType.id, formData);
      if (success) {
        toast.success('Coach Type updated successfully!');
      }
    } else {
      success = await addCoachType(formData);
      if (success) {
        toast.success('Coach Type added successfully!');
      }
    }
    
    if (success) {
      setShowModal(false);
    }
  };

  const confirmDelete = async () => {
    const success = await deleteCoachType(selectedCoachType.id);
    if (success) {
      toast.success('Coach Type deleted successfully!');
    }
    setShowDeleteDialog(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Coach Type Management</h1>
            <p className="text-gray-600">Manage different types of train coaches</p>
          </div>
          <PrimaryButton onClick={handleAdd}>
            Add Coach Type
          </PrimaryButton>
        </div>

        <DataTable
          columns={columns}
          data={coachTypes}
          onEdit={handleEdit}
          onDelete={handleDelete}
          showActions={true}
        />

        <FormModal
          open={showModal}
          onClose={() => setShowModal(false)}
          title={selectedCoachType ? 'Edit Coach Type' : 'Add Coach Type'}
          onSubmit={handleSubmit}
        >
          <CoachTypeForm
            formData={formData}
            setFormData={setFormData}
          />
        </FormModal>

        <ConfirmDialog
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={confirmDelete}
          title="Delete Coach Type"
          message={`Are you sure you want to delete ${selectedCoachType?.typeName}?`}
        />
      </div>
    </AdminLayout>
  );
}