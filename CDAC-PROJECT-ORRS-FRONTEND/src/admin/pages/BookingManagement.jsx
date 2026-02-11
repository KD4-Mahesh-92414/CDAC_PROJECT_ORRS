import { useState, useEffect } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import DataTable from '../components/DataTable';
import ConfirmDialog from '../components/ConfirmDialog';
import { adminService } from '../../services';
import toast from 'react-hot-toast';

export default function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await adminService.bookings.getAllBookings();
      if (response.data?.status === 'SUCCESS') {
        setBookings(response.data.data || []);
      }
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'pnrNumber', label: 'PNR' },
    { key: 'userFullName', label: 'Passenger Name' },
    { key: 'userEmail', label: 'Email' },
    { 
      key: 'trainNumber', 
      label: 'Train',
      render: (value, row) => `${value} - ${row.trainName}`
    },
    { 
      key: 'sourceStation', 
      label: 'Route',
      render: (value, row) => `${value} → ${row.destinationStation}`
    },
    { key: 'journeyDate', label: 'Journey Date' },
    { key: 'coachType', label: 'Class' },
    { key: 'totalPassengers', label: 'Passengers' },
    { 
      key: 'totalFare', 
      label: 'Fare',
      render: (value) => `₹${value}`
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
          value === 'CANCELLED' ? 'bg-red-100 text-red-800' :
          value === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      )
    },
    { 
      key: 'bookingDate', 
      label: 'Booked On',
      render: (value) => new Date(value).toLocaleString()
    }
  ];

  const handleCancelBooking = (booking) => {
    if (booking.status !== 'CONFIRMED') {
      toast.error('Only confirmed bookings can be cancelled');
      return;
    }
    setSelectedBooking(booking);
    setShowCancelDialog(true);
  };

  const confirmCancel = async () => {
    try {
      const response = await adminService.bookings.cancelBooking(selectedBooking.bookingId);
      if (response.data?.status === 'SUCCESS') {
        toast.success('Booking cancelled successfully!');
        fetchBookings();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
    setShowCancelDialog(false);
    setSelectedBooking(null);
  };

  const customActions = (booking) => [
    {
      label: 'Cancel Booking',
      onClick: () => handleCancelBooking(booking),
      className: 'text-red-600 hover:text-red-800',
      show: booking.status === 'CONFIRMED'
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
            <p className="text-gray-600">View and manage all train bookings</p>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={bookings}
          customActions={customActions}
          loading={loading}
        />

        <ConfirmDialog
          open={showCancelDialog}
          onClose={() => {
            setShowCancelDialog(false);
            setSelectedBooking(null);
          }}
          onConfirm={confirmCancel}
          title="Cancel Booking"
          message={`Are you sure you want to cancel booking ${selectedBooking?.pnrNumber}? This action cannot be undone.`}
        />
      </div>
    </AdminLayout>
  );
}
