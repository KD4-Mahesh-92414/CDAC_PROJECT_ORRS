import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setPassengers } from "../../store/slices/bookingSlice";
import PassengerCard from "../../components/forms/PassengerCard";
import { JourneyInfoCard } from "../../components/seats";
import { 
  SelectedSeatsDisplay, 
  PassengerDetailsHeader,
  ContactPaymentSidebar 
} from "../../components/booking";
import useSeatMatrix from "../../hooks/useSeatMatrix";
import toast from "react-hot-toast";

/**
 * PassengerDetails Page
 * Responsibility: Orchestrate passenger details collection flow
 */
export default function PassengerDetails() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedTrain, selectedSeats, passengers, fareData, reservationData } = useSelector((state) => state.booking);
  const { reserveSeats, confirmBooking } = useSeatMatrix();
  const [contactInfo, setContactInfo] = useState({
    email: ""
  });

  useEffect(() => {
    if (!selectedTrain || selectedSeats.length === 0) {
      navigate("/");
      return;
    }

    // Calculate actual seat count (handle both old and new seat formats)
    const seatCount = selectedSeats.length;

    // Initialize with existing passengers or empty forms based on actual seat count
    if (passengers.length !== seatCount) {
      const newPassengers = Array(seatCount)
        .fill(null)
        .map((_, i) => ({
          id: `passenger-${i}`, // Simple, stable ID based on index
          name: "",
          age: "",
          gender: "Male",
          country: "India",
          seatInfo: selectedSeats[i], // Store seat info for reference
        }));
      dispatch(setPassengers(newPassengers));
    }
  }, [selectedTrain, selectedSeats, navigate, passengers.length, dispatch]);

  const handlePassengerChange = useCallback((index, field, value) => {
    console.log(`Updating passenger ${index}, field: ${field}, value: ${value}`);
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value,
    };
    console.log('Updated passengers:', updatedPassengers);
    dispatch(setPassengers(updatedPassengers));
  }, [passengers, dispatch]);

  const validateForm = () => {
    const allFilled = passengers.every(
      (p) => p.name && p.age && p.gender && p.country
    );
    const validEmail = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
      contactInfo.email
    );
    return allFilled && validEmail;
  };

  const handleContinue = () => {
    if (!validateForm()) {
      if (!passengers.every((p) => p.name && p.age && p.gender && p.country)) {
        toast.error("Please fill in all passenger details");
        return;
      }
      if (!/^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(contactInfo.email)) {
        toast.error("Please enter a valid email address");
        return;
      }
    }

    // Navigate to review page instead of booking directly
    navigate("/review");
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Reservation Timer - Show when seats are reserved */}
      {reservationData && (
        <div className="bg-orange-100 border-2 border-orange-300 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-orange-700">
                Seats Reserved - Complete booking soon
              </span>
            </div>
            <div className="text-xs text-orange-600">
              Reserved seats: {reservationData.lockedSeats?.join(', ')}
            </div>
          </div>
        </div>
      )}

      <JourneyInfoCard train={selectedTrain} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Passengers Form */}
        <div className="lg:col-span-2">
          <PassengerDetailsHeader seatCount={selectedSeats.length} />
          
          <SelectedSeatsDisplay selectedSeats={selectedSeats} />
          
          <div className="space-y-4">
            {passengers.map((passenger, index) => (
              <PassengerCard
                key={`passenger-${index}`}
                passengerNo={index + 1}
                passenger={passenger}
                seatInfo={selectedSeats[index]}
                onPassengerChange={handlePassengerChange}
              />
            ))}
          </div>
        </div>

        {/* Contact Info & Summary Sidebar */}
        <div className="space-y-6">
          <ContactPaymentSidebar
            contactInfo={contactInfo}
            onContactChange={setContactInfo}
            passengers={passengers}
            fareData={fareData}
            onProceed={handleContinue}
            isValid={validateForm()}
          />
        </div>
      </div>
    </div>
  );
}
