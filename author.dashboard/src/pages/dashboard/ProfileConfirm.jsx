import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useNavigate } from "react-router";
import { LiaCheckCircle } from "react-icons/lia";

const ProfileConfirm = () => {
  const navigate = useNavigate();

  const handleProceed = () => {
    navigate("/dashboard/overview");
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between font-gilroy overflow-hidden">
      {/* Main Content */}
      <main className="flex justify-center items-center flex-1 px-4 z-10 relative min-h-[80vh]">
        <Card className="w-full max-w-md p-8 bg-white/80 border-[1px] border-white/90 opacity-95 shadow-none min-h-[400px] flex flex-col justify-center">
          <CardHeader className="text-center space-y-6">
            <div className="flex justify-center mb-6">
              <div className="bg-green-50 rounded-full p-2">
                <div className="bg-green-100 rounded-full p-2">
                  <LiaCheckCircle className="text-green-300 text-4xl" />
                </div>
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">Great Job</CardTitle>
            <CardDescription className="text-lg px-4">
              We welcome you onboard on AmberHive. Please make the most out of
              our platform.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 mt-8 flex w-full justify-center items-center">
            <Button onClick={handleProceed} className="w-1/2 h-8 text-base">
              Continue
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ProfileConfirm;
