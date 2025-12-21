import CoachOption from "./CoachOption";

const CoachList = ({ coaches, selectedCoach, setSelectedCoach }) => {
  return (
    <div className="space-y-3">
      {coaches.map((coach) => (
        <CoachOption
          key={coach.id}
          coach={coach}
          selectedCoach={selectedCoach}
          onSelect={setSelectedCoach}
        />
      ))}

      <button
        disabled={!selectedCoach}
        className="mt-4 w-full bg-gray-400 text-white py-2 rounded disabled:opacity-50"
      >
        Select Seat
      </button>
    </div>
  );
};

export default CoachList;
