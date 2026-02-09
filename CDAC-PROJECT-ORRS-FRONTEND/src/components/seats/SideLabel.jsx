/**
 * SideLabel Component
 * Responsibility: Display side labels for seat rows (L, M, U)
 */
export default function SideLabel({ text }) {
  return (
    <div className="w-6 text-xs font-bold flex items-center justify-center text-gray-600">
      {text}
    </div>
  );
}