import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";
import Herobg from "@/assets/hero-bg.png";
import AmberHiveLogo from "@/assets/Amberhive.png";
import { resetPassword } from "@/redux/slices/resetPasswordSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { completeStatus } = useSelector((state) => state.resetPassword);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is missing. Please restart the reset process.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const resultAction = await dispatch(
        resetPassword({
          email,
          password,
          confirm_password: confirmPassword, // ✅ matches thunk
        })
      );

      if (resetPassword.fulfilled.match(resultAction)) {
        toast.success(
          resultAction.payload?.message || "Password reset successful!"
        );
        navigate("/loading-account");
      } else {
        toast.error(
          resultAction.payload?.message || "Reset failed. Please try again."
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between font-gilroy overflow-hidden">
      <div className="hidden md:block absolute top-0 left-0">
        <img
          src={Herobg}
          alt="Bottom decorative graphic"
          className="w-[450px] object-contain"
        />
      </div>

      <header className="px-4 py-4 z-10 relative hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="mt-4">
            <Link to="/">
              <img
                src={AmberHiveLogo}
                alt="Amber Hive Logo"
                className="mb-6 w-36 h-auto hover:opacity-90 transition-opacity"
              />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex justify-center items-center flex-1 px-4 z-10 relative">
        <Card className="w-full max-w-sm p-6 bg-white/80 border-[1px] ">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Reset Password</CardTitle>
            <CardDescription>
              Enter a new password for your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <Label htmlFor="password">New Password*</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter preferred password"
                    value={password}
                    autoComplete="new-password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white pr-10"
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
                <p className="text-sm text-gray-400 mt-1">
                  It must be more than 8 characters
                </p>
              </div>

              <div className="space-y-1">
                <Label htmlFor="confirmPassword">Confirm Password*</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    autoComplete="new-password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-white pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-yellow-600"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  It must be more than 8 characters
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={completeStatus === "loading"}
              >
                {completeStatus === "loading"
                  ? "Resetting..."
                  : "Reset Password"}
              </Button>

              {/* <div className="flex flex-col items-center space-y-2 mt-4">
                <CardFooter className="flex justify-center mt-4 text-sm text-gray-500">
                  <p>Privacy Policy | Terms & Conditions</p>
                </CardFooter>
              </div> */}
            </form>
          </CardContent>
        </Card>
      </main>

      <footer className="text-center text-sm text-gray-600 py-4 z-10 relative">
        &copy; {new Date().getFullYear()} AmberHive.
      </footer>
    </div>
  );
};

export default ResetPassword;
