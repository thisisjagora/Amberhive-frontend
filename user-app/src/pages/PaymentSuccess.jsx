// PaymentSuccess.jsx
import React, { useEffect, useState } from "react";

const PaymentSuccess = () => {
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentIntent = params.get("payment_intent");

    if (paymentIntent) {
      // Optional: Confirm status from backend using paymentIntent
      setStatus("Payment successful!");
    } else {
      setStatus("Payment status unknown");
    }
  }, []);

  return (
    <div>
      <h1>{status}</h1>
    </div>
  );
};

export default PaymentSuccess;
