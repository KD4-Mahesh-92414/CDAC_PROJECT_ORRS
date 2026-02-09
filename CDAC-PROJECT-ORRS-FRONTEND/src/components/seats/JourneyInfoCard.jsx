import { ArrowRightIcon } from "@heroicons/react/24/outline";

/**
 * JourneyInfoCard Component
 * Responsibility: Display train journey information using the same timeline design as JourneyTimeline
 */
export default function JourneyInfoCard({ train }) {
  if (!train) return null;

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-violet-200 shadow-lg">
      {/* Train Info Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{train.number}</h2>
          <p className="text-sm text-gray-600">{train.name}</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-green-700 font-medium">
            {train.coaches?.[0]?.available || 0} Available
          </span>
        </div>
      </div>

      {/* Journey Timeline - Same as JourneyTimeline component */}
      <div className="flex items-center justify-between p-4 bg-violet-100 rounded-lg border border-violet-200">
        <div>
          <div className="text-xl font-bold text-gray-900">
            {train.departure}
          </div>
          <p className="text-sm font-semibold text-gray-800">
            {train.departureStation}
          </p>
          <p className="text-sm font-medium text-gray-700">{train.departureDate}</p>
        </div>

        <div className="flex-1 mx-6">
          <div className="flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-violet-600"></div>
            <div className="flex-1 border-t-8 border-violet-600 mx-2"></div>
            <div className="mx-3 text-gray-700 font-bold text-sm bg-white px-3 py-1 rounded-full border border-violet-300">
              {train.duration}
            </div>
            <div className="flex-1 border-t-8 border-violet-600 mx-2"></div>
            <ArrowRightIcon className="w-6 h-6 text-violet-600" />
          </div>
        </div>

        <div className="text-right">
          <div className="text-xl font-bold text-gray-900">
            {train.arrival}
          </div>
          <p className="text-sm font-semibold text-gray-800">
            {train.arrivalStation}
          </p>
          <p className="text-sm font-medium text-gray-700">{train.arrivalDate}</p>
        </div>
      </div>
    </div>
  );
}