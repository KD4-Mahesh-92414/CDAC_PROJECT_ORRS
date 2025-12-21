const FareSummary = () => {
  return (
    <div className="bg-blue-100 p-4 rounded-lg flex justify-between items-center">
      <p className="font-semibold">Total Fare → 3 × 2500 = 7500 Rs</p>

      <button className="bg-orange-400 text-white px-6 py-2 rounded">
        Continue With Booking
      </button>
    </div>
  );
};

export default FareSummary;
