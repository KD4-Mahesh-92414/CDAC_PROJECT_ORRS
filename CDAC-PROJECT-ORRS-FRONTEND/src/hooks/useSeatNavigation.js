import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

/**
 * useSeatNavigation Hook
 * Responsibility: Handle navigation logic and validation for seat selection
 */
export default function useSeatNavigation() {
  const navigate = useNavigate();
  const { selectedTrain, selectedSeats } = useSelector((state) => state.booking);

  // Validate previous steps
  useEffect(() => {
    if (!selectedTrain) {
      navigate("/");
      return;
    }
  }, [selectedTrain, navigate]);

  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat");
      return;
    }
    toast.success(`${selectedSeats.length} seat(s) selected successfully!`);
    navigate("/passengers");
  };

  return {
    selectedTrain,
    handleProceed,
  };
}