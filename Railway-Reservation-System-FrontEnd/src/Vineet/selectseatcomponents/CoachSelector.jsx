const CoachSelector = ({ selectedCoach, setSelectedCoach, farePerSeat, seatCount=0 }) => {
  const coaches = ["H1", "H2", "H3", "H4"];

    const totalFare = farePerSeat * seatCount;


  //console.log("CoachSelector render → fare:", farePerSeat);

  return (
    <div className="flex justify-between items-center mt-6">
      <div className="flex gap-4">
        {coaches.map((coach) => (
          <button
            key={coach}
            onClick={() => setSelectedCoach(coach)}
            className={`px-6 py-4 rounded-lg font-semibold border
              ${
                selectedCoach === coach
                  ? "bg-blue-600 text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
          >
            Coach {coach}
          </button>
        ))}
      </div>

      <div className="bg-orange-200 px-6 py-4 rounded-lg font-bold text-lg text-center">
        Fare
        <br />
        ₹ {totalFare}
      </div>
    </div>
  );
};

export default CoachSelector;
