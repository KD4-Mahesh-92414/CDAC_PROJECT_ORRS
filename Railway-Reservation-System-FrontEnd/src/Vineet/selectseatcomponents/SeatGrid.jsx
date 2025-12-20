const Seat = ({ number, topLabel, isSelected, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(number)}
      className={`relative w-7 h-7 flex items-center justify-center rounded border
        text-[9px] select-none cursor-pointer
        ${
          isSelected
            ? "bg-blue-600 text-white"
            : "bg-white hover:bg-green-100"
        }`}
    >
      {/* Label on TOP (used only for lower pair seats) */}
      {topLabel && (
        <span className="absolute -top-3 text-[9px] font-bold">
          {topLabel}
        </span>
      )}

      <span className="font-semibold">{number}</span>
    </div>
  );
};

const SideLabel = ({ text }) => (
  <div className="w-4 text-[9px] font-bold flex items-center justify-center">
    {text}
  </div>
);

const SeatGrid = ({ selectedSeats, onSeatSelect }) => {
  const TOTAL_SEATS = 72;
  const BLOCK_SIZE = 8;
  const blocks = TOTAL_SEATS / BLOCK_SIZE;

  return (
    <div className="border rounded-lg p-3">
      <div className="flex justify-center gap-4">
        {Array.from({ length: blocks }).map((_, blockIndex) => {
          const base = blockIndex * BLOCK_SIZE;
          const isFirst = blockIndex === 0;
          const isLast = blockIndex === blocks - 1;

          return (
            <div
              key={blockIndex}
              className="grid grid-cols-[auto_auto_auto_auto] gap-x-2 gap-y-1"
            >
              {/* Row 1 */}
              <SideLabel text={isFirst ? "L" : ""} />
              <Seat
                number={base + 1}
                isSelected={selectedSeats.includes(base + 1)}
                onSelect={onSeatSelect}
              />
              <Seat
                number={base + 4}
                isSelected={selectedSeats.includes(base + 4)}
                onSelect={onSeatSelect}
              />
              <SideLabel text={isLast ? "L" : ""} />

              {/* Row 2 */}
              <SideLabel text={isFirst ? "M" : ""} />
              <Seat
                number={base + 2}
                isSelected={selectedSeats.includes(base + 2)}
                onSelect={onSeatSelect}
              />
              <Seat
                number={base + 5}
                isSelected={selectedSeats.includes(base + 5)}
                onSelect={onSeatSelect}
              />
              <SideLabel text={isLast ? "M" : ""} />

              {/* Row 3 */}
              <SideLabel text={isFirst ? "U" : ""} />
              <Seat
                number={base + 3}
                isSelected={selectedSeats.includes(base + 3)}
                onSelect={onSeatSelect}
              />
              <Seat
                number={base + 6}
                isSelected={selectedSeats.includes(base + 6)}
                onSelect={onSeatSelect}
              />
              <SideLabel text={isLast ? "U" : ""} />

              {/* Gap */}
              <div className="h-2 col-span-4" />

              {/* Lower side berths */}
              <SideLabel text="" />
              <Seat
                number={base + 7}
                topLabel="L"
                isSelected={selectedSeats.includes(base + 7)}
                onSelect={onSeatSelect}
              />
              <Seat
                number={base + 8}
                topLabel="U"
                isSelected={selectedSeats.includes(base + 8)}
                onSelect={onSeatSelect}
              />
              <SideLabel text="" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SeatGrid;
