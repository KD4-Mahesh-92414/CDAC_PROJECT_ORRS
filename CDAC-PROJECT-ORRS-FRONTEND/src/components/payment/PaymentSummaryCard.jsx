import { Card, Button } from '../ui';
import { 
  TicketIcon, 
  UsersIcon, 
  CalendarIcon, 
  BanknotesIcon,
  ReceiptPercentIcon,
  LockClosedIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";

/**
 * PaymentSummaryCard Component
 * Responsibility: Display payment summary with fare breakdown and payment button
 */
export default function PaymentSummaryCard({ 
  train, 
  passengers = [], 
  totalFare, 
  processing, 
  onPayment 
}) {
  const passengerCount = passengers?.length || 0;
  const baseFare = passengerCount * 2500;
  const taxes = Math.round(baseFare * 0.05);

  return (
    <Card className="sticky top-24 h-fit">
      <h3 className="text-lg font-bold text-gray-900 mb-6 pb-2 border-b border-violet-100 flex items-center gap-2">
        <ReceiptPercentIcon className="w-5 h-5 text-violet-600" />
        Payment Summary
      </h3>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center py-2">
          <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <TicketIcon className="w-4 h-4" />
            Train:
          </span>
          <span className="font-semibold text-gray-900">{train?.number || "N/A"}</span>
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <UsersIcon className="w-4 h-4" />
            Passengers:
          </span>
          <span className="font-semibold text-gray-900">{passengerCount}</span>
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            Journey Date:
          </span>
          <span className="font-semibold text-gray-900">{train?.departureDate || "N/A"}</span>
        </div>

        <div className="flex justify-between items-center py-2 border-t border-violet-100 pt-4">
          <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <BanknotesIcon className="w-4 h-4" />
            Base Fare:
          </span>
          <span className="font-semibold text-gray-900">
            ₹{baseFare.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="text-sm font-medium text-gray-600">Taxes & Fees:</span>
          <span className="font-semibold text-gray-900">
            ₹{taxes.toLocaleString()}
          </span>
        </div>
      </div>

      <Card variant="summary" className="mb-6">
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-900">Total Amount:</span>
          <span className="text-2xl font-bold text-violet-600">
            ₹{totalFare?.toLocaleString() || "0"}
          </span>
        </div>
      </Card>

      <Button
        variant="success"
        size="large"
        onClick={onPayment}
        disabled={processing}
        className="w-full"
      >
        {processing ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing Payment...
          </span>
        ) : (
          `Pay ₹${totalFare?.toLocaleString() || "0"}`
        )}
      </Button>

      <div className="flex items-center justify-center gap-3 mt-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <LockClosedIcon className="w-4 h-4 text-green-600" />
          <span>256-bit SSL</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-1">
          <ShieldCheckIcon className="w-4 h-4 text-green-600" />
          <span>Secure Payment</span>
        </div>
      </div>
    </Card>
  );
}
