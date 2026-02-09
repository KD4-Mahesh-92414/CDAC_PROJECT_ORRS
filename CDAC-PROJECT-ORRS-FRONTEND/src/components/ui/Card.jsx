/**
 * Card Component
 * Responsibility: Reusable card container with consistent styling
 */
export default function Card({ 
  children, 
  variant = "default",
  className = "",
  ...props 
}) {
  const variants = {
    default: "bg-white border-2 border-violet-100 rounded-2xl shadow-sm p-6",
    highlight: "bg-yellow-100 rounded-xl border shadow-sm p-6",
    summary: "bg-violet-50 rounded-xl p-4 border-l-4 border-violet-500",
  };

  return (
    <div className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}
