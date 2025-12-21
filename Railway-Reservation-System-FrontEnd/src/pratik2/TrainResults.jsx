import TrainCard from "./TrainCard";

const TrainResults = ({ trains }) => {
  return (
    <div className="space-y-4 p-4">
      {trains.map((train) => (
        <TrainCard key={train.id} train={train} />
      ))}
    </div>
  );
};

export default TrainResults;
