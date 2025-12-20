const PassengerReviewCard = ({ passenger, index }) => {
  const {
    name,
    gender,
    age,
    fare,
    seatNo,
  } = passenger;

  return (
    <div className="border rounded-xl p-5">
      <h3 className="font-semibold mb-3">
        Passenger {index}
      </h3>

      <div className="flex justify-between flex-wrap gap-y-2">
        <div className="space-x-2">
          <span>Name :</span>
          <span className="font-medium">{name}</span>
        </div>

        <div className="space-x-2">
          <span>Gender :</span>
          <span>{gender}</span>
        </div>

        <div className="space-x-2">
          <span>Age :</span>
          <span>{age}</span>
        </div>

        <div className="space-x-2 font-semibold italic">
          <span>Fare :</span>
          <span>{fare} Rs</span>
        </div>
      </div>

      <div className="flex justify-between mt-4 flex-wrap gap-y-2">
        <div className="italic">
          Journey Date : 23 Oct 2025
        </div>

        <div className="italic">
          Boarding Station : Nanded
        </div>

        <div className="font-semibold">
          Seat No : {seatNo}
        </div>
      </div>
    </div>
  );
};

export default PassengerReviewCard;
