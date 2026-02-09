/**
 * PassengerDetailsHeader Component
 * Responsibility: Display passenger details section header with seat count
 */
export default function PassengerDetailsHeader({ seatCount }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Passenger Details</h2>
      <p className="text-gray-600 mb-4">
        Fill details for {seatCount} passenger{seatCount > 1 ? 's' : ''}
      </p>
    </div>
  );
}