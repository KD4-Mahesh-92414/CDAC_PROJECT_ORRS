import PassengerReviewCard from "./PassengerReviewCard";

/**
 * PassengerReviewSection Component
 * Responsibility: Display all passengers in review format with header
 */
export default function PassengerReviewSection({ 
  passengers, 
  selectedSeats, 
  farePerSeat 
}) {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Passenger Details</h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Review details for {passengers.length} passenger{passengers.length > 1 ? 's' : ''}
        </p>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        {passengers.map((passenger, index) => (
          <PassengerReviewCard
            key={index}
            passenger={passenger}
            passengerIndex={index}
            seatInfo={selectedSeats[index]}
            farePerSeat={farePerSeat}
          />
        ))}
      </div>
    </div>
  );
}