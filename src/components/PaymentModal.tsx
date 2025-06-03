
import { useState } from "react";
import { X, CreditCard, Smartphone, Lock, CheckCircle, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Property {
  id: string;
  title: string;
  location: string;
  coordinates: { lat: number; lng: number };
  landlordPhone?: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  onPaymentSuccess: (propertyId: string) => void;
}

export const PaymentModal = ({ isOpen, onClose, property, onPaymentSuccess }: PaymentModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showLandlordContact, setShowLandlordContact] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !property) return null;

  const handlePayment = async () => {
    if (paymentMethod === "mpesa" && !phoneNumber) {
      setError("Please enter your M-Pesa phone number");
      return;
    }

    setIsProcessing(true);
    setError(null);
    
    try {
      if (paymentMethod === "mpesa") {
        // Call Daraja API for M-Pesa payment
        const { data, error } = await supabase.functions.invoke('daraja-payment', {
          body: {
            phone: phoneNumber,
            amount: 1,
            account_reference: `DIRECTIONS_${property.id}`,
            transaction_desc: `Directions to ${property.title}`
          }
        });

        if (error) {
          console.error('Daraja payment error:', error);
          setError("Payment failed. Please try again.");
          setIsProcessing(false);
          return;
        }

        if (data?.success) {
          console.log('STK Push sent successfully:', data);
          // Simulate waiting for payment confirmation
          setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            setShowLandlordContact(true);
            
            setTimeout(() => {
              onPaymentSuccess(property.id);
              handleClose();
            }, 5000);
          }, 10000); // Wait 10 seconds for payment confirmation
        } else {
          setError(data?.error || "Payment failed. Please try again.");
          setIsProcessing(false);
        }
      } else {
        // Simulate card payment processing
        setTimeout(() => {
          setIsProcessing(false);
          setIsSuccess(true);
          setShowLandlordContact(true);
          
          setTimeout(() => {
            onPaymentSuccess(property.id);
            handleClose();
          }, 5000);
        }, 3000);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError("Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setIsProcessing(false);
    setIsSuccess(false);
    setShowLandlordContact(false);
    setPhoneNumber("");
    setError(null);
    onClose();
  };

  const handleCallLandlord = () => {
    if (property.landlordPhone) {
      window.open(`tel:${property.landlordPhone}`, '_self');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6 relative animate-scale-in">
        <button
          onClick={handleClose}
          disabled={isProcessing}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        {!isSuccess ? (
          <>
            <div className="text-center mb-6">
              <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Lock className="text-blue-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Unlock Directions & Contact
              </h2>
              <p className="text-gray-600">
                Pay KSh 1 to get exact location, directions, and landlord contact for
              </p>
              <p className="font-semibold text-gray-800 mt-1">
                {property.title}
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                KSh 1
              </div>
              <div className="text-sm text-gray-600">
                One-time payment for directions & contact
              </div>
            </div>

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

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handlePayment}
              disabled={isProcessing || (paymentMethod === "mpesa" && !phoneNumber)}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {paymentMethod === "mpesa" ? "Waiting for M-Pesa confirmation..." : "Processing Payment..."}
                </>
              ) : (
                `Pay KSh 1 via ${paymentMethod === "mpesa" ? "M-Pesa" : "Card"}`
              )}
            </button>

            <div className="mt-4 text-center text-xs text-gray-500">
              <Lock size={12} className="inline mr-1" />
              Your payment is secure and encrypted
            </div>
          </>
        ) : (
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
            
            {showLandlordContact && property.landlordPhone && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-green-800 mb-2">Landlord Contact</h3>
                <div className="flex items-center justify-center text-green-700 mb-2">
                  <Phone size={16} className="mr-2" />
                  <span className="font-medium">{property.landlordPhone}</span>
                </div>
                <button
                  onClick={handleCallLandlord}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Call Landlord Now
                </button>
                <p className="text-xs text-green-600 mt-2">
                  You can now contact the landlord directly
                </p>
              </div>
            )}
            
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );
};
