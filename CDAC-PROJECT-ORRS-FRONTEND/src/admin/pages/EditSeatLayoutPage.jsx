import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import AdminLayout from '../layouts/AdminLayout';
import PrimaryButton from '../components/PrimaryButton';
import SeatLayoutForm from '../components/SeatLayoutForm';
import toast from 'react-hot-toast';

export default function EditSeatLayoutPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    coachType: '',
    layoutName: '',
    totalSeats: '',
    rows: '',
    seatsPerRow: '',
    layoutConfig: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data loading
    const mockLayout = {
      id: 1,
      coachType: 'SL',
      layoutName: 'Standard Sleeper Layout',
      totalSeats: 72,
      rows: 24,
      seatsPerRow: 3,
      layoutConfig: '{"berths": {"lower": 18, "middle": 18, "upper": 18, "side_lower": 9, "side_upper": 9}}',
      description: 'Standard sleeper coach layout with 72 berths'
    };
    
    setFormData(mockLayout);
    setLoading(false);
  }, [id]);

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
      toast.success('Seat Layout updated successfully!');
      navigate('/admin/seat-layouts');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Seat Layout</h1>
            <p className="text-gray-600">Update seat layout configuration</p>
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
                Update Seat Layout
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}