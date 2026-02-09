/**
 * Seat Component
 * Responsibility: Render individual seat with selection and booking states from backend
 */
export default function Seat({ 
  number, 
  topLabel, 
  berthType, // L, M, U, SL, SU for Lower, Middle, Upper, Side Lower, Side Upper
  isSelected = false, 
  isBooked = false, 
  isMyReservation = false,
  onSelect 
}) {
  const handleClick = () => {
    if (!isBooked && onSelect) {
      onSelect(number);
    }
  };

  const getSeatClasses = () => {
    const baseClasses = "relative w-8 h-8 flex items-center justify-center rounded-lg border-2 text-xs select-none transition-all duration-200 font-semibold";
    
    if (isMyReservation) {
      return `${baseClasses} bg-blue-500 text-white border-blue-500 cursor-pointer shadow-lg`;
    }
    
    if (isBooked) {
      return `${baseClasses} bg-gray-300 text-gray-500 cursor-not-allowed border-gray-400`;
    }
    
    if (isSelected) {
      return `${baseClasses} bg-violet-600 text-white border-violet-600 cursor-pointer shadow-lg transform scale-105`;
    }
    
    return `${baseClasses} bg-white text-gray-700 border-violet-200 hover:bg-violet-50 hover:border-violet-400 cursor-pointer hover:shadow-md hover:transform hover:scale-105`;
  };

  return (
    <div onClick={handleClick} className={getSeatClasses()}>
      {topLabel && (
        <span className="absolute -top-4 text-xs font-bold text-gray-600">
          {topLabel}
        </span>
      )}
      <span className="text-[10px] font-bold">
        {number}{berthType}
      </span>
    </div>
  );
}