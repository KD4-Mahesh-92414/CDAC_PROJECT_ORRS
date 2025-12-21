import SearchHeader from "./SearchHeader";
import DateFilterBar from "./DateFilterBar";
import TrainResults from "./TrainResults";
import FilterSidebar from "./FilterSidebar";

const TrainSearchPage = () => {
  const trains = [
    {
      id: 1,
      name: "Hujur Sahib Nanded Express",
      days: "Mo, Tu, Sa",
      departureTime: "08:25 AM",
      arrivalTime: "12:10 AM",
      from: "Nanded",
      to: "Pune",
      departureDate: "23 Oct 2025",
      arrivalDate: "24 Oct 2025",
      classes: ["AC 2nd Tier", "AC 3rd Tier", "Sleeper"],
    },
    {
      id: 2,
      name: "Nanded Panvel Express",
      days: "Th, We, Fr",
      departureTime: "17:45 PM",
      arrivalTime: "12:10 AM",
      from: "Nanded",
      to: "Pune",
      departureDate: "23 Oct 2025",
      arrivalDate: "24 Oct 2025",
      classes: ["Sleeper", "AC 1st Tier", "AC Chair Car"],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto border rounded-xl overflow-hidden">
      <SearchHeader />
      <DateFilterBar />

      <div className="grid grid-cols-4">
        <div className="col-span-3">
          <TrainResults trains={trains} />
        </div>
        <FilterSidebar />
      </div>
    </div>
  );
};

export default TrainSearchPage;
