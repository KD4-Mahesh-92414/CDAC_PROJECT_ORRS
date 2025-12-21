import { useState } from "react";

const paymentModes = ["UPI", "Card", "Net Banking"];

const PaymentMode = () => {
  const [selectedMode, setSelectedMode] = useState(null);

  const handleSelect = (mode) => {
    // If same mode clicked again → unselect
    if (selectedMode === mode) {
      setSelectedMode(null);
    } else {
      setSelectedMode(mode);
    }
  };

  return (
    <div className="border rounded-xl p-6 w-full max-w-md">
      <h2 className="text-lg font-semibold mb-4">Payment Mode</h2>

      <ul className="space-y-3">
        {paymentModes.map((mode) => (
          <li
            key={mode}
            onClick={() => handleSelect(mode)}
            className={`flex items-center gap-3 cursor-pointer p-2 rounded
              ${
                selectedMode === mode
                  ? "bg-blue-100 border border-blue-500"
                  : "hover:bg-gray-100"
              }`}
          >
            {/* Custom Radio */}
            <span
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                ${
                  selectedMode === mode ? "border-blue-600" : "border-gray-400"
                }`}
            >
              {selectedMode === mode && (
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              )}
            </span>

            <span className="text-sm font-medium">{mode}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PaymentMode;
