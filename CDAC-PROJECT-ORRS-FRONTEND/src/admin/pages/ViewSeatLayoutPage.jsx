import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import AdminLayout from '../layouts/AdminLayout';
import PrimaryButton from '../components/PrimaryButton';

export default function ViewSeatLayoutPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [seatLayout, setSeatLayout] = useState(null);
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
    
    setSeatLayout(mockLayout);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!seatLayout) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900">Seat Layout Not Found</h2>
          <PrimaryButton 
            onClick={() => navigate('/admin/seat-layouts')}
            className="mt-4"
          >
            Back to List
          </PrimaryButton>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Seat Layout Details</h1>
            <p className="text-gray-600">View seat layout configuration</p>
          </div>
          <div className="flex space-x-3">
            <PrimaryButton 
              onClick={() => navigate(`/admin/seat-layouts/edit/${id}`)}
            >
              Edit
            </PrimaryButton>
            <PrimaryButton 
              variant="secondary" 
              onClick={() => navigate('/admin/seat-layouts')}
            >
              Back to List
            </PrimaryButton>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Coach Type
              </label>
              <div className="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl">
                <span className="px-2 py-1 text-xs bg-violet-100 text-violet-800 rounded-full">
                  {seatLayout.coachType}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Layout Name
              </label>
              <div className="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl">
                {seatLayout.layoutName}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Total Seats
              </label>
              <div className="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl">
                {seatLayout.totalSeats}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Rows
              </label>
              <div className="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl">
                {seatLayout.rows}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Seats Per Row
              </label>
              <div className="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl">
                {seatLayout.seatsPerRow}
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Description
              </label>
              <div className="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl">
                {seatLayout.description || 'No description provided'}
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Layout Configuration
              </label>
              <div className="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {seatLayout.layoutConfig ? JSON.stringify(JSON.parse(seatLayout.layoutConfig), null, 2) : 'No configuration provided'}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}