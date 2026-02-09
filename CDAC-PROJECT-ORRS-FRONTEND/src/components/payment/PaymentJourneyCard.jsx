import { Card } from '../ui';
import { ArrowRightIcon } from "@heroicons/react/24/outline";

/**
 * PaymentJourneyCard Component
 * Responsibility: Display journey information on payment page with train details
 */
export default function PaymentJourneyCard({ train }) {
  if (!train) return null;

  return (
    <Card>
      {/* Train Info Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{train.number || "15065"}</h2>
          <p className="text-gray-700">{train.name || "Express Train"}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-violet-600">Payment Gateway</p>
        </div>
      </div>

      {/* Journey Timeline */}
      <div className="flex items-center justify-between p-4 bg-violet-100 rounded-lg border border-violet-200">
        {/* Left - Departure */}
        <div>
          <div className="text-xl font-bold text-gray-900">
            {train.departureTime || train.departure || "17:45 PM"}
          </div>
          <p className="text-sm font-semibold text-gray-800">
            {train.departureStation || "Departure Station"}
          </p>
          <p className="text-sm font-medium text-gray-700">
            {train.departureDate || "23 Oct 2025"}
          </p>
        </div>

        {/* Center - Duration with Timeline */}
        <div className="flex-1 mx-6">
          <div className="flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-violet-600"></div>
            <div className="flex-1 border-t-8 border-violet-600 mx-2"></div>
            <div className="mx-3 text-gray-700 font-bold text-sm bg-white px-3 py-1 rounded-full border border-violet-300">
              {train.duration || "6.25 Hrs"}
            </div>
            <div className="flex-1 border-t-8 border-violet-600 mx-2"></div>
            <ArrowRightIcon className="w-6 h-6 text-violet-600" />
          </div>
        </div>

        {/* Right - Arrival */}
        <div className="text-right">
          <div className="text-xl font-bold text-gray-900">
            {train.arrivalTime || train.arrival || "12:10 AM"}
          </div>
          <p className="text-sm font-semibold text-gray-800">
            {train.arrivalStation || "Arrival Station"}
          </p>
          <p className="text-sm font-medium text-gray-700">
            {train.arrivalDate || "24 Oct 2025"}
          </p>
        </div>
      </div>
    </Card>
  );
}
