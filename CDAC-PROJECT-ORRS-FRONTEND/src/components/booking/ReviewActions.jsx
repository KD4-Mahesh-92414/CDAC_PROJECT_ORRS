/**
 * ReviewActions Component
 * Responsibility: Handle review page action buttons (modify/proceed)
 */
export default function ReviewActions({ onModify, onProceed }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <button
        onClick={onModify}
        className="flex-1 bg-white border-2 border-violet-600 text-violet-600 hover:bg-violet-50 font-semibold py-4 rounded-xl transition-all duration-200"
      >
        ← Modify Details
      </button>
      <button
        onClick={onProceed}
        className="flex-1 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white font-semibold py-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
      >
        Proceed to Payment →
      </button>
    </div>
  );
}