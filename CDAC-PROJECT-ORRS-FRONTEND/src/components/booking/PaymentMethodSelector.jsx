/**
 * PaymentMethodSelector Component
 * Responsibility: Handle payment method selection with button-style UI
 */
export default function PaymentMethodSelector({ selectedMethod, onMethodChange }) {
  const paymentMethods = ["UPI", "Debit/Credit Card", "Net Banking"];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Payment Method
      </label>
      <div className="space-y-2">
        {paymentMethods.map((method) => (
          <button
            key={method}
            type="button"
            onClick={() => onMethodChange(method)}
            className={`w-full px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 text-left ${
              selectedMethod === method
                ? 'bg-violet-600 text-white border-violet-600 shadow-md'
                : 'bg-white text-gray-700 border-violet-200 hover:border-violet-400 hover:bg-violet-50'
            }`}
          >
            {method}
          </button>
        ))}
      </div>
    </div>
  );
}