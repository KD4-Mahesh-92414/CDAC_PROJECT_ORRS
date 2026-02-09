import { ArrowRightIcon, CurrencyRupeeIcon, TicketIcon } from "@heroicons/react/24/outline";
import Button from "../ui/Button";

/**
 * FareSummary Component
 * Responsibility: Display fare calculation and proceed button with enhanced UI
 */
export default function FareSummary({ seatCount, farePerSeat, onProceed }) {
  const baseFare = seatCount * farePerSeat;
  const taxes = Math.round(baseFare * 0.05); // 5% tax
  const total = baseFare + taxes;

  const handleClick = () => {
    console.log('FareSummary button clicked');
    console.log('onProceed function:', onProceed);
    if (onProceed) {
      onProceed();
    } else {
      console.error('onProceed is not defined');
    }
  };

  return (
    <div className="bg-gradient-to-r from-violet-50 to-violet-100 rounded-2xl p-6 border-2 border-violet-200 shadow-lg">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        {/* Fare Breakdown */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-violet-600 rounded-full flex items-center justify-center">
              <CurrencyRupeeIcon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Fare Summary</h3>
          </div>

          <div className="bg-white rounded-xl p-4 border border-violet-200 space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <TicketIcon className="w-4 h-4 text-violet-600" />
                <span className="text-sm text-gray-600">Base Fare ({seatCount} × ₹{farePerSeat})</span>
              </div>
              <span className="font-semibold text-gray-900">₹{baseFare}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Taxes & Fees (5%)</span>
              <span className="font-semibold text-gray-900">₹{taxes}</span>
            </div>
            
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total Amount</span>
                <span className="text-2xl font-bold text-violet-600">₹{total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Proceed Section */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              {seatCount > 0 ? `${seatCount} seat(s) selected` : "No seats selected"}
            </p>
            {seatCount > 0 && (
              <div className="flex items-center justify-center gap-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Ready to proceed</span>
              </div>
            )}
          </div>

          <button
            disabled={seatCount === 0}
            onClick={handleClick}
            className={`w-full max-w-xs shadow-lg hover:shadow-xl flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold border-2 transition-all rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 ${
              seatCount === 0 
                ? 'bg-gray-400 text-gray-600 border-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white border-violet-600'
            }`}
          >
            <span>Continue</span>
            <ArrowRightIcon className="w-4 h-4" />
          </button>

          {seatCount === 0 && (
            <p className="text-xs text-gray-500 text-center">
              Please select at least one seat to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
}