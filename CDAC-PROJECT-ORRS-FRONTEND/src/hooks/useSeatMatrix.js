import { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setReservationData, clearReservationData } from '../store/slices/bookingSlice';
import { seatService, bookingService } from '../services';
import toast from 'react-hot-toast';

/**
 * useSeatMatrix Hook
 * Responsibility: Manage seat selection and booking flow
 */
export default function useSeatMatrix() {
  const [seatMatrix, setSeatMatrix] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const dispatch = useDispatch();
  const { selectedTrain, searchData, reservationData } = useSelector((state) => state.booking);

  // Function to fetch seat matrix
  const fetchSeatMatrix = useCallback(async (coachTypeId) => {
    if (!selectedTrain || !coachTypeId) {
      throw new Error('Missing required data for seat matrix');
    }

    if (!selectedTrain.sourceStationId || !selectedTrain.destinationStationId) {
      throw new Error('Missing station IDs in selected train');
    }

    try {
      setIsLoading(true);
      setError(null);

      const params = {
        scheduleId: selectedTrain.scheduleId,
        coachTypeId: coachTypeId,
        sourceStationId: selectedTrain.sourceStationId,
        destinationStationId: selectedTrain.destinationStationId
      };

      console.log('Fetching seat matrix for:', params);
      
      const response = await seatService.getSeatMatrix(params);
      
      if (response && response.length > 0) {
        setSeatMatrix(response);
        console.log('Seat matrix loaded:', response);
        return response;
      } else {
        throw new Error('No seat data available');
      }
    } catch (err) {
      console.error('Failed to fetch seat matrix:', err);
      setError(err.message);
      toast.error(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [selectedTrain]);

  // Reserve selected seats
  const reserveSeats = useCallback(async (selectedSeats, coachTypeId) => {
    if (!selectedTrain || !selectedSeats.length) {
      throw new Error('No seats selected');
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log('=== RESERVE SEATS DEBUG ===');
      console.log('Selected Train:', selectedTrain);
      console.log('Selected Seats:', selectedSeats);
      console.log('Coach Type ID:', coachTypeId);

      const params = {
        scheduleId: selectedTrain.scheduleId,
        coachTypeId: coachTypeId,
        sourceStationId: selectedTrain.sourceStationId,
        destinationStationId: selectedTrain.destinationStationId,
        selectedSeats: bookingService.formatSelectedSeats(selectedSeats),
        sessionId: bookingService.generateSessionId()
      };

      console.log('Formatted params:', JSON.stringify(params, null, 2));
      
      const response = await seatService.reserveSeats(params);
      
      if (response.status === 'SUCCESS') {
        dispatch(setReservationData(response.data));
        toast.success('Seats reserved successfully!');
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to reserve seats');
      }
    } catch (err) {
      console.error('Failed to reserve seats:', err);
      setError(err.message);
      toast.error(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [selectedTrain]);

  // Confirm booking with passenger details
  const confirmBooking = useCallback(async (passengers, contactInfo) => {
    console.log('=== CONFIRM BOOKING DEBUG ===');
    console.log('reservationData:', reservationData);
    console.log('selectedTrain:', selectedTrain);
    
    if (!reservationData) {
      throw new Error('No active reservation found');
    }

    try {
      setIsLoading(true);
      setError(null);

      // Get fare per seat from selected train's coach
      const farePerSeat = selectedTrain?.selectedCoach?.fare || 500;

      const bookingData = {
        reservationId: reservationData.reservationId,
        sourceStationId: selectedTrain.sourceStationId,
        destStationId: selectedTrain.destinationStationId,
        farePerSeat: farePerSeat, // Send calculated fare from frontend
        passengers: passengers.map(passenger => ({
          name: passenger.name,
          age: parseInt(passenger.age),
          gender: passenger.gender?.toUpperCase() || 'MALE',
          seatPreference: passenger.seatPreference || 'WINDOW'
        })),
        contactEmail: contactInfo.email,
        contactPhone: contactInfo.phone || '9876543210'
      };

      console.log('Sending booking data with fare:', bookingData);

      const response = await bookingService.confirmBooking(bookingData);
      
      if (response && response.status === 'SUCCESS') {
        dispatch(clearReservationData());
        toast.success(`Booking confirmed! PNR: ${response.data.pnrNumber}`);
        return bookingService.transformBookingData(response);
      } else {
        throw new Error(response?.message || 'Failed to confirm booking');
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [reservationData, selectedTrain]);

  // Check reservation status
  const checkReservationStatus = useCallback(async () => {
    if (!reservationData?.reservationId) return null;

    try {
      const response = await seatService.checkReservationStatus(reservationData.reservationId);
      return response;
    } catch (err) {
      console.error('Error checking reservation status:', err);
      return null;
    }
  }, [reservationData]);

  // Get seats for a specific coach
  const getSeatsForCoach = useCallback((coachLabel) => {
    const coach = seatMatrix.find(c => c.coachLabel === coachLabel);
    return coach ? coach.seats : [];
  }, [seatMatrix]);

  // Check if a seat is available
  const isSeatAvailable = useCallback((seatNumber, coachLabel) => {
    const seats = getSeatsForCoach(coachLabel);
    const seat = seats.find(s => s.seatNumber === seatNumber);
    return seat ? seat.status === 'AVAILABLE' : false;
  }, [getSeatsForCoach]);

  // Get seat status
  const getSeatStatus = useCallback((seatNumber, coachLabel) => {
    const seats = getSeatsForCoach(coachLabel);
    const seat = seats.find(s => s.seatNumber === seatNumber);
    return seat ? seat.status : 'UNKNOWN';
  }, [getSeatsForCoach]);

  // Get seat type
  const getSeatType = useCallback((seatNumber, coachLabel) => {
    const seats = getSeatsForCoach(coachLabel);
    const seat = seats.find(s => s.seatNumber === seatNumber);
    return seat ? seat.seatType : 'UNKNOWN';
  }, [getSeatsForCoach]);

  // Clear seat matrix data
  const clearSeatMatrix = useCallback(() => {
    setSeatMatrix([]);
    dispatch(clearReservationData());
    setError(null);
    setIsLoading(false);
  }, [dispatch]);

  return {
    seatMatrix,
    isLoading,
    error,
    reservationData,
    fetchSeatMatrix,
    reserveSeats,
    confirmBooking,
    getSeatsForCoach,
    isSeatAvailable,
    getSeatStatus,
    getSeatType,
    clearSeatMatrix,
    checkReservationStatus
  };
}