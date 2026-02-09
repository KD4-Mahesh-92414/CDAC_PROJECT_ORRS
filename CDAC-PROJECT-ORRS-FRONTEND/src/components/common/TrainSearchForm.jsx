import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowsRightLeftIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Calendar from "../ui/Calendar";

export default function TrainSearchForm({ 
  initialFrom = "", 
  initialTo = "", 
  initialDate = "",
  onSearch,
  variant = "default", // "default" or "compact"
  calendarOpenUpward = false
}) {
  const navigate = useNavigate();
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [date, setDate] = useState(initialDate);
  const [isSwapping, setIsSwapping] = useState(false);

  useEffect(() => {
    setFrom(initialFrom);
    setTo(initialTo);
    setDate(initialDate);
  }, [initialFrom, initialTo, initialDate]);

  const handleSwap = () => {
    setIsSwapping(true);
    setTimeout(() => {
      const temp = from;
      setFrom(to);
      setTo(temp);
      setIsSwapping(false);
    }, 150);
  };

  const handleSearch = () => {
    if (from.trim() && to.trim() && date) {
      const searchData = {
        from: from.trim(),
        to: to.trim(),
        date: date,
      };
      if (onSearch) {
        onSearch(searchData);
      } else {
        navigate("/trains");
      }
    }
  };

  const isCompact = variant === "compact";

  return (
    <div className={`flex items-center justify-center ${isCompact ? 'gap-4' : 'gap-6'} ${isCompact ? '' : 'flex-col md:flex-row'}`}>
      {/* From/To Section */}
      <div className={`relative flex items-center bg-gray-50 rounded-xl border-2 border-violet-600 overflow-hidden ${isCompact ? 'flex-1 max-w-md' : 'w-full md:w-[520px] h-[80px]'}`}>
        <div className="flex-1 flex items-center">
          <input
            type="text"
            placeholder="From"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className={`w-full ${isCompact ? 'px-4 py-3' : 'px-4'} text-center outline-none bg-transparent text-gray-800 placeholder:text-gray-500 font-medium transition-opacity duration-150 ${
              isSwapping ? "opacity-40" : "opacity-100"
            } ${isCompact ? 'text-sm' : 'text-lg'}`}
          />
        </div>
        
        <div className={`${isCompact ? 'w-px' : 'w-[2px]'} ${isCompact ? 'bg-gray-300' : 'bg-gradient-to-b from-violet-500 via-violet-700 to-violet-500'} ${isCompact ? 'h-8' : 'h-full'}`} />
        
        <div className="flex-1 flex items-center">
          <input
            type="text"
            placeholder="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className={`w-full ${isCompact ? 'px-4 py-3' : 'px-4'} text-center outline-none bg-transparent text-gray-800 placeholder:text-gray-500 font-medium transition-opacity duration-150 ${
              isSwapping ? "opacity-40" : "opacity-100"
            } ${isCompact ? 'text-sm' : 'text-lg'}`}
          />
        </div>
        
        <button
          onClick={handleSwap}
          disabled={isSwapping}
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${isCompact ? 'w-8 h-8' : 'w-12 h-12'} ${isCompact ? 'bg-white' : 'bg-gradient-to-br from-white to-violet-50'} border-2 border-violet-${isCompact ? '500' : '600'} rounded-full flex items-center justify-center shadow-${isCompact ? 'sm' : 'lg'} hover:shadow-${isCompact ? 'md' : 'xl'} transition-all duration-${isCompact ? '200' : '300'} hover:scale-110 active:scale-95 hover:border-violet-${isCompact ? '600' : '700'} disabled:opacity-50 group`}
        >
          <ArrowsRightLeftIcon className={`${isCompact ? 'w-4 h-4' : 'w-6 h-6'} text-violet-600 group-hover:text-violet-700 transition-colors`} />
        </button>
      </div>

      {/* Calendar */}
      <Calendar 
        selectedDate={date}
        onDateChange={setDate}
        placeholder="dd/mm/yyyy"
        openUpward={calendarOpenUpward}
      />

      {/* Search Button */}
      {isCompact && (
        <button
          onClick={handleSearch}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <MagnifyingGlassIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Search</span>
        </button>
      )}

      {!isCompact && (
        <button
          onClick={handleSearch}
          className="absolute right-9 -bottom-5 w-[120px] h-[46px] rounded-xl text-white font-semibold bg-gradient-to-r from-violet-600 to-violet-700 shadow-xl shadow-violet-400/40 hover:from-violet-700 hover:to-violet-800 hover:shadow-2xl hover:shadow-violet-500/50 transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <span className="flex items-center justify-center gap-2">
            <MagnifyingGlassIcon className="w-4 h-4" />
            Search
          </span>
        </button>
      )}
    </div>
  );
}
