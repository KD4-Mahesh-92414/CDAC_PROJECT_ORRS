import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import { searchStart, searchSuccess, searchFailure } from "../../store/slices/trainSlice";
import { setSearchData } from "../../store/slices/bookingSlice";
import Calendar from "../ui/Calendar";
import Modal from "../common/Modal";
import { Login } from "../../pages/auth/Login";
import trainService from "../../services/trainService";
import toast from "react-hot-toast";

/**
 * SearchTrain Component
 * Responsibility: Handle train search form UI, validation, and navigation
 * Features: City-based search with autocomplete, backend integration
 */
export default function SearchTrain({ calendarOpenUpward = false }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.trains);
  
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [date, setDate] = useState("");
  const [isSwapping, setIsSwapping] = useState(false);
  const [errors, setErrors] = useState({});
  const [showLogin, setShowLogin] = useState(false);

  const handleSwap = () => {
    setIsSwapping(true);
    setTimeout(() => {
      const temp = fromCity;
      setFromCity(toCity);
      setToCity(temp);
      setIsSwapping(false);
    }, 150);
  };

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
  };

  const handleSearch = async () => {
    const newErrors = {};

    // Simple validation
    if (!fromCity.trim()) {
      newErrors.fromCity = "Please enter departure city";
    }
    if (!toCity.trim()) {
      newErrors.toCity = "Please enter destination city";
    }
    if (fromCity.trim() && toCity.trim() && fromCity.toLowerCase() === toCity.toLowerCase()) {
      newErrors.same = "From and To cities cannot be the same";
    }
    if (!date) {
      newErrors.date = "Please select a date";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      if (!isAuthenticated) {
        toast.error("Please login to search trains");
        setShowLogin(true);
        return;
      }

      try {
        dispatch(searchStart());
        
        const searchParams = {
          fromCity: fromCity.trim(),
          toCity: toCity.trim(),
          date: date, // Calendar component should provide YYYY-MM-DD format
        };

        console.log('Search params:', searchParams);

        // Update booking slice for compatibility
        dispatch(setSearchData(searchParams));

        // Call backend API
        const response = await trainService.searchTrains(searchParams);
        
        console.log('API response:', response);
        
        // Transform backend response to frontend format
        const transformedResults = response.data?.map(train => {
          // Parse days of run string to array
          const parseDaysOfRun = (daysString) => {
            if (!daysString) return ['Daily'];
            
            // Handle different formats
            if (daysString.toLowerCase() === 'daily') {
              return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            }
            
            // Handle comma-separated format like "Mon,Tue,Wed,Thu,Fri,Sat"
            if (daysString.includes(',')) {
              return daysString.split(',').map(day => day.trim());
            }
            
            // Handle space-separated format
            if (daysString.includes(' ')) {
              return daysString.split(' ').map(day => day.trim()).filter(day => day);
            }
            
            // Single day or unknown format
            return [daysString];
          };

          return {
            // Basic train info
            id: train.trainId,
            scheduleId: train.scheduleId,
            trainNumber: train.trainNumber,
            trainName: train.trainName,
            number: train.trainNumber,
            name: train.trainName,
            
            // Journey info
            from: train.sourceStationName,
            to: train.destinationStationName,
            departure: train.departureTime,
            arrival: train.arrivalTime,
            departureTime: train.departureTime,
            arrivalTime: train.arrivalTime,
            duration: `${Math.floor(train.travelDurationMinutes / 60)}h ${train.travelDurationMinutes % 60}m`,
            
            // Station and date info
            departureStation: train.sourceStationName,
            arrivalStation: train.destinationStationName,
            departureDate: searchParams.date,
            arrivalDate: searchParams.date, // Same day for now, could be calculated based on duration
            
            // Station IDs for seat matrix API (populated by backend)
            sourceStationId: train.sourceStationId,
            destinationStationId: train.destinationStationId,
            
            // Days of operation
            daysOfRun: parseDaysOfRun(train.daysOfRun),
            
            // Additional info
            distance: train.distanceKm,
            
            // Coach/class options for ClassOptions component
            coaches: train.classOptions?.map(coach => ({
              coachType: {
                typeCode: coach.coachCode,
                typeName: coach.coachName || coach.coachCode
              },
              type: coach.coachName || coach.coachCode,
              code: coach.coachCode,
              fare: coach.fare,
              available: coach.availableSeats,
              status: coach.status,
              coachTypeId: coach.coachTypeId,
              coachImageUrl: coach.coachImageUrl
            })) || [],
            
            // Legacy classes field for backward compatibility
            classes: train.classOptions?.map(coach => ({
              name: coach.coachName || coach.coachCode,
              code: coach.coachCode,
              price: coach.fare,
              available: coach.availableSeats,
              status: coach.status
            })) || []
          };
        }) || [];

        dispatch(searchSuccess({
          results: transformedResults,
          params: searchParams
        }));

        if (transformedResults.length === 0) {
          toast.error("No trains found for the selected route and date");
        } else {
          toast.success(`Found ${transformedResults.length} trains`);
          navigate("/trains");
        }
      } catch (error) {
        console.error('Search error:', error);
        let errorMessage = "Failed to search trains";
        
        // Handle specific error types
        if (error.message) {
          errorMessage = error.message;
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.status === 400) {
          errorMessage = "Invalid search parameters. Please check your input.";
        } else if (error.response?.status === 404) {
          errorMessage = "No trains found for the selected route.";
        } else if (error.response?.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
        
        dispatch(searchFailure(errorMessage));
        toast.error(errorMessage);
      }
    } else {
      toast.error("Please fill all required fields correctly");
    }
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
    // After login, proceed with search
    handleSearch();
  };

  return (
    <>
      <div className="flex justify-center">
        <div className="relative w-full max-w-[900px] rounded-3xl bg-white/95 backdrop-blur-lg shadow-2xl shadow-violet-900/30 p-9 border border-white/20">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative flex w-full md:w-[520px] h-[80px] border-2 border-violet-600 bg-gradient-to-r from-white via-violet-50/30 to-white rounded-2xl overflow-hidden hover:shadow-lg hover:border-violet-700 transition-all duration-300 hover:scale-[1.02]">
              <div className="w-1/2 flex items-center justify-center px-4">
                <input
                  type="text"
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  placeholder="From"
                  className="w-full h-full text-center outline-none text-lg bg-transparent placeholder:text-gray-600 font-medium"
                />
              </div>
              <div className="w-[2px] bg-gradient-to-b from-violet-500 via-violet-700 to-violet-500" />
              <div className="w-1/2 flex items-center justify-center px-4">
                <input
                  type="text"
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  placeholder="To"
                  className="w-full h-full text-center outline-none text-lg bg-transparent placeholder:text-gray-600 font-medium"
                />
              </div>
              <button
                onClick={handleSwap}
                disabled={isSwapping}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-white to-violet-50 border-2 border-violet-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 hover:border-violet-700 disabled:opacity-50 group cursor-pointer"
              >
                <ArrowsRightLeftIcon className="w-6 h-6 text-violet-600 group-hover:text-violet-700 transition-colors duration-200" />
              </button>
            </div>

            {/* Calendar Component */}
            <Calendar 
              selectedDate={date}
              onDateChange={handleDateChange}
              placeholder="dd/mm/yyyy"
              openUpward={calendarOpenUpward}
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="absolute right-9 -bottom-5 w-[120px] h-[46px] rounded-xl text-white font-semibold bg-gradient-to-r from-violet-600 to-violet-700 shadow-xl shadow-violet-400/40 hover:from-violet-700 hover:to-violet-800 hover:border-violet-700 hover:shadow-2xl hover:shadow-violet-500/50 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center justify-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {isLoading ? "Searching..." : "Search"}
            </span>
          </button>
        </div>
      </div>

      {/* Error Messages - Below the search component */}
      {Object.keys(errors).length > 0 && (
        <div className="mt-4 max-w-[900px] mx-auto bg-red-50 border border-red-300 rounded-lg p-3">
          {errors.fromCity && <p className="text-red-600 text-sm">{errors.fromCity}</p>}
          {errors.toCity && <p className="text-red-600 text-sm">{errors.toCity}</p>}
          {errors.same && <p className="text-red-600 text-sm">{errors.same}</p>}
          {errors.date && <p className="text-red-600 text-sm">{errors.date}</p>}
        </div>
      )}

      {/* Login Modal */}
      <Modal open={showLogin} onClose={() => setShowLogin(false)}>
        <Login onLoginSuccess={handleLoginSuccess} />
      </Modal>
    </>
  );
}
