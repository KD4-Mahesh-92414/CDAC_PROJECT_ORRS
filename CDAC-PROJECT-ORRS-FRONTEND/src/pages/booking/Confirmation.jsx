import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetBooking } from '../../store/slices/bookingSlice';
import { CheckCircleIcon, PrinterIcon, ShareIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

/**
 * Booking Confirmation Page
 * Shows successful booking details with PNR number
 */
export default function Confirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    // Get booking data from navigation state
    const bookingData = location.state?.booking;
    
    if (!bookingData) {
      // No booking data, redirect to home
      toast.error('No booking information found');
      navigate('/');
      return;
    }

    setBooking(bookingData);
    
    // Don't reset booking here, let Payment page handle it
    // dispatch(resetBooking());
  }, [location.state, navigate, dispatch]);

  const handlePrintTicket = () => {
    window.print();
  };

  const handleSharePNR = async () => {
    if (navigator.share && booking?.pnrNumber) {
      try {
        await navigator.share({
          title: 'Train Booking Confirmed',
          text: `My train booking is confirmed! PNR: ${booking.pnrNumber}`,
          url: window.location.origin
        });
      } catch (error) {
        // Fallback to clipboard
        copyPNRToClipboard();
      }
    } else {
      copyPNRToClipboard();
    }
  };

  const copyPNRToClipboard = () => {
    if (booking?.pnrNumber) {
      navigator.clipboard.writeText(booking.pnrNumber);
      toast.success('PNR number copied to clipboard!');
    }
  };

  const handleNewBooking = () => {
    navigate('/');
  };

  const handleViewBookings = () => {
    navigate('/account/bookings');
  };

  if (!booking) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Success Header */}
      <div className="text-center bg-green-50 border-2 border-green-200 rounded-2xl p-8">
        <CheckCircleIcon className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-green-800 mb-2">
          Booking Confirmed!
        </h1>
        <p className="text-green-600 text-lg">
          Your train ticket has been booked successfully
        </p>
      </div>

      {/* PNR Information */}
      <div className="bg-white border-2 border-violet-300 rounded-2xl p-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Your PNR Number
          </h2>
          <div className="bg-violet-100 border-2 border-violet-300 rounded-lg p-4 inline-block">
            <span className="text-3xl font-bold text-violet-800 tracking-wider">
              {booking.pnrNumber}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Save this PNR number for future reference
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={handlePrintTicket}
            className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <PrinterIcon className="w-4 h-4" />
            <span>Print Ticket</span>
          </button>
          <button
            onClick={handleSharePNR}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ShareIcon className="w-4 h-4" />
            <span>Share PNR</span>
          </button>
        </div>
      </div>

      {/* Booking Details */}
      <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Booking Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Train Information */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Train Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Train:</span>
                <span className="font-medium">
                  {booking.trainDetails?.trainNumber} - {booking.trainDetails?.trainName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Route:</span>
                <span className="font-medium">
                  {booking.trainDetails?.sourceStation} → {booking.trainDetails?.destinationStation}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Class:</span>
                <span className="font-medium">{booking.trainDetails?.coachType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Journey Date:</span>
                <span className="font-medium">{booking.journeyDate}</span>
              </div>
            </div>
          </div>

          {/* Booking Information */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Booking Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-green-600">{booking.bookingStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Fare:</span>
                <span className="font-medium">₹{booking.totalFare}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Passengers:</span>
                <span className="font-medium">{booking.passengers?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Passenger Details */}
      {booking.passengers && booking.passengers.length > 0 && (
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Passenger Details
          </h3>
          
          <div className="space-y-4">
            {booking.passengers.map((passenger, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <div className="font-medium">{passenger.name}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Age:</span>
                    <div className="font-medium">{passenger.age}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Gender:</span>
                    <div className="font-medium">{passenger.gender}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Seat:</span>
                    <div className="font-medium text-violet-600">{passenger.seatNumber}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Important Information */}
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3">
          Important Information
        </h3>
        <ul className="space-y-2 text-sm text-yellow-700">
          <li>• Please carry a valid photo ID proof during your journey</li>
          <li>• Arrive at the station at least 30 minutes before departure</li>
          <li>• Keep your PNR number safe for future reference</li>
          <li>• You can check your PNR status anytime on our website</li>
          <li>• Cancellation charges may apply as per railway rules</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleNewBooking}
          className="bg-violet-600 text-white px-6 py-3 rounded-lg hover:bg-violet-700 transition-colors font-medium"
        >
          Book Another Ticket
        </button>
        <button
          onClick={handleViewBookings}
          className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          View My Bookings
        </button>
      </div>
    </div>
  );
}