/**
 * ContactInformationForm Component
 * Responsibility: Handle contact information input (email)
 */
export default function ContactInformationForm({ contactInfo, onContactChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Email Address <span className="text-red-500">*</span>
      </label>
      <input
        type="email"
        value={contactInfo.email}
        onChange={(e) => onContactChange({ ...contactInfo, email: e.target.value })}
        className="w-full px-4 py-3 border-2 border-violet-400 rounded-xl focus:border-violet-600 focus:outline-none transition-colors"
        placeholder="your.email@example.com"
      />
      <p className="text-xs text-gray-500 mt-2">
        Booking confirmation will be sent here
      </p>
    </div>
  );
}