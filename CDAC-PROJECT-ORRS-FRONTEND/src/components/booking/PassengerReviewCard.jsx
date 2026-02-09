/**
 * PassengerReviewCard Component
 * Responsibility: Display individual passenger details in a responsive card format
 */
export default function PassengerReviewCard({ 
  passenger, 
  passengerIndex, 
  seatInfo, 
  farePerSeat 
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Passenger Info */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Passenger {passengerIndex + 1}
            </h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800 w-fit">
              Seat: {typeof seatInfo === 'object' ? `${seatInfo.coach}-${seatInfo.seatNumber}` : seatInfo}
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
            <div>
              <span className="text-gray-500">Name:</span>
              <p className="font-medium text-gray-900">{passenger.name}</p>
            </div>
            <div>
              <span className="text-gray-500">Age:</span>
              <p className="font-medium text-gray-900">{passenger.age}</p>
            </div>
            <div>
              <span className="text-gray-500">Gender:</span>
              <p className="font-medium text-gray-900">{passenger.gender}</p>
            </div>
            <div>
              <span className="text-gray-500">Country:</span>
              <p className="font-medium text-gray-900">{passenger.country}</p>
            </div>
          </div>
        </div>
        
        {/* Fare Info */}
        <div className="flex-shrink-0 text-right sm:text-left">
          <p className="text-lg font-bold text-violet-600">₹{farePerSeat}</p>
          <p className="text-xs text-gray-500">per seat</p>
        </div>
      </div>
    </div>
  );
}