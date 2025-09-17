import { Button } from "@/components/ui/button";
import React from "react";
import { useNavigate } from "react-router"; // useNavigate instead of useHistory

const NotFound = () => {
  const navigate = useNavigate(); // Get the navigate function

  return (
    <div className="h-screen flex flex-col justify-center items-center text-center">
      <div className="space-y-4">
        <h1 className="text-6xl font-bold text-[#0A0451]">404</h1>
        <h2 className="text-xl text-gray-600">Page Not Found</h2>
        <p className="text-gray-500">Oops! The page you are looking for does not exist.</p>

        <Button
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-2 bg-[#0A0451] text-white cursor-pointer font-semibold rounded-lg hover:bg-[#0A0451] transition"
        >
          Go Back to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
