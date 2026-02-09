import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedSeats, setFareData } from "../store/slices/bookingSlice";
import toast from "react-hot-toast";

/**
 * useSeatSelection Hook
 * Responsibility: Manage seat selection state and business logic with backend integration
 */
export default function useSeatSelection() {
  const dispatch = useDispatch();
  const { selectedSeats, selectedTrain } = useSelector((state) => state.booking);
  const [selectedCoach, setSelectedCoach] = useState(null);

  // Get fare per seat from the selected train's coach data
  const farePerSeat = selectedTrain?.selectedCoach?.fare || 0;

  // Initialize selected coach from the train selection - run only once
  useEffect(() => {
    if (selectedTrain?.selectedCoach && !selectedCoach) {
      const coachId = selectedTrain.selectedCoach.code || selectedTrain.selectedCoach.type;
      console.log('Setting initial selected coach:', coachId, selectedTrain.selectedCoach);
      setSelectedCoach(coachId);
    }
  }, [selectedTrain?.selectedCoach, selectedCoach]);

  // Calculate total fare - simplified dependencies
  useEffect(() => {
    const seatCount = selectedSeats.length;
    const totalBaseFare = farePerSeat * seatCount;
    const taxes = Math.round(totalBaseFare * 0.05);
    const totalFare = totalBaseFare + taxes;
    
    dispatch(setFareData({
      baseFare: totalBaseFare,
      taxes,
      totalFare,
      farePerSeat,
      seatCount,
      selectedCoach
    }));
  }, [selectedSeats.length, farePerSeat, selectedCoach, dispatch]);

  const handleSeatSelect = (seatNumber) => {
    const currentSeats = [...selectedSeats];
    const seatInfo = { seatNumber, coach: selectedCoach };
    
    // Find existing seat with same seat number and coach
    const existingIndex = currentSeats.findIndex(seat => {
      if (typeof seat === 'object' && seat.seatNumber && seat.coach) {
        return seat.seatNumber === seatNumber && seat.coach === selectedCoach;
      }
      return seat === seatNumber;
    });
    
    if (existingIndex !== -1) {
      // Remove seat if already selected
      const updatedSeats = currentSeats.filter((_, index) => index !== existingIndex);
      console.log('Removing seat:', seatInfo, 'Updated seats:', updatedSeats);
      dispatch(setSelectedSeats(updatedSeats));
    } else {
      // Add seat if under limit
      if (currentSeats.length < 6) {
        const updatedSeats = [...currentSeats, seatInfo];
        console.log('Adding seat:', seatInfo, 'Updated seats:', updatedSeats);
        dispatch(setSelectedSeats(updatedSeats));
      } else {
        toast.error('Maximum 6 seats can be selected');
      }
    }
  };

  const handleCoachChange = (coach) => {
    console.log('Changing coach to:', coach);
    setSelectedCoach(coach);
  };

  // Get selected seats for current coach only
  const getCurrentCoachSeats = () => {
    return selectedSeats.filter(seat => 
      typeof seat === 'object' ? seat.coach === selectedCoach : true
    ).map(seat => 
      typeof seat === 'object' ? seat.seatNumber : seat
    );
  };

  return {
    selectedCoach,
    selectedSeats: getCurrentCoachSeats(),
    allSelectedSeats: selectedSeats,
    farePerSeat,
    seatCount: selectedSeats.length, // Total seats across all coaches
    handleSeatSelect,
    handleCoachChange,
  };
}