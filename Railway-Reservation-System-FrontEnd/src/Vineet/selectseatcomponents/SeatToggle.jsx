const SeatToggle = ({ mode, setMode }) => {
  const isAuto = mode === "auto";

  return (
    <div className="flex items-center gap-3">
      <span className={!isAuto ? "font-semibold" : ""}>Manually</span>

      <div
        onClick={() => setMode(isAuto ? "manual" : "auto")}
        className="w-14 h-7 bg-pink-300 rounded-full cursor-pointer relative"
      >
        <div
          className={`w-6 h-6 bg-gray-700 rounded-full absolute top-0.5 transition-all
            ${isAuto ? "left-7" : "left-1"}`}
        />
      </div>

      <span className={isAuto ? "font-semibold" : ""}>Automatically</span>
    </div>
  );
};

export default SeatToggle;
