/**
 * SeatLegend Component
 * Responsibility: Display legend for seat states (Available, Selected, Booked, My Reservation)
 */
export default function SeatLegend() {
  const legendItems = [
    {
      label: "Available",
      className: "w-6 h-6 bg-white border-2 border-violet-400 rounded-lg"
    },
    {
      label: "Selected", 
      className: "w-6 h-6 bg-violet-600 border-2 border-violet-600 rounded-lg"
    },
    {
      label: "Booked",
      className: "w-6 h-6 bg-gray-300 border-2 border-gray-400 rounded-lg"
    },
    {
      label: "My Reservation",
      className: "w-6 h-6 bg-blue-500 border-2 border-blue-500 rounded-lg"
    }
  ];

  return (
    <div className="flex justify-center gap-8 mt-6 pt-4 border-t border-violet-300">
      {legendItems.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <div className={item.className}></div>
          <span className="text-sm text-gray-600 font-medium">{item.label}</span>
        </div>
      ))}
    </div>
  );
}