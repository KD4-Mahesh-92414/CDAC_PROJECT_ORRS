const JourneyInfoCard = () => {
  return (
    <div className="bg-yellow-100 rounded-xl p-6 flex justify-between items-center border">
      {/* Left */}
      <div>
        <p className="text-xl font-bold">17.45 PM</p>
        <p className="italic">Hujur Sahib Nanded Station</p>
        <p className="mt-2">23 Oct 2025</p>
      </div>

      {/* Center */}
      <div className="text-center">
        <p className="text-sm">6.25 Hrs</p>
        <p className="text-xl font-bold">→</p>
      </div>

      {/* Right */}
      <div>
        <p className="text-xl font-bold">12.10 AM</p>
        <p className="italic">Pune Station</p>
        <p className="mt-2">24 Oct 2025</p>
      </div>

      {/* Train Info */}
      <div className="text-right">
        <p className="text-2xl font-bold">15065</p>
        <p>Nanded Panvel Express</p>
        <p className="font-semibold mt-1">Seats Available - 356</p>
      </div>
    </div>
  );
};

export default JourneyInfoCard;
