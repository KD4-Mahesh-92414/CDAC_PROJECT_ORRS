/**
 * SelectedSeatsDisplay Component
 * Responsibility: Display selected seats information in a clean format
 */
export default function SelectedSeatsDisplay({ selectedSeats }) {
  if (!selectedSeats || selectedSeats.length === 0) return null;

  return (
    <div className="bg-violet-50 rounded-xl p-4 border border-violet-200 mb-6">
      <h3 className="text-sm font-semibold text-violet-700 mb-2">Selected Seats:</h3>
      <div className="flex flex-wrap gap-2">
        {selectedSeats.map((seat, index) => {
          const seatDisplay = typeof seat === 'object' 
            ? `${seat.seatNumber} (Coach ${seat.coach})` 
            : `Seat ${seat}`;
          return (
            <span 
              key={index}
              className="bg-white px-3 py-1 rounded-full text-sm font-medium text-violet-700 border border-violet-300"
            >
              {seatDisplay}
            </span>
          );
        })}
      </div>
    </div>
  );
}