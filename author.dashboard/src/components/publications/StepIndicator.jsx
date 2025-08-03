import React from "react";
import { cn } from "@/lib/utils"; // Assuming you have your cn utility
import { FaCircle } from "react-icons/fa";
import Layout from "../shared/Layout";
import UploadBookHeader from "../headers/UploadBookHeader";

const steps = [
  "Ebook Details",
  "ISBN & Publishing Rights",
  "Pricing & Royalties",
  "Preview",
];

const StepIndicator = ({ currentStep }) => {
  const activeColor = "bg-orange-500 border-orange-500 text-white";
  const completedColor = "border-orange-500 text-orange-500";
  const inactiveColor = "border-border text-muted-foreground";
  const completedLineColor = "bg-orange-500";
  const inactiveLineColor = "bg-border";

  return (
    <Layout header={<UploadBookHeader />}>
      <div className=" flex justify-between text-base">
        {steps.map((step, index) => (
          <div key={index} className="text-center">
            {step}
          </div>
        ))}
      </div>
      <div className="relative flex items-center">
        {steps.map((step, index) => (
          <div key={index} className="flex-1 flex items-center justify-center">
            <div
              className={cn(
                "relative z-10 flex items-center justify-center w-6 h-6 rounded-full border-2",
                index === currentStep
                  ? activeColor
                  : index < currentStep
                  ? completedColor
                  : inactiveColor
              )}
            >
              {index === currentStep ? (
                <span className="text-xs font-semibold">{index + 1}</span>
              ) : (
                <FaCircle
                  className={`w-2 h-2 ${
                    index < currentStep
                      ? "fill-orange-500 text-orange-500"
                      : "text-border"
                  }`}
                />
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 h-0.5 w-full",
                  index < currentStep ? completedLineColor : inactiveLineColor
                )}
              />
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default StepIndicator;
