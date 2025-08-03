import React from "react";
import { useNavigate } from "react-router"; // make sure you're using react-router-dom
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
import { Link } from "react-router"; 
import Herobg from "@/assets/hero-bg.png";
import AmberHiveLogo from "@/assets/Amberhive.png";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // you could trigger a request here and then:
    navigate("/reset-password");
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between font-gilroy overflow-hidden">
      {/* Top Right Image (hidden on mobile) */}
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
        <Card className="w-full max-w-md p-6 bg-white/80 border-[1px] ">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Forgot Password</CardTitle>
            <div className="max-w-xs mx-auto">
              <CardDescription className="text-gray-500">
                Don’t worry, fill in your email and we’ll send you a link to
                reset your password.
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
                  className="bg-white"
                />
              </div>

              <Button type="submit" className="w-full">
                Send Email
              </Button>

              <p className="text-sm text-center text-gray-700">
                Back to{" "}
                <Link to="/" className="text-yellow-600 hover:underline">
                  Login
                </Link>
              </p>
            </form>

            <CardFooter className="mb-[-16px] py-12 flex items-center justify-center space-x-2">
              <p className="text-base font-light">
                Privacy Policy | Terms & Conditions
              </p>
            </CardFooter>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-600 py-4 z-10 relative">
        &copy; {new Date().getFullYear()} Amber Hive.
      </footer>

      {/* Bottom Left Image (hidden on small) */}
     
    </div>
  );
};

export default ForgotPassword;
