import { useState, useEffect } from "react";
import JourneyInfoCard from "./JourneyInfoCard";
import SeatToggle from "./SeatToggle";
import CoachSelector from "./CoachSelector";
import SeatGrid from "./SeatGrid";
import FareSummary from "./FareSummary";
import AutomaticSeatSelection from "./AutomaticSeatSelection";

const coachFareMap = {
  H1: 2500,
  H2: 2200,
  H3: 2000,
  H4: 1800,
};

const SelectSeatsPage = () => {
  const [mode, setMode] = useState("manual");
  const [selectedCoach, setSelectedCoach] = useState("H1");
  const [selectedSeats, setSelectedSeats] = useState([]);

  const farePerSeat = coachFareMap[selectedCoach];
    console.log("Coach:", selectedCoach, "Fare:", farePerSeat);


  // Reset seats when coach changes
  useEffect(() => {
    setSelectedSeats([]);
  }, [selectedCoach]);

  // Auto-seat logic (demo)
  useEffect(() => {
    if (mode === "auto") {
      setSelectedSeats([1, 2, 3]);
    }
  }, [mode]);

  const handleSeatSelect = (seat) => {
    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat]
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Select Seats</h1>

      <JourneyInfoCard />

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Select Seats</h2>
        <SeatToggle mode={mode} setMode={setMode} />
      </div>

      <CoachSelector
        selectedCoach={selectedCoach}
        setSelectedCoach={setSelectedCoach}
        farePerSeat={farePerSeat}
        seatCount={selectedSeats.length}
      />

     {mode === "manual" ? (
  <SeatGrid
    selectedSeats={selectedSeats}
    onSeatSelect={handleSeatSelect}
  />
) : (
  <AutomaticSeatSelection />
)}


      <FareSummary
        seatCount={selectedSeats.length}
        farePerSeat={farePerSeat}
      />
    </div>
  );
};

export default SelectSeatsPage;
