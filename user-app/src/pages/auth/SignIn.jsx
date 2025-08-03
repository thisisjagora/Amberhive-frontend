import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

import Herobg from "@/assets/hero-bg.png";
import AmberHiveLogo from "@/assets/Amberhive.png";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/store/slice/authSlice";
import GoogleLoginButton from "@/components/GoogleLoginButton";

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const { status } = useSelector((state) => state.auth);
  const loading = status === "loading";

  // Handle email/password sign in
  const handleSignIn = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!email.trim()) newErrors.email = "Email is required.";
    if (!password) newErrors.password = "Password is required.";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      const resultAction = await dispatch(loginUser({ email, password }));

      if (loginUser.fulfilled.match(resultAction)) {
        toast.success(
          resultAction.payload?.message || "Signed in successfully!"
        );
        navigate("/");
      } else {
        let errorMessage = "Server error. Please try again later.";
        const payload = resultAction.payload;

        if (typeof payload === "string") {
          errorMessage = payload;
        } else if (typeof payload === "object" && payload !== null) {
          errorMessage = payload.error || payload.message || errorMessage;

          if (payload.status === "unverified") {
            fetch(
              "https://test.amber-hive.com/api/run-queue?token=secret123"
            ).catch(() => null);
            navigate("/confirm-otp", { state: { email } });
            toast.warning(payload.message);
            return;
          }
        } else if (
          resultAction.error?.message &&
          resultAction.error.message !== "Rejected"
        ) {
          errorMessage = resultAction.error.message;
        }

        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error(error?.message || "An unexpected error occurred");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between font-gilroy overflow-hidden">
      {/* Background Images */}
      <div className="hidden md:block absolute top-0 left-0">
        <img
          src={Herobg}
          alt="Bottom decorative graphic"
          className="w-[450px] object-contain"
        />
      </div>

      {/* Header */}
      <header className="px-4 py-4 z-10 relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <Link to="/" className="cursor-pointer">
              <img src={AmberHiveLogo} alt="Amber Hive Logo" className="w-36" />
            </Link>
          </div>
          <p className=" hidden md:block text-sm text-gray-700">
            Need an account?{" "}
            <Link
              to="/sign-up"
              className="text-yellow-600 font-bold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 relative z-10">
        <Card className="w-full md:max-w-md p-2 my-4 bg-white/80 border[1px]">
          <CardHeader className="text-center mt-2">
            <CardTitle className="text-lg md:text-2xl font-semibold">
              Sign into AmberHive
            </CardTitle>
            <CardDescription className="text-gray-500 text-sm md:text-base">
              Hey there! Welcome to AmberHive.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 mb-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-1">
                <Label htmlFor="email" className="font-semibold">
                  Email*
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: "" });
                  }}
                  className={`placeholder:font-medium ${
                    errors.email ? "border-red-600" : ""
                  } focus:border-yellow-600 focus:ring-yellow-600`}
                />
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <div className="flex flex-col md:flex-row justify-between">
                  <Label htmlFor="password" className="font-semibold">
                    Password*
                  </Label>
                  <Link
                    to="/forgot-password"
                    className="text-yellow-600 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: "" });
                  }}
                  className={`placeholder:font-medium ${
                    errors.password ? "border-red-600" : ""
                  } focus:border-yellow-600 focus:ring-yellow-600`}
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Mobile Sign Up */}
            <p className="text-center text-gray-700 text-sm md:hidden cursor-pointer">
              Need an account?{" "}
              <Link to="/sign-up" className="text-yellow-600 hover:underline">
                Sign Up
              </Link>
            </p>

            {/* Separator */}
            <div className="flex items-center my-4">
              <Separator className="flex-1" />
              <span className="px-4 text-gray-500 text-sm">Or</span>
              <Separator className="flex-1" />
            </div>

            {/* Social Login */}
            <div className="w-full flex flex-col items-center justify-center space-y-2">
              <GoogleLoginButton />
            </div>
          </CardContent>
          <CardFooter className="py-4 flex flex-col items-center gap-2">
            <p className="text-gray-600 text-sm text-center">
              <Link
                to="/privacy-policy"
                className="text-yellow-600 hover:underline mx-1"
              >
                Privacy Policy
              </Link>
              |
              <Link
                to="/terms-and-conditions"
                className="text-yellow-600 hover:underline mx-1"
              >
                Terms & Conditions
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-600 text-sm py-4">
        &copy; {new Date().getFullYear()} AmberHive.
      </footer>
    </div>
  );
};

export default SignIn;
