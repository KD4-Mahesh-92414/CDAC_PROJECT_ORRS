import Button from "../ui/Button";
import { CurrencyRupeeIcon } from "@heroicons/react/24/outline";

/**
 * CoachSelector Component
 * Responsibility: Handle coach selection and display total fare with backend coach data
 */
export default function CoachSelector({ 
  coaches = [],
  selectedCoach, 
  onCoachSelect, 
  farePerSeat, 
  seatCount = 0,
  allSelectedSeats = []
}) {
  const totalFare = farePerSeat * seatCount;

  // Count seats per coach
  const getSeatsPerCoach = (coach) => {
    return allSelectedSeats.filter(seat => 
      typeof seat === 'object' ? seat.coach === coach : false
    ).length;
  };

  // If no coaches from backend, show loading or empty state
  if (!coaches || coaches.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border-2 border-violet-200 shadow-lg">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Coach</h3>
            <div className="text-center py-4">
              <p className="text-gray-500">Loading coaches...</p>
            </div>
          </div>
          
          {/* Show fare even when loading */}
          <div className="bg-gradient-to-r from-violet-50 to-violet-100 px-6 py-4 rounded-xl border-2 border-violet-200 min-w-[200px]">
            <div className="flex items-center gap-2 mb-2">
              <CurrencyRupeeIcon className="w-5 h-5 text-violet-600" />
              <span className="text-sm font-medium text-violet-600">Total Amount</span>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-violet-700">₹{totalFare}</p>
              {seatCount > 0 && (
                <p className="text-xs text-gray-600 mt-1">
                  {seatCount} seat(s) selected
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-violet-200 shadow-lg">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        {/* Coach Selection */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Coach</h3>
          <div className="flex gap-3 flex-wrap">
            {coaches.map((coach) => {
              const seatsInCoach = getSeatsPerCoach(coach);
              return (
                <div key={coach} className="relative">
                  <Button
                    isSelected={selectedCoach === coach}
                    onClick={() => onCoachSelect(coach)}
                    className="min-w-[100px]"
                  >
                    Coach {coach}
                  </Button>
                  {seatsInCoach > 0 && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-violet-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {seatsInCoach}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Fare Display */}
        <div className="bg-gradient-to-r from-violet-50 to-violet-100 px-6 py-4 rounded-xl border-2 border-violet-200 min-w-[200px]">
          <div className="flex items-center gap-2 mb-2">
            <CurrencyRupeeIcon className="w-5 h-5 text-violet-600" />
            <span className="text-sm font-medium text-violet-600">Total Amount</span>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-violet-700">₹{totalFare}</p>
            {seatCount > 0 && (
              <p className="text-xs text-gray-600 mt-1">
                {seatCount} seat(s) selected
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}