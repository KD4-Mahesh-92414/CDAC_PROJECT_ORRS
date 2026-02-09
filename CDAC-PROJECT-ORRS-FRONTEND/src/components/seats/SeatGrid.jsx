import Seat from "./Seat";
import SideLabel from "./SideLabel";
import SeatLegend from "./SeatLegend";

/**
 * SeatGrid Component
 * Responsibility: Render the complete seat layout grid using backend seat matrix data
 */
export default function SeatGrid({ 
  seatMatrix = [],
  selectedCoach,
  selectedSeats = [],
  onSeatSelect,
  totalSeatCount = 0,
  isSeatAvailable,
  getSeatStatus,
  getSeatType
}) {
  const maxSeats = 6;
  const isMaxReached = totalSeatCount >= maxSeats;

  // Get the current coach data from seat matrix
  const currentCoachData = seatMatrix.find(coach => coach.coachLabel === selectedCoach);
  const seats = currentCoachData ? currentCoachData.seats : [];

  const handleSeatSelect = (seatNumber) => {
    if (isMaxReached && !selectedSeats.includes(seatNumber)) {
      // Don't allow selection if max reached and seat is not already selected
      return;
    }
    
    // Check if seat is available using backend data
    if (!isSeatAvailable(seatNumber, selectedCoach)) {
      return; // Don't allow selection of unavailable seats
    }
    
    onSeatSelect(seatNumber);
  };

  // Group seats by berth arrangement (assuming 8 seats per compartment like in original)
  const renderSeatBlock = (blockSeats) => {
    if (!blockSeats || blockSeats.length === 0) return null;

    // Sort seats by seat number for consistent layout
    const sortedSeats = [...blockSeats].sort((a, b) => a.seatNumber - b.seatNumber);
    
    return (
      <div className="grid grid-cols-[auto_auto_auto_auto] gap-x-2 gap-y-1 flex-shrink-0">
        {sortedSeats.map((seat) => {
          const seatStatus = getSeatStatus(seat.seatNumber, selectedCoach);
          const seatType = getSeatType(seat.seatNumber, selectedCoach);
          
          // Map backend seat types to frontend berth types
          const getBerthType = (backendSeatType) => {
            switch (backendSeatType) {
              case 'LOWER': return 'L';
              case 'MIDDLE': return 'M';
              case 'UPPER': return 'U';
              case 'SIDE_LOWER': return 'SL';
              case 'SIDE_UPPER': return 'SU';
              default: return 'L';
            }
          };

          const isSelected = selectedSeats.includes(seat.seatNumber);
          const isBooked = seatStatus === 'LOCKED' || seatStatus === 'BOOKED';
          const isMyReservation = seatStatus === 'MY_RESERVATION';

          return (
            <Seat
              key={seat.seatNumber}
              number={seat.seatNumber}
              berthType={getBerthType(seatType)}
              isSelected={isSelected}
              isBooked={isBooked}
              isMyReservation={isMyReservation}
              onSelect={handleSeatSelect}
            />
          );
        })}
      </div>
    );
  };

  // Group seats into blocks of 8 (or whatever the layout requires)
  const groupSeatsIntoBlocks = (seats) => {
    const blocks = [];
    const blockSize = 8;
    
    for (let i = 0; i < seats.length; i += blockSize) {
      blocks.push(seats.slice(i, i + blockSize));
    }
    
    return blocks;
  };

  const seatBlocks = groupSeatsIntoBlocks(seats);

  if (!selectedCoach) {
    return (
      <div className="bg-white border-2 border-violet-300 rounded-2xl p-6 shadow-lg">
        <div className="text-center py-8">
          <p className="text-gray-500">Please select a coach to view seats</p>
        </div>
      </div>
    );
  }

  if (seats.length === 0) {
    return (
      <div className="bg-white border-2 border-violet-300 rounded-2xl p-6 shadow-lg">
        <div className="text-center py-8">
          <p className="text-gray-500">No seats available for coach {selectedCoach}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-violet-300 rounded-2xl p-6 shadow-lg">
      {/* Header with seat count info */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Select Your Seats - Coach {selectedCoach}</h3>
          <p className="text-sm text-gray-600">
            Seats 1-{seats.length} available • Scroll horizontally to see all seats
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-gray-600">Selected: </span>
            <span className="font-bold text-violet-600">{totalSeatCount}</span>
            <span className="text-gray-600"> / {maxSeats} (Total)</span>
          </div>
          {isMaxReached && (
            <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium">
              Maximum seats selected
            </div>
          )}
        </div>
      </div>

      {/* Seat Grid */}
      <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-violet-300 scrollbar-track-gray-100">
        <div className="flex gap-4 pb-4 min-w-max px-2">
          {seatBlocks.map((block, blockIndex) => (
            <div key={blockIndex} className="flex flex-col gap-2">
              <div className="text-xs text-gray-500 text-center mb-2">
                Block {blockIndex + 1}
              </div>
              {renderSeatBlock(block)}
            </div>
          ))}
        </div>
        {/* Scroll hint */}
        <div className="text-center text-xs text-gray-500 mt-2">
          ← Scroll left/right to see all seat blocks →
        </div>
      </div>
      
      <SeatLegend />
    </div>
  );
}