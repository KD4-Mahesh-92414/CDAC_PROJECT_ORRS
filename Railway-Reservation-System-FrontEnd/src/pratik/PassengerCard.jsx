// PassengerCard.jsx
import { useState } from "react";

const PassengerCard = ({ passengerNo }) => {
  const [gender, setGender] = useState("");

  return (
    <div className="border rounded-2xl p-6 mb-6">
      <h2 className="text-lg font-semibold mb-6">Passenger {passengerNo}</h2>

      <div className="grid grid-cols-4 gap-6 items-end">
        {/* Gender */}
        <div>
          <label className="block text-sm mb-2">Gender</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name={`gender-${passengerNo}`}
                checked={gender === "Male"}
                onChange={() => setGender("Male")}
              />
              Male
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name={`gender-${passengerNo}`}
                checked={gender === "Female"}
                onChange={() => setGender("Female")}
              />
              Female
            </label>
          </div>
        </div>

        <input className="border rounded px-3 py-2" placeholder="Name" />
        <input className="border rounded px-3 py-2" placeholder="Age" />
        <input className="border rounded px-3 py-2" placeholder="Country" />
      </div>
    </div>
  );
};

export default PassengerCard;
