import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { toast } from "sonner";

const MemberPaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const status = searchParams.get("status");

  useEffect(() => {
    console.log("Payment status:", status);

    if (status === "success") {
      toast.success("🎉 Payment successful!");
    } else if (status === "failed") {
      toast.error("❌ Payment failed. Please try again.");
    } else {
      toast("⚠️ Unknown payment status.");
    }

    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [status, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-2xl font-bold mb-4">
        {status === "success"
          ? "✅ Payment Successful!"
          : status === "failed"
          ? "❌ Payment Failed"
          : "⏳ Processing..."}
      </h1>
      <p className="text-gray-600">You will be redirected shortly...</p>
    </div>
  );
};

export default MemberPaymentCallback;
