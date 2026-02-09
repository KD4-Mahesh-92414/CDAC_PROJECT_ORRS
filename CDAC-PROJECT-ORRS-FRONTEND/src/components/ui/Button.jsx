/**
 * Button Component
 * Responsibility: Reusable button with consistent styling and variants
 */
export default function Button({ 
  children, 
  variant = "primary", 
  size = "medium", 
  isSelected = false,
  disabled = false,
  onClick,
  className = "",
  ...props 
}) {
  const baseClasses = "font-semibold border-2 transition-all rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2";
  
  const variants = {
    primary: isSelected 
      ? "bg-violet-600 text-white border-violet-600 shadow-md hover:bg-violet-700"
      : "bg-white text-gray-700 border-violet-400 hover:border-violet-500 hover:bg-violet-50",
    secondary: isSelected
      ? "bg-orange-600 text-white border-orange-600 shadow-md hover:bg-orange-700"
      : "bg-white text-gray-700 border-orange-400 hover:border-orange-500 hover:bg-orange-50",
    success: "bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white border-violet-600",
  };

  const sizes = {
    small: "px-3 py-2 text-sm",
    medium: "px-6 py-3",
    large: "px-8 py-4 text-lg",
    square: "w-10 h-10",
  };

  const disabledClasses = disabled 
    ? "bg-gray-400 text-gray-600 border-gray-400 cursor-not-allowed hover:bg-gray-400 hover:border-gray-400 hover:from-gray-400 hover:to-gray-400"
    : "";

  const finalClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`.trim();

  return (
    <button
      className={finalClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}