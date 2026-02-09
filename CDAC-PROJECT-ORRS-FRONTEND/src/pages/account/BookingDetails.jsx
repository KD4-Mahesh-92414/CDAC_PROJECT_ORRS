import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import bookingService from "../../services/bookingService";
import toast from "react-hot-toast";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function BookingDetails() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getBookingDetails(bookingId);
      
      if (response.status === 'SUCCESS') {
        setBooking(response.data);
      } else {
        throw new Error(response.message || 'Failed to load booking details');
      }
    } catch (err) {
      console.error('Error fetching booking details:', err);
      setError(err.message || 'Failed to load booking details');
      toast.error('Failed to load booking details');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="bg-white rounded-2xl p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-300 rounded-xl p-6 text-center">
            <p className="text-red-600 font-medium">{error || 'Booking not found'}</p>
            <button 
              onClick={() => navigate('/account/bookings')}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Back to Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/account/bookings')}
          className="flex items-center gap-2 text-violet-600 hover:text-violet-700 mb-6"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Bookings
        </button>

        {/* PNR Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">PNR Number</p>
              <p className="text-3xl font-bold text-violet-600">{booking.pnrNumber}</p>
            </div>
            <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${getStatusColor(booking.bookingStatus)}`}>
              {booking.bookingStatus}
            </span>
          </div>
        </div>

        {/* Train Details */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Train Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Train Number</p>
              <p className="text-lg font-semibold">{booking.trainDetails?.trainNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Train Name</p>
              <p className="text-lg font-semibold">{booking.trainDetails?.trainName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">From</p>
              <p className="text-lg font-semibold">{booking.trainDetails?.sourceStation}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">To</p>
              <p className="text-lg font-semibold">{booking.trainDetails?.destinationStation}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Journey Date</p>
              <p className="text-lg font-semibold">{booking.journeyDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Coach Type</p>
              <p className="text-lg font-semibold">{booking.trainDetails?.coachType}</p>
            </div>
          </div>
        </div>

        {/* Passenger Details */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Passenger Details</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-violet-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Age</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Gender</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Seat</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {booking.passengers?.map((passenger, idx) => (
                  <tr key={idx} className="border-b border-violet-100 hover:bg-violet-50">
                    <td className="py-3 px-4 text-gray-900">{passenger.name}</td>
                    <td className="py-3 px-4 text-gray-900">{passenger.age}</td>
                    <td className="py-3 px-4 text-gray-900">{passenger.gender}</td>
                    <td className="py-3 px-4 font-bold text-violet-600">{passenger.seatNumber}</td>
                    <td className="py-3 px-4 text-green-600 font-semibold">{passenger.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fare Details */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Fare Details</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-gray-600">Base Fare</p>
              <p className="font-semibold">₹{booking.totalFare}</p>
            </div>
            <div className="border-t-2 border-violet-200 pt-2 mt-2">
              <div className="flex justify-between items-center">
                <p className="text-lg font-bold text-gray-900">Total Fare</p>
                <p className="text-2xl font-bold text-violet-600">₹{booking.totalFare}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
