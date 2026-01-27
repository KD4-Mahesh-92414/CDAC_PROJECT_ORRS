import { useState } from 'react';
import { useNavigate } from 'react-router';
import AdminLayout from '../layouts/AdminLayout';
import PrimaryButton from '../components/PrimaryButton';
import SeatLayoutForm from '../components/SeatLayoutForm';
import toast from 'react-hot-toast';

export default function AddSeatLayoutPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    coachType: '',
    layoutName: '',
    totalSeats: '',
    rows: '',
    seatsPerRow: '',
    layoutConfig: '',
    description: ''
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      toast.success('Seat Layout added successfully!');
      navigate('/admin/seat-layouts');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add Seat Layout</h1>
            <p className="text-gray-600">Create a new seat layout configuration</p>
          </div>
          <PrimaryButton 
            variant="secondary" 
            onClick={() => navigate('/admin/seat-layouts')}
          >
            Back to List
          </PrimaryButton>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <SeatLayoutForm
              formData={formData}
              setFormData={setFormData}
            />
            
            <div className="flex justify-end space-x-3">
              <PrimaryButton 
                type="button" 
                variant="secondary"
                onClick={() => navigate('/admin/seat-layouts')}
              >
                Cancel
              </PrimaryButton>
              <PrimaryButton type="submit">
                Add Seat Layout
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}