import { Card } from '../ui';
import { CheckCircleIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

/**
 * TermsCheckbox Component
 * Responsibility: Display terms and conditions checkbox with icons
 */
export default function TermsCheckbox() {
  return (
    <Card variant="summary">
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          defaultChecked
          className="w-4 h-4 mt-1 text-violet-600 border-gray-300 focus:ring-violet-500 rounded"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircleIcon className="w-4 h-4 text-violet-600" />
            <span className="text-sm font-medium text-gray-900">Terms & Conditions</span>
          </div>
          <span className="text-sm text-gray-700">
            I agree to the{" "}
            <span className="text-violet-600 font-medium hover:underline cursor-pointer">
              terms and conditions
            </span>{" "}
            and{" "}
            <span className="text-violet-600 font-medium hover:underline cursor-pointer">
              privacy policy
            </span>
          </span>
        </div>
        <DocumentTextIcon className="w-5 h-5 text-gray-400 group-hover:text-violet-600 transition-colors" />
      </label>
    </Card>
  );
}
