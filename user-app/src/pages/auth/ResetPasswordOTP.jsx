import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useNavigate, useLocation } from "react-router";
import Herobg from "@/assets/hero-bg.png";
import { toast } from "sonner";
import AmberHiveLogo from "@/assets/Amberhive.png";
import { useDispatch } from "react-redux";
import { resendOtp } from "@/store/slice/authSlice";
import { verifyPasswordOtp } from "@/store/slice/resetPasswordSlice";

const ResetPasswordOTP = () => {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(300);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const email = location.state?.email || "your email";

  const maskEmail = (email) => {
    if (!email || email === "your email") return "your email";
    const [name, domain] = email.split("@");
    if (!name || !domain) return email;
    const visibleChars = Math.min(3, name.length);
    const maskedName =
      name.substring(0, visibleChars) + "*".repeat(name.length - visibleChars);
    return `${maskedName}@${domain}`;
  };

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter the full 6-digit code.", {
        position: "top-right",
      });
      return;
    }

    try {
      setSubmitting(true);
      await dispatch(verifyPasswordOtp({ otp })).unwrap();
      toast.success("OTP verified successfully!", { position: "top-right" });
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      toast.error(err?.message || "Failed to verify OTP", {
        position: "top-right",
      });
    } finally {
      setSubmitting(false);
    }
  };
  const handleResend = async () => {
    try {
      await Promise.all([
        dispatch(resendOtp({ email })).unwrap(), // Send OTP
        fetch(
          "https://test.amber-hive.com/api/run-queue?token=secret123"
        ).catch(() => null), // Trigger queue (optional fail)
      ]);

      toast.success("OTP resent successfully!", {
        position: "top-right",
      });
      setTimeLeft(300);
    } catch (error) {
      toast.error(error?.message || "Could not resend OTP", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between font-gilroy overflow-hidden">
      {/* Top Right Image */}
       <div className="hidden md:block absolute top-0 left-0">
             <img
               src={Herobg}
               alt="Bottom decorative graphic"
               className="w-[450px] object-contain"
             />
           </div>

      {/* Header */}
      <header className="px-4 py-4 z-10 relative hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="mt-4">
            <img
              src={AmberHiveLogo}
              alt="Amber Hive Logo"
              className="mb-6 w-36 h-auto"
            />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex justify-center  items-center flex-1 px-4 z-10 relative">
        <Card className="w-full max-w-sm p-6 bg-white/80 border-[1px]">
          <CardHeader className="text-center space-y-1">
            <CardTitle className="text-2xl">Confirm Email</CardTitle>
            <CardDescription>
              <span className="text-gray-500 text-sm">
                We have sent you a one-time password via {maskEmail(email)}
              </span>
            </CardDescription>
          </CardHeader>

          <CardContent className="mt-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex items-center justify-center text-base">
                <InputOTP value={otp} onChange={setOtp} maxLength={6}>
                  <InputOTPGroup className="flex justify-center items-center space-x-2">
                    {[...Array(6)].map((_, index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className="w-12 h-12 text-2xl text-center font-semibold border-[2px] rounded-sm"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>{formatTime(timeLeft)}</span>
                <button
                  type="button"
                  onClick={handleResend}
                  className={`${
                    timeLeft > 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-yellow-600 hover:underline"
                  }`}
                  disabled={timeLeft > 0}
                >
                  Resend
                </button>
              </div>

              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={submitting}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Verifying…
                  </span>
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-600 py-4 z-10 relative">
        &copy; {new Date().getFullYear()} AmberHive.
      </footer>

    
 
    </div>
  );
};

export default ResetPasswordOTP;
