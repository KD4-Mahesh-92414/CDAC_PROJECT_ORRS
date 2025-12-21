const CoachDetails = ({ coach }) => {
  return (
    <div className="border rounded-xl p-4 h-full flex flex-col">
      {/* 🔒 IMAGE AREA (SIZE LOCKED) */}
      <div className="h-[200px] bg-yellow-100 overflow-hidden">
        {coach?.image ? (
          <img
            src={coach.image}
            alt={coach.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-700">Image of Train Coach</span>
        )}
      </div>

      {/* 🔒 CONTENT AREA (FIXED FLOW) */}
      <div className="flex-1 mt-4 flex flex-col">
        <h3 className="text-lg font-semibold">
          {coach?.name || "Select a Seat"}
        </h3>

        <p className="text-sm text-gray-600 mt-2 line-clamp-3">
          {coach?.description || "Coach details will appear here."}
        </p>
      </div>
    </div>
  );
};

export default CoachDetails;
