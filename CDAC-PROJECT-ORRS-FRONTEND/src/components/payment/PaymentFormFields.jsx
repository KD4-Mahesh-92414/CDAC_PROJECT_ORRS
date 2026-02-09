import { Card, Input, Select } from '../ui';
import { 
  DevicePhoneMobileIcon,
  CreditCardIcon,
  BuildingLibraryIcon,
  WalletIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";

/**
 * PaymentFormFields Component
 * Responsibility: Render payment form fields based on selected method with icons
 */
export default function PaymentFormFields({ paymentMethod }) {
  if (!paymentMethod) return null;

  const getFormTitle = () => {
    switch (paymentMethod) {
      case "UPI":
        return { title: "Enter UPI Details", icon: DevicePhoneMobileIcon };
      case "CARD":
        return { title: "Enter Card Details", icon: CreditCardIcon };
      case "NETBANKING":
        return { title: "Select Your Bank", icon: BuildingLibraryIcon };
      case "WALLET":
        return { title: "Choose Wallet", icon: WalletIcon };
      default:
        return { title: "", icon: null };
    }
  };

  const { title, icon: TitleIcon } = getFormTitle();

  const bankOptions = [
    "ICICI Bank",
    "HDFC Bank",
    "State Bank of India",
    "Axis Bank",
    "Punjab National Bank",
  ];

  const walletOptions = [
    "Google Pay",
    "PhonePe",
    "Paytm",
    "Amazon Pay",
  ];

  return (
    <Card>
      <h3 className="text-lg font-bold text-gray-900 mb-6 pb-2 border-b border-violet-100 flex items-center gap-2">
        {TitleIcon && <TitleIcon className="w-5 h-5 text-violet-600" />}
        {title}
      </h3>

      <div className="space-y-4">
        {paymentMethod === "UPI" && (
          <>
            <Input
              label="UPI ID"
              required
              type="text"
              placeholder="username@upi"
            />
            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <ShieldCheckIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800">
                Your UPI ID will be verified before processing the payment
              </p>
            </div>
          </>
        )}

        {paymentMethod === "CARD" && (
          <>
            <Input
              label="Card Number"
              required
              type="text"
              placeholder="1234 5678 9012 3456"
              maxLength="19"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Expiry Date"
                required
                type="text"
                placeholder="MM/YY"
                maxLength="5"
              />
              <Input
                label="CVV"
                required
                type="password"
                placeholder="123"
                maxLength="3"
              />
            </div>
            <Input
              label="Cardholder Name"
              required
              type="text"
              placeholder="Name on card"
            />
            <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <ShieldCheckIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-green-800">
                Your card details are encrypted and secure
              </p>
            </div>
          </>
        )}

        {paymentMethod === "NETBANKING" && (
          <>
            <Select
              label="Select Bank"
              required
              placeholder="Choose your bank"
              options={bankOptions}
            />
            <div className="flex items-start gap-2 p-3 bg-violet-50 rounded-lg border border-violet-200">
              <ShieldCheckIcon className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-violet-800">
                You will be redirected to your bank's secure login page
              </p>
            </div>
          </>
        )}

        {paymentMethod === "WALLET" && (
          <>
            <Select
              label="Select Wallet"
              required
              placeholder="Choose your wallet"
              options={walletOptions}
            />
            <div className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
              <ShieldCheckIcon className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-orange-800">
                You will be redirected to complete the payment in your wallet app
              </p>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
