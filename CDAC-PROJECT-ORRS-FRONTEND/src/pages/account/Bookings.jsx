import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bookingService from "../../services/bookingService";
import CancelBookingModal from "../../components/booking/CancelBookingModal";
import toast from "react-hot-toast";

export default function Bookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchBookingData();
  }, []);

  const fetchBookingData = async () => {
    try {
      setLoading(true);
      
      // Fetch booking history and stats
      const [historyResponse, statsResponse] = await Promise.all([
        bookingService.getBookingHistory(),
        bookingService.getBookingStats()
      ]);
      
      if (historyResponse.status === 'SUCCESS') {
        setBookings(historyResponse.data || []);
      }
      
      if (statsResponse.status === 'SUCCESS') {
        setStats(statsResponse.data);
      }
    } catch (err) {
      console.error('Error fetching booking data:', err);
      setError(err.message || 'Failed to load booking history');
      toast.error('Failed to load booking history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isBookingCancellable = (booking) => {
    const journeyDate = new Date(booking.journeyDate || booking.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    journeyDate.setHours(0, 0, 0, 0);
    const status = booking.bookingStatus || booking.status;
    
    // Only show cancel for confirmed bookings that are today or in the future
    return status === "CONFIRMED" && journeyDate >= today;
  };

  const handleViewDetails = (bookingId) => {
    navigate(`/account/bookings/${bookingId}`);
  };

  const handleCancelBooking = (bookingId) => {
    setSelectedBookingId(bookingId);
    setShowCancelModal(true);
  };

  const confirmCancelBooking = async () => {
    try {
      setCancelling(true);
      const response = await bookingService.cancelBooking({ 
        bookingId: selectedBookingId,
        reason: ""
      });
      
      if (response.status === 'SUCCESS') {
        toast.success('Booking cancelled successfully');
        setShowCancelModal(false);
        setSelectedBookingId(null);
        fetchBookingData();
      } else {
        throw new Error(response.message || 'Failed to cancel booking');
      }
    } catch (err) {
      console.error('Error cancelling booking:', err);
      toast.error(err.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Booking History
          </h1>
          <p className="text-lg text-gray-600">
            View all your railway bookings
          </p>
        </div>

        {/* Booking Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          {stats ? [
            { label: "Total Bookings", value: stats.totalBookings || 0, color: "violet" },
            { label: "Confirmed", value: stats.confirmedBookings || 0, color: "green" },
            { label: "Completed", value: stats.completedBookings || 0, color: "blue" },
            { label: "Cancelled", value: stats.cancelledBookings || 0, color: "red" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className={`bg-${stat.color}-50 rounded-xl p-4 border-l-4 border-${stat.color}-500`}
            >
              <p className={`text-sm text-${stat.color}-600 mb-1`}>
                {stat.label}
              </p>
              <p className={`text-3xl font-bold text-${stat.color}-700`}>
                {stat.value}
              </p>
            </div>
          )) : (
            // Loading skeleton
            Array.from({length: 4}).map((_, idx) => (
              <div key={idx} className="bg-gray-100 rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {Array.from({length: 3}).map((_, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-6 bg-gray-200 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-6 bg-gray-200 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-6 bg-gray-200 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-300 rounded-xl p-6 text-center">
            <p className="text-red-600 font-medium">{error}</p>
            <button 
              onClick={fetchBookingData}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* Bookings List */}
        {!loading && !error && (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.bookingId || booking.id}
                className="bg-white rounded-2xl shadow-lg shadow-violet-200 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
                    {/* Journey Info */}
                    <div>
                      <p className="text-sm text-gray-500 mb-1">PNR</p>
                      <p className="text-lg font-bold text-gray-900 mb-2">
                        {booking.pnrNumber || booking.pnr}
                      </p>
                      <p className="text-sm text-gray-600">
                        {booking.trainDetails?.trainName || booking.train}
                      </p>
                    </div>

                    {/* Route */}
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Route</p>
                      <p className="text-gray-900">
                        {booking.trainRoute || (
                          <>
                            <span className="font-semibold">
                              {booking.sourceStation || booking.trainDetails?.sourceStation || booking.from}
                            </span>
                            <span className="text-violet-600 mx-2">→</span>
                            <span className="font-semibold">
                              {booking.destinationStation || booking.trainDetails?.destinationStation || booking.to}
                            </span>
                          </>
                        )}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {booking.totalPassengers || booking.passengerCount || booking.passengers} passenger(s)
                      </p>
                    </div>

                    {/* Date */}
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Journey Date</p>
                      <p className="text-lg font-bold text-gray-900">
                        {booking.journeyDate || booking.date}
                      </p>
                    </div>

                    {/* Status & Fare */}
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Status</p>
                      <span
                        className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold ${getStatusColor(
                          booking.bookingStatus || booking.status
                        )}`}
                      >
                        {booking.bookingStatus || booking.status}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => handleViewDetails(booking.bookingId || booking.id)}
                        className="bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                      >
                        View Details
                      </button>
                      {isBookingCancellable(booking) && (
                        <button 
                          onClick={() => handleCancelBooking(booking.bookingId || booking.id)}
                          className="bg-orange-100 hover:bg-orange-200 text-orange-700 font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Fare */}
                  <div className="mt-4 pt-4 border-t border-violet-100">
                    <div className="flex justify-between items-center">
                      <p className="text-gray-600">Total Fare</p>
                      <p className="text-2xl font-bold text-violet-600">
                        ₹{booking.totalFare || booking.fare?.replace('₹', '')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && bookings.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg shadow-violet-200 p-12 text-center">
            <div className="text-6xl mb-4">🎫</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Bookings Found
            </h3>
            <p className="text-gray-600 mb-6">
              Start your journey by booking your first train ticket
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-8 py-3 rounded-xl"
            >
              Book Now
            </button>
          </div>
        )}
      </div>

      {/* Cancel Booking Modal */}
      <CancelBookingModal
        open={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={confirmCancelBooking}
        loading={cancelling}
      />
    </div>
  );
}
