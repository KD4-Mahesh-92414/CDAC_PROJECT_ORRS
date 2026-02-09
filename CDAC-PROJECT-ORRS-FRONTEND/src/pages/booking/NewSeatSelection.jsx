import {
  JourneyInfoCard,
  CoachSelector,
  SeatGrid,
  FareSummary
} from "../../components/seats";
import { useSeatSelection, useSeatNavigation } from "../../hooks";
import useSeatMatrix from "../../hooks/useSeatMatrix";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setReservationData, setSelectedSeats } from "../../store/slices/bookingSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

/**
 * NewSeatSelection Page
 * Responsibility: Complete seat selection and reservation flow
 * 1. Load seat matrix
 * 2. Allow seat selection
 * 3. Reserve seats (5-minute timeout)
 * 4. Navigate to passenger details
 */
export default function NewSeatSelection() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedTrain: train } = useSelector((state) => state.booking);
  
  // Redirect if no train is selected
  useEffect(() => {
    if (!train) {
      console.error('No train selected, redirecting to search');
      navigate('/');
      return;
    }
    console.log('Selected train:', train);
  }, [train, navigate]);
  
  // Use the enhanced seat matrix hook (without reservation in this step)
  const {
    seatMatrix,
    isLoading,
    error,
    fetchSeatMatrix,
    getSeatsForCoach,
    isSeatAvailable,
    getSeatStatus,
    getSeatType
  } = useSeatMatrix();

  const {
    selectedCoach,
    selectedSeats,
    allSelectedSeats,
    farePerSeat,
    seatCount,
    handleSeatSelect,
    handleCoachChange,
  } = useSeatSelection();

  const [hasLoaded, setHasLoaded] = useState(false);

  // Initialize selected coach from train data
  useEffect(() => {
    if (train?.selectedCoach && !selectedCoach) {
      const coachType = train.selectedCoach.type || train.selectedCoach.code;
      console.log('Initializing selected coach:', coachType);
      handleCoachChange(coachType);
    }
  }, [train?.selectedCoach, selectedCoach, handleCoachChange]);

  // Load seat matrix when coach is selected
  useEffect(() => {
    const loadSeatMatrix = async () => {
      if (!train?.selectedCoach?.coachTypeId || !train?.sourceStationId || !train?.destinationStationId) {
        return;
      }

      try {
        console.log('Loading seat matrix for coach type:', train.selectedCoach.coachTypeId);
        await fetchSeatMatrix(train.selectedCoach.coachTypeId);
        console.log('Seat matrix loaded successfully');
      } catch (err) {
        console.error('Failed to load seat matrix:', err);
      }
    };

    loadSeatMatrix();
  }, [train?.selectedCoach?.coachTypeId]); // Only depend on coach type ID

  // Handle proceed to passenger details (no reservation yet)
  const handleProceedToPassengerDetails = () => {
    console.log('Proceeding to passenger details...');
    console.log('Seat count:', seatCount);
    console.log('All selected seats:', allSelectedSeats);
    
    if (seatCount === 0) {
      toast.error('Please select at least one seat');
      return;
    }

    // Just store selected seats and navigate to passenger details
    // No reservation API call yet
    dispatch(setSelectedSeats(allSelectedSeats));
    console.log('Navigating to /passengers');
    navigate('/passengers');
  };

  // Get coaches from seat matrix, fallback to selected coach type
  const coaches = seatMatrix.length > 0 
    ? seatMatrix.map(coach => coach.coachLabel)
    : (train?.selectedCoach ? [train.selectedCoach.type || train.selectedCoach.code] : []);

  // Early return if no train selected
  if (!train) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="text-center py-12 bg-yellow-50 border-2 border-yellow-200 rounded-2xl">
          <p className="text-lg font-semibold text-yellow-700 mb-2">No train selected</p>
          <p className="text-yellow-600 mb-4">Please go back and select a train first.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Go to Search
          </button>
        </div>
      </div>
    );
  }

  if (isLoading && !hasLoaded) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Select Seats</h1>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading seat matrix...</p>
        </div>
      </div>
    );
  }

  if (error && !hasLoaded) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Select Seats</h1>
        <div className="text-center py-12 bg-red-50 border-2 border-red-200 rounded-2xl">
          <p className="text-lg font-semibold text-red-700 mb-2">Error loading seats</p>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/trains')}
            className="flex items-center gap-2 px-4 py-2 text-violet-600 border border-violet-600 rounded-lg hover:bg-violet-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Trains
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Select Seats</h1>
        </div>
      </div>

      <JourneyInfoCard train={train} />

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Choose Your Seats</h2>
        {seatCount > 0 && (
          <div className="text-sm text-gray-600">
            Total selected: <span className="font-bold text-violet-600">{seatCount}</span> seats
          </div>
        )}
      </div>

      {/* Show seat selection instructions */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <p className="text-blue-800 font-medium">
            Select your preferred seats and proceed to enter passenger details
          </p>
        </div>
      </div>

      <CoachSelector
        coaches={coaches}
        selectedCoach={selectedCoach}
        onCoachSelect={handleCoachChange}
        farePerSeat={farePerSeat || train?.selectedCoach?.fare || 0}
        seatCount={seatCount}
        allSelectedSeats={allSelectedSeats}
      />

      <SeatGrid
        seatMatrix={seatMatrix}
        selectedCoach={selectedCoach}
        selectedSeats={selectedSeats}
        onSeatSelect={handleSeatSelect}
        totalSeatCount={seatCount}
        isSeatAvailable={isSeatAvailable}
        getSeatStatus={getSeatStatus}
        getSeatType={getSeatType}
        disabled={false} // Allow seat selection always
      />

      <FareSummary
        seatCount={seatCount}
        farePerSeat={farePerSeat}
        onProceed={handleProceedToPassengerDetails}
        isLoading={isLoading}
        buttonText="Continue to Passenger Details"
        disabled={seatCount === 0}
      />
      
    </div>
  );
}