/**
 * FareBreakdown Component
 * Responsibility: Display detailed fare breakdown for review
 */
export default function FareBreakdown({ passengers, fareData }) {
  const passengerCount = passengers.length;
  const baseFare = fareData?.baseFare || passengerCount * 2500;
  const taxes = fareData?.taxes || Math.round(baseFare * 0.05);
  const farePerSeat = fareData?.farePerSeat || 2500;
  const totalFare = fareData?.totalFare || baseFare + taxes;

  return (
    <div className="bg-white border-2 border-violet-100 rounded-2xl shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-violet-100">
        Fare Summary
      </h2>

      <div className="space-y-4">
        <div className="flex justify-between items-center py-3">
          <div>
            <p className="font-medium text-gray-700">Base Fare × {passengerCount}</p>
            <p className="text-sm text-gray-500">₹{farePerSeat} per passenger</p>
          </div>
          <p className="text-lg font-bold text-gray-900">
            ₹{baseFare.toLocaleString()}
          </p>
        </div>

        <div className="flex justify-between items-center py-3 border-t border-violet-100">
          <p className="font-medium text-gray-700">Taxes & Service Charges (5%)</p>
          <p className="text-lg font-bold text-gray-900">
            ₹{taxes.toLocaleString()}
          </p>
        </div>

        <div className="bg-violet-50 rounded-xl p-4 border-l-4 border-violet-500 mt-6">
          <div className="flex justify-between items-center">
            <p className="text-xl font-bold text-gray-900">Total Amount</p>
            <p className="text-3xl font-bold text-violet-600">₹{totalFare.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}