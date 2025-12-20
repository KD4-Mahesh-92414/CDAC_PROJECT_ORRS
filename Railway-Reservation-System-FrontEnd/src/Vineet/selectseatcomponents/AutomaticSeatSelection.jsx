import { useState } from "react";
const CounterGroup = ({ title, value, setValue }) => {
  return (
    <div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <div className="flex gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <button
            key={i}
            onClick={() => setValue(i)}
            className={`w-10 h-10 rounded border
              ${value === i ? "bg-gray-400 text-white" : "bg-white"}`}
          >
            {i}
          </button>
        ))}
      </div>
    </div>
  );
};

const AutomaticSeatSelection = () => {
  const [adults, setAdults] = useState(2);
  const [childWithSeat, setChildWithSeat] = useState(1);
  const [childWithoutSeat, setChildWithoutSeat] = useState(0);
  const [berth, setBerth] = useState("Any");

  return (
    <div className="border rounded-xl p-6 grid grid-cols-2 gap-8">
      {/* LEFT */}
      <div className="space-y-6">
        <CounterGroup
          title="Number Of Adults Travelling"
          value={adults}
          setValue={setAdults}
        />

        <CounterGroup
          title="Number Of Child With Seat"
          value={childWithSeat}
          setValue={setChildWithSeat}
        />

        <CounterGroup
          title="Number Of Child Without Seat"
          value={childWithoutSeat}
          setValue={setChildWithoutSeat}
        />
      </div>

      {/* RIGHT */}
      <div>
        <h3 className="font-semibold mb-4">Select Berth Type</h3>
        <div className="space-y-3">
          {["Any", "Lower", "Middle", "Upper"].map((type) => (
            <button
              key={type}
              onClick={() => setBerth(type)}
              className={`w-full py-3 rounded border text-lg
                ${berth === type ? "bg-gray-400 text-white" : "bg-white"}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AutomaticSeatSelection;
