import TrainInfoCard from "./TrainInfoCard";
import PassengerForm from "./PassengerForm";
import ContactInfo from "./ContactInfo";
import PaymentMode from "./PaymentMode";
import FareSummary from "./FareSummary";

const BookingPage = () => {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <TrainInfoCard />
      <PassengerForm />

      <div className="grid grid-cols-2 gap-6">
        <ContactInfo />
        <PaymentMode />
      </div>

      <FareSummary />
    </div>
  );
};

export default BookingPage;
