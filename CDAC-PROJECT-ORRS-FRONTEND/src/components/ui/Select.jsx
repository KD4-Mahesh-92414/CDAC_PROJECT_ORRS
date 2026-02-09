/**
 * Select Component
 * Responsibility: Reusable select dropdown with consistent styling
 */
export default function Select({ 
  label,
  required = false,
  error,
  options = [],
  placeholder = "Choose an option",
  className = "",
  ...props 
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        className={`w-full px-4 py-3 border-2 border-violet-200 rounded-xl 
          focus:border-violet-500 focus:outline-none transition-colors
          ${error ? 'border-red-500 focus:border-red-500' : ''}
          ${className}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
