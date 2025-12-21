import { useState } from "react";
import TrainHeader from "./TrainHeader";
import CoachList from "./CoachList";
import CoachDetails from "./CoachDetails";

const TrainResultPage = () => {
  const [selectedCoach, setSelectedCoach] = useState(null);

  const train = {
    departureTime: "17:45 PM",
    arrivalTime: "12:10 AM",
    from: "Nanded Junction",
    to: "Pune Junction",
    departureDate: "23 Oct 2025",
    arrivalDate: "24 Oct 2025",
    duration: "6.25 Hrs",
  };

  const coaches = [
    {
      id: 1,
      name: "AC 1st Tier",
      available: 20,
      fare: 2500,
      description: "Premium AC coach with private cabins.",
    },
    {
      id: 2,
      name: "Sleeper Class",
      available: 123,
      fare: 550,
      description: "Economical sleeper class coach.",
    },
    {
      id: 3,
      name: "AC Chair Car",
      available: 180,
      fare: 1250,
      description: "Comfortable AC seating arrangement.",
    },
    {
      id: 4,
      name: "Chair Car",
      available: 77,
      fare: 320,
      description: "Non-AC seating coach.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto border rounded-xl overflow-hidden">
      {/* ✅ FIX 1: Correct component */}
      <TrainHeader train={train} />

      {/* ✅ FIX 2: LOCK HEIGHT */}
      <div className="grid grid-cols-3 h-[520px]">
        {/* LEFT SIDE */}
        <div className="col-span-2 p-6 flex flex-col">
          <CoachList
            coaches={coaches}
            selectedCoach={selectedCoach}
            setSelectedCoach={setSelectedCoach}
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="p-6 border-l h-full">
          <CoachDetails coach={selectedCoach} />
        </div>
      </div>
    </div>
  );
};

export default TrainResultPage;
