const CoachOption = ({ coach, selectedCoach, onSelect }) => {
  const isActive = selectedCoach?.id === coach.id;

  return (
    <div
      onClick={() => onSelect(coach)}
      className={`border rounded-lg p-4 flex justify-between items-center cursor-pointer
        ${isActive ? "border-blue-600 bg-blue-50" : "hover:bg-gray-50"}`}
    >
      <div className="flex items-center gap-3">
        <input type="radio" checked={isActive} readOnly />
        <span className="font-medium">{coach.name}</span>
      </div>

      <div className="text-sm text-right">
        <p>Available Seat: {coach.available}</p>
        <p>Fare: ₹{coach.fare}</p>
      </div>
    </div>
  );
};

export default CoachOption;
