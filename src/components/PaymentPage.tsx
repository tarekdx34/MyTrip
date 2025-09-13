import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CheckCircle,
  AlertCircle,
  Loader2,
  Lock,
  CreditCard,
  Smartphone,
  Wallet,
} from "lucide-react";

interface LocationState {
  bookingId: string;
  flightId: string;
  seatClass: string;
  amount: number;
  origin?: string;
  destination?: string;
  departureTime?: string;
  arrivalTime?: string;
}

// Mock API functions (shared with PassengerDashboard)
const mockAPI = {
  async createPayment(
    bookingId: string,
    amount: number,
    method: string,
    paymentData?: any
  ): Promise<{ paymentId: string; status: string; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const isSuccess = Math.random() > 0.2; // 80% success rate
    if (isSuccess) {
      // Update booking status to Confirmed
      const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
      const updatedBookings = bookings.map((booking: any) =>
        booking.bookingId === bookingId
          ? { ...booking, status: "Confirmed", ticketId: `TCK${Date.now()}` }
          : booking
      );
      localStorage.setItem("bookings", JSON.stringify(updatedBookings));

      // Add notification
      const notification = {
        id: `NTF${Date.now()}`,
        message: `Booking ${bookingId} confirmed after payment.`,
        timestamp: new Date().toISOString(),
        read: false,
      };
      localStorage.setItem("paymentNotification", JSON.stringify(notification));

      return {
        paymentId: `PMT${Date.now()}`,
        status: "Success",
        message: "Payment successful",
      };
    } else {
      return {
        paymentId: "",
        status: "Failed",
        message: "Payment declined",
      };
    }
  },
};

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | undefined;

  // Form states
  const [paymentMethod, setPaymentMethod] = useState("CreditCard");
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [saveCard, setSaveCard] = useState(false);

  // UI states
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "failure">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg">No booking information found.</p>
          <button
            onClick={() => navigate("/passenger-dashboard")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Input masking functions
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  // Validation functions
  const validateForm = () => {
    const errors: {[key: string]: string} = {};

    if (paymentMethod === "CreditCard") {
      if (!cardholderName.trim()) {
        errors.cardholderName = "Cardholder name is required";
      }

      const cleanCardNumber = cardNumber.replace(/\s+/g, '');
      if (!cleanCardNumber || cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
        errors.cardNumber = "Please enter a valid card number";
      }

      if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) {
        errors.expiry = "Please enter a valid expiry date (MM/YY)";
      } else {
        const [month, year] = expiry.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;

        if (parseInt(month) < 1 || parseInt(month) > 12) {
          errors.expiry = "Invalid month";
        } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
          errors.expiry = "Card has expired";
        }
      }

      if (!cvv || cvv.length < 3 || cvv.length > 4) {
        errors.cvv = "Please enter a valid CVV";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setPaymentStatus("idle");
    setErrorMessage("");

    try {
      const paymentData = paymentMethod === "CreditCard" ? {
        cardholderName,
        cardNumber: cardNumber.replace(/\s+/g, ''),
        expiry,
        cvv,
        saveCard
      } : {};

      const result = await mockAPI.createPayment(
        state.bookingId,
        state.amount,
        paymentMethod,
        paymentData
      );

      if (result.status === "Success") {
        setPaymentStatus("success");
        setTimeout(() => {
          navigate("/passenger-dashboard", { replace: true });
        }, 2000);
      } else {
        setPaymentStatus("failure");
        setErrorMessage(result.message);
      }
    } catch (err) {
      setPaymentStatus("failure");
      setErrorMessage("Payment failed: Network error.");
    }

    setLoading(false);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Payment</h1>
          <p className="text-gray-600">Secure payment for your MY TRIP flight booking</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-gray-600">Booking ID</span>
                <span className="font-mono text-gray-900">{state.bookingId}</span>
              </div>

              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-gray-600">Flight</span>
                <span className="font-semibold text-gray-900">{state.flightId}</span>
              </div>

              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-gray-600">Route</span>
                <span className="text-gray-900">
                  {state.origin || "JED"} → {state.destination || "DXB"}
                </span>
              </div>

              {state.departureTime && (
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-gray-600">Departure</span>
                  <span className="text-gray-900">{formatDateTime(state.departureTime)}</span>
                </div>
              )}

              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-gray-600">Seat Class</span>
                <span className="capitalize text-gray-900">{state.seatClass}</span>
              </div>

              <div className="flex justify-between items-center text-lg font-semibold pt-4 border-t">
                <span className="text-gray-900">Total Amount</span>
                <span className="text-2xl text-blue-600">${state.amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Payment Methods */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { id: "CreditCard", label: "Credit Card", icon: CreditCard },
                  { id: "PayPal", label: "PayPal", icon: Wallet },
                  { id: "Wallet", label: "Apple Pay", icon: Smartphone }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setPaymentMethod(id)}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      paymentMethod === id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Icon className={`h-6 w-6 mx-auto mb-2 ${
                      paymentMethod === id ? "text-blue-600" : "text-gray-600"
                    }`} />
                    <span className={`text-sm font-medium ${
                      paymentMethod === id ? "text-blue-600" : "text-gray-700"
                    }`}>
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Credit Card Form */}
            {paymentMethod === "CreditCard" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cardholder Name *
                  </label>
                  <input
                    type="text"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    placeholder="John Doe"
                    className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      fieldErrors.cardholderName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {fieldErrors.cardholderName && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.cardholderName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number *
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      fieldErrors.cardNumber ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {fieldErrors.cardNumber && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.cardNumber}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date *
                    </label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/YY"
                      maxLength={5}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                        fieldErrors.expiry ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {fieldErrors.expiry && (
                      <p className="text-red-500 text-sm mt-1">{fieldErrors.expiry}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV *
                    </label>
                    <input
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, '').substring(0, 4))}
                      placeholder="123"
                      maxLength={4}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                        fieldErrors.cvv ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {fieldErrors.cvv && (
                      <p className="text-red-500 text-sm mt-1">{fieldErrors.cvv}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="saveCard"
                    type="checkbox"
                    checked={saveCard}
                    onChange={(e) => setSaveCard(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="saveCard" className="ml-2 text-sm text-gray-700">
                    Save card for future payments
                  </label>
                </div>
              </div>
            )}

            {/* PayPal/Wallet Simulation */}
            {(paymentMethod === "PayPal" || paymentMethod === "Wallet") && (
              <div className="text-center py-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                  paymentMethod === "PayPal" ? "bg-blue-100" : "bg-gray-100"
                }`}>
                  {paymentMethod === "PayPal" ? (
                    <Wallet className="h-8 w-8 text-blue-600" />
                  ) : (
                    <Smartphone className="h-8 w-8 text-gray-600" />
                  )}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Pay with {paymentMethod === "PayPal" ? "PayPal" : "Apple Pay"}
                </h3>
                <p className="text-gray-600 mb-6">
                  You will be redirected to complete your payment securely.
                </p>
              </div>
            )}

            {/* Status Messages */}
            {paymentStatus === "success" && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-green-800 font-medium">Payment Successful!</p>
                  <p className="text-green-700 text-sm">Redirecting to your bookings...</p>
                </div>
              </div>
            )}

            {paymentStatus === "failure" && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <div>
                  <p className="text-red-800 font-medium">Payment Failed</p>
                  <p className="text-red-700 text-sm">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Pay Now Button */}
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  <span>Pay Now - ${state.amount.toFixed(2)}</span>
                </>
              )}
            </button>

            {/* Security Footer */}
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <Lock className="h-4 w-4" />
                <span>Secure Payment</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Powered by MY TRIP SecurePay
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
