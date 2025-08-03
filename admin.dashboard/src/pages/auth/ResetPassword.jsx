import React, { useState } from "react";
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
import { useNavigate } from "react-router"; // Import useNavigate
import { Link } from "react-router"; // Import Link to use for navigation
import Herobg from "@/assets/hero-bg.png";
import AmberHiveLogo from "@/assets/Amberhive.png";

const ResetPassword = () => {
  const navigate = useNavigate(); // Initialize navigate hook
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Here you can add logic to check if password and confirmPassword match
    if (password === confirmPassword) {
      // If passwords match, navigate to the login page
      navigate("/confirm-password"); // This will navigate to the login page
    } else {
      // Show an error or handle the mismatch case
      alert("Passwords do not match");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between font-gilroy overflow-hidden">
      {/* Right Top Image (hidden on small) */}
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
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter preferred password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="confirmPassword">Confirm Password*</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-white"
                />
              </div>

              <Button type="submit" className="w-full">
                Reset Password
              </Button>

              {/* Back to Login and Privacy Policy links */}
              <div className="flex flex-col items-center space-y-2 mt-4">
                <p className="text-sm text-gray-700">
                  {" "}
                  Back to{" "}
                  <Link
                    to="/"
                    className="text-sm text-yellow-600 font-bold hover:underline"
                  >
                    Login
                  </Link>
                </p>

                <CardFooter className="flex justify-center mt-4 text-sm text-gray-500">
                  <p>Privacy Policy | Terms & Conditions</p>
                </CardFooter>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-600 py-4 z-10 relative">
        &copy; {new Date().getFullYear()} Amber Hive.
      </footer>

     
    </div>
  );
};

export default ResetPassword;
