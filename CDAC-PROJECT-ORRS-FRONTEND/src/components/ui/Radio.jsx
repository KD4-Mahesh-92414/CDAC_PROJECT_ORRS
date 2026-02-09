/**
 * Radio Component
 * Responsibility: Reusable radio button with consistent styling
 */
export default function Radio({ 
  label,
  description,
  icon,
  checked,
  onChange,
  value,
  name,
  className = "",
  ...props 
}) {
  return (
    <label
      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
        checked
          ? "border-violet-500 bg-violet-50"
          : "border-violet-200 hover:border-violet-400"
      } ${className}`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-violet-600 border-gray-300 focus:ring-violet-500"
        {...props}
      />
      {icon && <span className="text-2xl">{icon}</span>}
      <div>
        <p className="font-semibold text-gray-900">{label}</p>
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </div>
    </label>
  );
}
