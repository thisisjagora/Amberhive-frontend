import React from "react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

import { TbDeviceCameraPhone } from "react-icons/tb";

const PaymentMethod = () => {
  return (
    <div className="max-w-[80rem] mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900">Payment Method</h1>
        <p className="text-sm text-gray-500">View current payment choice</p>
      </div>
      <div className="flex flex-col  ml-2 pb-24">
        <div className="py-6 ">
          <div className="flex flex-col gap-4">
            {/* Approval Notification Setting */}
            <div className="flex flex-col md:flex-row gap-6 md:max-w-[900px]">
              <div className="md:w-[500px] md:shrink-0">
                <Label htmlFor="show-checkout" className="text-base">
                  Show my saved payment methods on the checkout page
                </Label>
              </div>
              <Switch
                id="show-checkout"
                defaultChecked
                className="mt-1 data-[state=checked]:bg-[#F8B846]"
              />
            </div>

            <Separator />

            <div className="flex flex-col gap-6">
              <div className="w-[300px]">
                <h1 className="text-base ">Saved Payment Method</h1>
              </div>
              <div className="p-4 py-12 bg-white ">
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <div className="bg-gray-100 rounded-full p-2 inline-block">
                    <div className="bg-gray-200 rounded-full p-2">
                      <TbDeviceCameraPhone className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <h1 className="text-lg font-semibold">
                      There is nothing to see here
                    </h1>
                    <p>
                      It looks like you don’t have any saved payments choice
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
