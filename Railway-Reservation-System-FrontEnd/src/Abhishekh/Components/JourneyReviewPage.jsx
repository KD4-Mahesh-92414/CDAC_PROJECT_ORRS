import PassengerReviewCard from "./PassengerReviewCard";

const JourneyReviewPage = () => {
  // 👉 This will later come from backend / context / redux
  const passengers = [
    {
      id: 1,
      name: "Mahesh Pandurang Raipatwar",
      gender: "Male",
      age: 23,
      fare: 2500,
      seatNo: "H1L8",
    },
    {
      id: 2,
      name: "Vineet Gadhave",
      gender: "Male",
      age: 25,
      fare: 2500,
      seatNo: "H1L11",
    },
    {
      id: 3,
      name: "Abhishek Ramchandra Rupanvar",
      gender: "Male",
      age: 25,
      fare: 2500,
      seatNo: "H1M9",
    },
  ];

  const totalFare = passengers.reduce((sum, p) => sum + p.fare, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Passenger Cards */}
      {passengers.map((p, index) => (
        <PassengerReviewCard key={p.id} passenger={p} index={index + 1} />
      ))}

      {/* Footer */}
      <div className="bg-blue-200 p-6 rounded-xl text-center space-y-4">
        <div className="font-semibold text-lg">
          Total Fare → {passengers.length} × 2500 ={" "}
          <span className="font-bold">{totalFare} Rs</span>
        </div>

        <button
          onClick={() => alert("Button Clicked")}
          className="relative z-50 px-8 py-3 bg-orange-400 rounded-lg font-semibold cursor-pointer"
        >
          Proceed To Payment
        </button>
      </div>
    </div>
  );
};

export default JourneyReviewPage;
