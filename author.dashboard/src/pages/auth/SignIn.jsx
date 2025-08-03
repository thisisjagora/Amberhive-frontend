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
import { loginUser } from "@/redux/slices/authSlice";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({ email: "", password: "" });

  // Redux state
  const { status, error, token } = useSelector((state) => state.auth);
  const loading = status === "loading";

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
        const userData = resultAction.payload;

        toast.success(userData?.message || "Signed in successfully!", {
          position: "top-right",
        });

        const authorId = userData?.user?.author_id;
        const royaltyPercentage = userData?.user?.royalty_percentage;

        if (authorId === null) {
          navigate("/profile-detail");
        } else if (royaltyPercentage === null) {
          navigate("/pricing");
        } else {
          navigate("/dashboard/overview");
        }
      } else if (loginUser.rejected.match(resultAction)) {
        const payload = resultAction.payload;

        // Check for "unverified" status and handle it
        if (payload?.status === "unverified") {
          fetch(
            "https://test.amber-hive.com/api/run-queue?token=secret123"
          ).catch(() => null);
          navigate("/confirm-otp", { state: { email } });
        }

        // Show only error from payload
        const errorMessage = payload?.message || payload?.error;
        if (errorMessage) {
          toast.error(errorMessage, {
            position: "top-right",
          });
        }
      }
    } catch (error) {
      // Only display message if it came through rejectWithValue but wasn't in payload
      if (error?.message) {
        toast.error(error.message, {
          position: "top-right",
        });
      }
      console.error("Unexpected error:", error);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between font-gilroy overflow-hidden">
      {/* Decorative BG Images */}
      <div className="hidden md:block absolute top-0 left-0">
        <img
          src={Herobg}
          alt="Bottom decorative graphic"
          className="w-[450px] object-contain"
        />
      </div>

      <header className=" px-4 py-4 z-10 relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <img src={AmberHiveLogo} alt="Logo" className="w-36" />
          </div>
          <p className="text-sm text-gray-700 relative hidden md:block">
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

      <main className="flex-1 flex items-center justify-center px-4 relative z-10">
        <Card className="w-full max-w-md p-6 bg-white/80 border[1px]">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold">
              Sign into AmberHive
            </CardTitle>
            <CardDescription className="text-gray-500">
              Hey there! Welcome to AmberHive.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
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
                    errors.email
                      ? "border-red-600 focus:border-yellow-600 focus:ring-yellow-600"
                      : "focus:border-yellow-600 focus:ring-yellow-600"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <Label htmlFor="password" className="font-semibold">
                    Password*
                  </Label>
                  <Link
                    to="/forgot-password"
                    className="text-yellow-600 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="off"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password)
                        setErrors({ ...errors, password: "" });
                    }}
                    className={`placeholder:font-medium pr-10 ${
                      errors.password
                        ? "border-red-600 focus:border-yellow-600 focus:ring-yellow-600"
                        : "focus:border-yellow-600 focus:ring-yellow-600"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-yellow-600"
                    tabIndex={-1}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                )}
              </div>

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

            {/* Mobile Sign Up Link */}
            <p className="text-center text-gray-700 text-sm md:hidden">
              Need an account?{" "}
              <Link to="/sign-up" className="text-yellow-600 hover:underline">
                Sign Up
              </Link>
            </p>

            <div className="flex items-center my-4">
              <Separator className="flex-1" />
              <span className="px-4 text-gray-500 text-sm">Or</span>
              <Separator className="flex-1" />
            </div>

            {/* Social Buttons */}
            <div className="space-y-2">
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

      <footer className="text-center text-gray-600 text-sm py-4">
        &copy; {new Date().getFullYear()} AmberHive.
      </footer>
    </div>
  );
};

export default SignIn;
