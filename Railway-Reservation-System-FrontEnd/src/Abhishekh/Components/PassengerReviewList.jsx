import PassengerReviewCard from "./PassengerReviewCard";

const PassengerReviewList = ({ passengers }) => {
  return (
    <div className="space-y-4">
      {passengers.map((p, index) => (
        <PassengerReviewCard
          key={p.id}
          passenger={p}
          index={index + 1}
        />
      ))}
    </div>
  );
};

export default PassengerReviewList;
