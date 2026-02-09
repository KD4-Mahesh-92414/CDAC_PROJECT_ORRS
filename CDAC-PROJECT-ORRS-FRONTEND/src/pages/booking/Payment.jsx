import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { resetBooking } from "../../store/slices/bookingSlice";
import useSeatMatrix from "../../hooks/useSeatMatrix";
import toast from "react-hot-toast";
import {
  PaymentJourneyCard,
  PaymentMethodCard,
  PaymentFormFields,
  PaymentSummaryCard,
  TermsCheckbox,
} from "../../components/payment";
import { CreditCardIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

/**
 * Payment Page Component
 * Responsibility: Handle final booking confirmation after payment
 */
export default function Payment() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedTrain, passengers, fareData, selectedSeats, reservationData } = useSelector((state) => state.booking);
  const { confirmBooking } = useSeatMatrix();
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("UPI");

  console.log('=== PAYMENT PAGE DEBUG ===');
  console.log('reservationData:', reservationData);
  console.log('selectedTrain:', selectedTrain);
  console.log('passengers:', passengers);

  useEffect(() => {
    if (!selectedTrain || !passengers || passengers.length === 0) {
      navigate("/");
      return;
    }
    
    // Check if we have reservation data, if not redirect back to review
    if (!reservationData) {
      console.warn('No reservation data found, redirecting to review');
      navigate("/review");
      return;
    }
  }, [selectedTrain, passengers, reservationData, navigate]);

  const totalFare = fareData?.totalFare || (passengers?.length || 0) * 2500;

  const handlePayment = async () => {
    try {
      setProcessing(true);
      toast.loading("Processing payment...", { id: "payment" });

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Payment successful!", { id: "payment" });
      toast.loading("Confirming booking...", { id: "booking" });

      // Confirm booking with passenger details
      const contactInfo = { email: "user@example.com" }; // Get from form or state
      const bookingResult = await confirmBooking(passengers, contactInfo);
      
      toast.success(`Booking confirmed! PNR: ${bookingResult.pnrNumber}`, { id: "booking" });
      
      // Navigate to confirmation with booking details
      navigate("/confirmation", { state: { booking: bookingResult } });
      
      // Reset booking state after navigation
      setTimeout(() => {
        dispatch(resetBooking());
      }, 100);
    } catch (error) {
      console.error('Payment/Booking failed:', error);
      toast.error(error.message || 'Booking failed. Please try again.', { id: "payment" });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <CreditCardIcon className="w-8 h-8 text-violet-600" />
            Complete Payment
          </h1>
          <p className="text-gray-600 mt-1">Secure payment for your railway booking</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg border border-green-200">
          <ShieldCheckIcon className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium text-green-800">Secure Checkout</span>
        </div>
      </div>

      <PaymentJourneyCard train={selectedTrain} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <PaymentMethodCard
            selectedMethod={paymentMethod}
            onMethodChange={setPaymentMethod}
          />

          <PaymentFormFields paymentMethod={paymentMethod} />

          <TermsCheckbox />
        </div>

        <PaymentSummaryCard
          train={selectedTrain}
          passengers={passengers}
          totalFare={totalFare}
          processing={processing}
          onPayment={handlePayment}
        />
      </div>
    </div>
  );
}
