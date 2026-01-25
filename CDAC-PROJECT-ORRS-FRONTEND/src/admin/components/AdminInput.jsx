export default function AdminInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  ...props
}) {
  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-900 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 border-2 rounded-xl focus:border-violet-600 focus:outline-none transition-colors ${
          error ? 'border-red-400' : 'border-violet-200'
        }`}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}
