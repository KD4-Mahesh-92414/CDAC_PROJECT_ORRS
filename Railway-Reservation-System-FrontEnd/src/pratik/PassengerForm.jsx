// PassengerForm.jsx
import PassengerCard from "./PassengerCard";

const PassengerForm = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* USE COMPONENT HERE 👇 */}
      <PassengerCard passengerNo={1} />
      <PassengerCard passengerNo={2} />
    </div>
  );
};

export default PassengerForm;
