import { XMarkIcon } from '@heroicons/react/24/outline';

export default function FormModal({ 
  open, 
  onClose, 
  title, 
  children, 
  onSubmit,
  submitText = "Save",
  loading = false 
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-violet-100">
          <h3 className="text-xl font-bold text-violet-700">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-violet-50 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-6">
          {children}
          
          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-violet-600 border border-transparent rounded-md hover:bg-violet-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}