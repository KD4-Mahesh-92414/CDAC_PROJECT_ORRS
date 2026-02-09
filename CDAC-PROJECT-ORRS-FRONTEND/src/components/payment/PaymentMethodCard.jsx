import { Card, Radio } from '../ui';
import { 
  DevicePhoneMobileIcon, 
  CreditCardIcon, 
  BuildingLibraryIcon, 
  WalletIcon 
} from "@heroicons/react/24/outline";

/**
 * PaymentMethodCard Component
 * Responsibility: Handle payment method selection with radio buttons and icons
 */
export default function PaymentMethodCard({ selectedMethod, onMethodChange }) {
  const paymentMethods = [
    { 
      id: "UPI", 
      name: "UPI Payment", 
      icon: DevicePhoneMobileIcon, 
      desc: "Pay using UPI ID",
      color: "text-blue-600"
    },
    { 
      id: "CARD", 
      name: "Debit/Credit Card", 
      icon: CreditCardIcon, 
      desc: "Visa, Mastercard, RuPay",
      color: "text-violet-600"
    },
    { 
      id: "NETBANKING", 
      name: "Net Banking", 
      icon: BuildingLibraryIcon, 
      desc: "All major banks supported",
      color: "text-green-600"
    },
    { 
      id: "WALLET", 
      name: "Digital Wallet", 
      icon: WalletIcon, 
      desc: "Google Pay, PhonePe, Paytm",
      color: "text-orange-600"
    },
  ];

  return (
    <Card>
      <h3 className="text-lg font-bold text-gray-900 mb-6 pb-2 border-b border-violet-100">
        Select Payment Method
      </h3>

      <div className="space-y-4">
        {paymentMethods.map((method) => {
          const IconComponent = method.icon;
          return (
            <label
              key={method.id}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedMethod === method.id
                  ? "border-violet-500 bg-violet-50 shadow-md"
                  : "border-violet-200 hover:border-violet-400 hover:shadow-sm"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value={method.id}
                checked={selectedMethod === method.id}
                onChange={(e) => onMethodChange(e.target.value)}
                className="w-4 h-4 text-violet-600 border-gray-300 focus:ring-violet-500"
              />
              <div className={`p-2 rounded-lg ${selectedMethod === method.id ? 'bg-white' : 'bg-gray-50'}`}>
                <IconComponent className={`w-6 h-6 ${method.color}`} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{method.name}</p>
                <p className="text-sm text-gray-600">{method.desc}</p>
              </div>
              {selectedMethod === method.id && (
                <div className="w-2 h-2 rounded-full bg-violet-600"></div>
              )}
            </label>
          );
        })}
      </div>
    </Card>
  );
}
