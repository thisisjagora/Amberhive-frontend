import React from "react";
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
import Herobg from "@/assets/hero-bg.png";
import { Link, useNavigate } from "react-router";
import AmberHiveLogo from "@/assets/Amberhive.png";

import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/store/slice/authSlice";
import { toast } from "sonner";
import GoogleSignupButton from "@/components/GoogleSignupButton";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // ✅ added

  const { status, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;

    if (!name) return toast.error("Name is required");

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) return toast.error("Enter a valid email");

    if (password.length < 8)
      return toast.error("Password must be at least 8 characters");

    try {
      const result = await dispatch(
        registerUser({ name, email, password, role: "user" })
      );

      if (registerUser.fulfilled.match(result)) {
        // ✅ Only run the queue if registration succeeds
        await fetch(
          "https://test.amber-hive.com/api/run-queue?token=secret123"
        );

        toast.success(result.payload.message);
        navigate("/confirm-otp", { state: { email } });
      } else {
        const message =
          typeof result.payload === "string"
            ? result.payload
            : result.payload?.message || result.error?.message;

        toast.error(message);
      }
    } catch (err) {
      toast.error(err?.message || "An unexpected error occurred");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between font-gilroy overflow-hidden">
      <div className="hidden md:block absolute top-0 left-0">
        <img
          src={Herobg}
          alt="Bottom decorative graphic"
          className="w-[450px]  object-contain"
        />
      </div>

      <header className="px-2 py-2 ">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <Link to="/" className="cursor-pointer">
              <img src={AmberHiveLogo} alt="Amber Hive Logo" className="w-36" />
            </Link>
          </div>
          <p className="text-sm text-gray-700 relative hidden md:block">
            Already have an account?{" "}
            <Link
              to="/sign-in"
              className="text-yellow-600 font-bold hover:underline cursor-pointer"
            >
              Login
            </Link>
          </p>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 relative z-10">
        <Card className="w-full md:max-w-md p-2 my-4 bg-white/80 border[1px]">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>Fill in the required fields</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 mb-4">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <Label htmlFor="name">Name*</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  className="bg-white"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="email">Email*</Label>
                <Input
                  id="email"
                  type="email"
                  className="bg-white"
                  placeholder="Enter your email address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password*</Label>
                <Input
                  id="password"
                  type="password"
                  className="bg-white"
                  placeholder="Create a password"
                />
                <p className="text-sm text-gray-400 mt-1">
                  It must be more than 8 characters
                </p>
              </div>

              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Creating account..." : "Get Started"}
              </Button>

              <p className="text-sm text-center cursor-pointer text-gray-700 md:hidden">
                Already have an account?{" "}
                <Link to="/sign-in" className="text-yellow-600 hover:underline">
                  Login
                </Link>
              </p>
            </form>

            <div className="flex items-center justify-center my-4">
              <Separator className="flex-1" />
              <span className="px-4 text-sm text-gray-500">Or</span>
              <Separator className="flex-1" />
            </div>

            <div className="w-full flex flex-col items-center justify-center space-y-2">
              <GoogleSignupButton />
            </div>
          </CardContent>

          <CardFooter className="py-2 flex flex-col items-center gap-2">
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

      <footer className="text-center text-sm text-gray-600 py-4">
        &copy; {new Date().getFullYear()} AmberHive.
      </footer>
    </div>
  );
};

export default SignUp;
