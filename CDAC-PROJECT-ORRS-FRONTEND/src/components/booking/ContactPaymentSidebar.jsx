import ContactInformationForm from "./ContactInformationForm";
import BookingSummary from "./BookingSummary";

/**
 * ContactPaymentSidebar Component
 * Responsibility: Orchestrate contact info and booking summary
 */
export default function ContactPaymentSidebar({
  contactInfo,
  onContactChange,
  passengers,
  fareData,
  onProceed,
  isValid
}) {
  return (
    <div className="bg-white border-2 border-violet-300 rounded-2xl shadow-sm p-6 sticky top-24">
      <h3 className="text-lg font-bold text-gray-900 mb-6 pb-2 border-b border-violet-100">
        Contact Information
      </h3>

      <div className="space-y-6">
        <ContactInformationForm 
          contactInfo={contactInfo}
          onContactChange={onContactChange}
        />

        <BookingSummary
          passengers={passengers}
          fareData={fareData}
          onProceed={onProceed}
          isValid={isValid}
        />
      </div>
    </div>
  );
}