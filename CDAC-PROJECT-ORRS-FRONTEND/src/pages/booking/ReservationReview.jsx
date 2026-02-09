import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { JourneyInfoCard } from "../../components/seats";
import { 
  PassengerReviewSection, 
  FareBreakdown, 
  ReviewActions 
} from "../../components/booking";
import useSeatMatrix from "../../hooks/useSeatMatrix";
import toast from "react-hot-toast";

/**
 * ReservationReview Page
 * Responsibility: Orchestrate booking review flow and seat reservation
 */
export default function ReservationReview() {
  const navigate = useNavigate();
  const { selectedTrain, selectedSeats, passengers, fareData } = useSelector((state) => state.booking);
  const { reserveSeats } = useSeatMatrix();
  const [isReserving, setIsReserving] = useState(false);

  useEffect(() => {
    if (
      !selectedTrain ||
      selectedSeats.length === 0 ||
      passengers.length === 0
    ) {
      navigate("/");
      return;
    }
  }, [selectedTrain, selectedSeats, passengers, navigate]);

  const handleModifyDetails = () => {
    navigate("/passengers");
  };

  const handleProceedToPayment = async () => {
    try {
      setIsReserving(true);
      
      console.log('=== RESERVE SEATS DEBUG ===');
      console.log('selectedSeats:', selectedSeats);
      console.log('selectedTrain:', selectedTrain);
      
      // Reserve seats before proceeding to payment
      const reservationResult = await reserveSeats(selectedSeats, selectedTrain.selectedCoach.coachTypeId);
      
      console.log('Reservation result:', reservationResult);
      
      // Only navigate if reservation was successful
      if (reservationResult && reservationResult.reservationId) {
        navigate("/payment");
      } else {
        throw new Error('Seat reservation failed - no reservation ID received');
      }
    } catch (error) {
      console.error('Failed to reserve seats:', error);
      toast.error('Failed to reserve seats. Please try again.');
    } finally {
      setIsReserving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <JourneyInfoCard train={selectedTrain} />

      <PassengerReviewSection
        passengers={passengers}
        selectedSeats={selectedSeats}
        farePerSeat={fareData?.farePerSeat || 2500}
      />

      <FareBreakdown
        passengers={passengers}
        fareData={fareData}
      />

      <ReviewActions
        onModify={handleModifyDetails}
        onProceed={handleProceedToPayment}
        isLoading={isReserving}
        proceedText={isReserving ? "Reserving Seats..." : "Proceed to Payment"}
      />
    </div>
  );
}
