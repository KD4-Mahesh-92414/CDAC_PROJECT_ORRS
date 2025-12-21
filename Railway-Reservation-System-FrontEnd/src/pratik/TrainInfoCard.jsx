const TrainInfoCard = () => {
  return (
    <div className="bg-yellow-100 border rounded-xl p-4 flex justify-between items-center">
      <div>
        <h2 className="font-semibold text-lg">Nanded → Pune</h2>
        <p className="text-sm">Huzur Sahib Nanded • 17:45 PM</p>
        <p className="text-sm">Pune Station • 12:10 AM</p>
        <p className="text-xs text-gray-600">23 Oct 2025 → 24 Oct 2025</p>
      </div>

      <div className="text-right">
        <p className="font-bold">15065</p>
        <p className="text-sm">Nanded Panvel Express</p>
        <p className="text-green-600 text-sm">Seats Available: 356</p>
      </div>
    </div>
  );
};

export default TrainInfoCard;
