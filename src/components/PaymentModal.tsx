
import { useState } from "react";
import { X, CreditCard, Smartphone, Lock, CheckCircle } from "lucide-react";

interface Property {
  id: number;
  title: string;
  location: string;
  coordinates: { lat: number; lng: number };
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  onPaymentSuccess: () => void;
}

export const PaymentModal = ({ isOpen, onClose, property, onPaymentSuccess }: PaymentModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !property) return null;

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // After showing success, trigger the callback
      setTimeout(() => {
        onPaymentSuccess();
        handleClose();
      }, 2000);
    }, 3000);
  };

  const handleClose = () => {
    setIsProcessing(false);
    setIsSuccess(false);
    setPhoneNumber("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6 relative animate-scale-in">
        {/* Close Button */}
        <button
          onClick={handleClose}
          disabled={isProcessing}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        {!isSuccess ? (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Lock className="text-blue-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Unlock Directions
              </h2>
              <p className="text-gray-600">
                Pay KSh 20 to get exact location and directions to
              </p>
              <p className="font-semibold text-gray-800 mt-1">
                {property.title}
              </p>
            </div>

            {/* Payment Amount */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                KSh 20
              </div>
              <div className="text-sm text-gray-600">
                One-time payment for directions
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Select Payment Method</h3>
              
              <div className="space-y-3">
                <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="mpesa"
                    checked={paymentMethod === "mpesa"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-blue-600"
                  />
                  <div className="ml-3 flex items-center">
                    <Smartphone className="text-green-600 mr-2" size={20} />
                    <span className="font-medium">M-Pesa</span>
                  </div>
                </label>

                <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-blue-600"
                  />
                  <div className="ml-3 flex items-center">
                    <CreditCard className="text-blue-600 mr-2" size={20} />
                    <span className="font-medium">Credit/Debit Card</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Phone Number Input (for M-Pesa) */}
            {paymentMethod === "mpesa" && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  M-Pesa Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="254XXXXXXXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              disabled={isProcessing || (paymentMethod === "mpesa" && !phoneNumber)}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing Payment...
                </>
              ) : (
                `Pay KSh 20 via ${paymentMethod === "mpesa" ? "M-Pesa" : "Card"}`
              )}
            </button>

            {/* Security Notice */}
            <div className="mt-4 text-center text-xs text-gray-500">
              <Lock size={12} className="inline mr-1" />
              Your payment is secure and encrypted
            </div>
          </>
        ) : (
          /* Success State */
          <div className="text-center">
            <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-4">
              Opening directions to {property.title}...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );
};
