import React from "react";
import { Button } from "@/components/ui/button"; // Import button component
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"; // Import Card components
import { useNavigate } from "react-router"; // Import useNavigate hook from react-router
import { FaCheckCircle } from "react-icons/fa"; // Import an icon from react-icons
import bgImage from "@/assets/l-bg-1.png"; // Import background image
import bgImage2 from "@/assets/l-bg-2.png"; // Import second background image
import AmberHiveLogo from "@/assets/Amberhive.png";

const CreateAccount = () => {
  const navigate = useNavigate(); // Initialize navigate hook

  const handleProceed = () => {
    // Navigate to the login page
    navigate("/sign-in"); // This will take the user to the login page
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between font-gilroy overflow-hidden">
      {/* Right Top Background Image (hidden on small) */}
      <div className="hidden md:block absolute top-0 right-0 z-0">
        <img
          src={bgImage}
          alt="Decorative"
          className="w-[900px] object-contain pointer-events-none"
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

      {/* Main Content */}
      <main className="flex justify-center items-center flex-1 px-4 z-10 relative">
        <Card className="w-full max-w-sm p-6 bg-white/80 border-[1px] border-white/90 opacity-95">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 rounded-full p-1">
                <div className="bg-green-50 rounded-full p-1">
                  <FaCheckCircle className="text-green-300 text-2xl" />
                </div>
              </div>
            </div>
            <CardTitle className="text-2xl">Account Created</CardTitle>
            <CardDescription>
              Your account has been created successfully. You can now log in.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Button onClick={handleProceed} className="w-full">
              Proceed to Login
            </Button>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-600 py-4 z-10 relative">
        &copy; {new Date().getFullYear()} AmberHive.
      </footer>

      {/* Bottom Left Background Image (hidden on small screens) */}
      <div className="hidden md:block">
        <img
          src={bgImage2}
          alt="Decorative"
          className="absolute bottom-0 left-0 w-[420px] lg:w-[450px] object-contain pointer-events-none select-none"
        />
      </div>
    </div>
  );
};

export default CreateAccount;
