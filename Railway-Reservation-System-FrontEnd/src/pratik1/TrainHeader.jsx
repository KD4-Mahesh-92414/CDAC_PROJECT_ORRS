const TrainHeader = ({ train }) => {
  return (
    <div className="bg-blue-100 p-4 rounded-t-xl grid grid-cols-3 items-center">
      <div>
        <p className="font-semibold">{train.departureTime}</p>
        <p className="text-sm">{train.from}</p>
        <p className="text-xs">{train.departureDate}</p>
      </div>

      <div className="text-center">
        <p className="text-sm">{train.duration}</p>
        <p className="text-xs">→</p>
      </div>

      <div>
        <p className="font-semibold">{train.arrivalTime}</p>
        <p className="text-sm">{train.to}</p>
        <p className="text-xs">{train.arrivalDate}</p>
      </div>
    </div>
  );
};

export default TrainHeader;
