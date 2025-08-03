import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Link } from "react-router";
import { toast } from "sonner";

import Herobg from "@/assets/hero-bg.png";
import AmberHiveLogo from "@/assets/Amberhive.png";
import { requestPasswordReset } from "@/store/slice/resetPasswordSlice";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);

  const { status, error: resetError } = useSelector(
    (state) => state.resetPassword
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    setError(null);

    try {
      // 🔹 Dispatch the reset request first
      const result = await dispatch(requestPasswordReset({ email }));

      if (requestPasswordReset.fulfilled.match(result)) {
        // 🔹 Only trigger run-queue if successful
        await fetch(
          "https://test.amber-hive.com/api/run-queue?token=secret123"
        );

        toast.success(result.payload);
        navigate("/reset-password-otp", { state: { email } });
      } else {
        const message =
          typeof result.payload === "string"
            ? result.payload
            : result.payload?.message || result.error?.message || "";

        toast.error(message);
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "An unexpected error occurred");
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
            <Link to="/" className="cursor-pointer">
              <img
                src={AmberHiveLogo}
                alt="Amber Hive Logo"
                className="mb-6 w-36 h-auto"
              />
            </Link>
          </div>
        </div>
      </header>
      {/* Main */}
      <main className="flex justify-center items-center flex-1 px-4 z-10 relative">
        <Card className="w-full max-w-md p-6  bg-white/80 border-[1px] ">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Forgot Password</CardTitle>
            <div className="max-w-xs mx-auto">
              <CardDescription className="text-gray-500">
                Don’t worry, fill in your email
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email*</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              {resetError && (
                <p className="text-red-500 text-sm text-center">{resetError}</p>
              )}

              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Sending..." : "Send Email"}
              </Button>

              <p className="text-sm text-center cursor-pointer text-gray-700">
                Back to{" "}
                <Link to="/sign-in" className="text-yellow-600 hover:underline">
                  Login
                </Link>
              </p>
            </form>

            {/* <CardFooter className="mb-[-16px] py-12 flex items-center justify-center space-x-2">
              <p className="text-base font-light">
                Privacy Policy | Terms & Conditions
              </p>
            </CardFooter> */}
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

export default ForgotPassword;
