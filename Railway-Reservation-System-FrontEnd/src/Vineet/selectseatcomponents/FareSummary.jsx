const FareSummary = ({ seatCount, farePerSeat }) => {
  const total = seatCount * farePerSeat;

  return (
    <div className="bg-blue-200 mt-6 p-6 rounded-xl text-center">
      <p className="text-lg font-semibold">
        Total Fare → {seatCount} × {farePerSeat} ={" "}
        <span className="font-bold">{total} Rs</span>
      </p>

      <button
        disabled={seatCount === 0}
        className="mt-4 px-8 py-3 rounded-lg font-semibold text-white
          bg-orange-400 hover:bg-orange-500
          disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Go To Passenger Details
      </button>
    </div>
  );
};

export default FareSummary;
