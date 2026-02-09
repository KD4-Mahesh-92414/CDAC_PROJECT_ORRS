import { useSelector } from 'react-redux';

/**
 * BookingSummary Component
 * Responsibility: Display booking summary with fare breakdown and proceed button
 */
export default function BookingSummary({ 
  passengers, 
  fareData, 
  onProceed, 
  isValid = false 
}) {
  const { reservationData } = useSelector((state) => state.booking);
  
  const passengerCount = passengers.length;
  const baseFare = fareData?.baseFare || passengerCount * 2500;
  const taxes = fareData?.taxes || Math.round(baseFare * 0.05);
  const totalFare = fareData?.totalFare || baseFare + taxes;
  const farePerSeat = fareData?.farePerSeat || 2500;

  // Dynamic button text based on page context
  const getButtonText = () => {
    return 'Continue';
  };

  return (
    <div className="border-t border-violet-100 pt-6">
      <h4 className="font-semibold text-gray-900 mb-4">Booking Summary</h4>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Passengers:</span>
          <span className="font-medium text-gray-900">{passengerCount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Base Fare (avg per seat):</span>
          <span className="font-medium text-gray-900">₹{farePerSeat}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Taxes & Fees:</span>
          <span className="font-medium text-gray-900">₹{taxes}</span>
        </div>
      </div>

      <div className="bg-violet-50 rounded-xl p-4 border-l-4 border-violet-500 mb-6">
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-900">Total Amount:</span>
          <span className="text-2xl font-bold text-violet-600">
            ₹{totalFare.toLocaleString()}
          </span>
        </div>
      </div>

      <button
        onClick={onProceed}
        disabled={!isValid}
        className={`w-full font-semibold py-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg ${
          isValid
            ? 'bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {getButtonText()}
      </button>
    </div>
  );
}