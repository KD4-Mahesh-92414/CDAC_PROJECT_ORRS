const ReviewFooter = ({ passengers }) => {
  const totalFare = passengers.reduce(
    (sum, p) => sum + p.fare,
    0
  );

  return (
    <div className="bg-blue-200 p-6 rounded-xl text-center space-y-4">
      <div className="font-semibold text-lg">
        Total Fare → {passengers.length} × 2500 ={" "}
        <span className="font-bold">{totalFare} Rs</span>
      </div>

      <button className="px-8 py-3 bg-orange-400 rounded-lg font-semibold">
        Proceed To Payment
      </button>
    </div>
  );
};

export default ReviewFooter;
