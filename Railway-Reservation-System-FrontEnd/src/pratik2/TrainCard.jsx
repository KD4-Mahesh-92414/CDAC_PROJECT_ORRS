const TrainCard = ({ train }) => {
  return (
    <div className="border rounded-xl p-4 grid grid-cols-4 gap-4">
      {/* Train Info */}
      <div className="col-span-2">
        <p className="font-semibold">{train.name}</p>
        <p className="text-xs text-gray-500">{train.days}</p>

        <div className="flex justify-between mt-3">
          <div>
            <p className="text-xl font-semibold">{train.departureTime}</p>
            <p className="text-sm">{train.from}</p>
            <p className="text-xs">{train.departureDate}</p>
          </div>

          <div>
            <p className="text-xl font-semibold">{train.arrivalTime}</p>
            <p className="text-sm">{train.to}</p>
            <p className="text-xs">{train.arrivalDate}</p>
          </div>
        </div>
      </div>

      {/* Classes */}
      <div className="space-y-2">
        {train.classes.map((cls) => (
          <div
            key={cls}
            className="border rounded px-3 py-1 text-sm text-center"
          >
            {cls}
          </div>
        ))}
      </div>

      {/* Action */}
      <div className="flex items-end">
        <button className="w-full bg-gray-400 text-white py-2 rounded">
          Select Coach
        </button>
      </div>
    </div>
  );
};

export default TrainCard;
