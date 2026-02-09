import FilterSection from './FilterSection';
import { FunnelIcon, TicketIcon } from "@heroicons/react/24/outline";

/**
 * TrainFilters Component
 * Responsibility: Manage and display all train filtering options
 */
export default function TrainFilters({ 
  filters, 
  activeFilters, 
  availableClasses = [],
  onClassFilter,
  onResetFilters
}) {
  return (
    <div className="space-y-4">
      <div className="bg-white border-2 border-violet-300 rounded-2xl shadow-sm p-6 sticky top-24">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-5 h-5 text-violet-600" />
            <h3 className="text-xl font-bold text-gray-900">Filters</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-sm font-medium">
              {activeFilters} active
            </span>
            {activeFilters > 0 && (
              <button
                onClick={onResetFilters}
                className="text-violet-600 hover:text-violet-700 text-sm font-medium underline"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Travel Class Filter */}
          {availableClasses.length > 0 && (
            <FilterSection
              title={
                <div className="flex items-center gap-2">
                  <TicketIcon className="w-4 h-4 text-violet-600" />
                  <span>Travel Class</span>
                </div>
              }
              items={availableClasses}
              selectedItems={filters.classes}
              onItemClick={onClassFilter}
              multiSelect={true}
              gridLayout={true}
            />
          )}

          {/* Show message if no filters available */}
          {availableClasses.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              <p>No filters available</p>
              <p className="text-sm">Search for trains to see filter options</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}