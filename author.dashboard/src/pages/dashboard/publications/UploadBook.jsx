import React, { useState } from "react";
import { Button } from "@/components/ui/button";

import Layout from "@/components/shared/Layout";
import { useNavigate } from "react-router";
import UploadHeader from "@/components/headers/UploadHeader";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import StepTwoForm from "@/components/forms/StepTwoForm";
import StepThreeForm from "@/components/forms/StepThreeForm";
import StepOneForm from "@/components/forms/StepOneForm";
import PreviewStep from "@/components/forms/PreviewStep";

const steps = ["EBook Details", "Publishing Rights", "Pricing", "Preview"];

const UploadBook = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const [bookData, setBookData] = useState({
    // Step 1 fields
    title: "",
    subtitle: "",
    tags: [],
    author: "",
    description: "",
    cover_image: null,
    book: null,
    genre_id: "",
    language: "",

    // Step 2 fields

    copyright: "",
    // licenseType: "",
    drm: false,

    // Step 3 fields
    price: "",
    currency: "",
    discount: "",
    duration: "",
    // monthly_book_limit: "",
  });

  const nextStep = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleFinalSubmit = () => {
    // console.log("Submitting all data:", bookData);
    nextStep();
  };

  const dotSize = 24;
  const totalSteps = steps.length;
  // const isLastStep = step === totalSteps - 1;

  return (
    <Layout header={<UploadHeader />}>
      <div className="">
        <div className="w-full overflow-auto  px-2">
          <div className="relative bg-white  flex justify-between mb-10  max-w-[1000px] mx-auto">
            {/* Gray track */}
            <div className="absolute top-[40px] left-[12px] right-[12px] h-2 bg-gray-200 rounded-full z-0" />

            {/* Yellow progress track */}
            <div
              className="absolute top-[40px] left-[12px] sm:max-w-[300px] md:max-w-[650px] xl:max-w-[1000px] h-2 bg-yellow-500 rounded-full z-10 transition-all duration-300"
              style={{
                left: `${dotSize / 2}px`,
                width: `${(step / (steps.length - 1)) * 100}%`,
              }}
            />

            {steps.map((label, index) => (
              <div
                key={index}
                className="relative flex flex-col items-center text-center z-20"
              >
                <p
                  className={`text-base mb-2 whitespace-nowrap ${
                    index === step
                      ? "text-yellow-600 font-medium"
                      : "text-gray-400"
                  }`}
                >
                  {label}
                </p>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    index < step
                      ? "bg-yellow-500"
                      : index === step
                      ? "border-2 border-yellow-500 bg-white"
                      : "bg-white shadow"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-2xl w-full mx-auto px-4 py-8">
          {/* Step 1 Content */}

          {step === 0 && (
            <StepOneForm
              nextStep={nextStep}
              setBookData={setBookData}
              bookData={bookData}
            />
          )}
          {step === 1 && (
            <StepTwoForm
              nextStep={nextStep}
              prevStep={prevStep}
              bookData={bookData}
              setBookData={setBookData}
            />
          )}
          {step === 2 && (
            <StepThreeForm
              bookData={bookData}
              prevStep={prevStep}
              setBookData={setBookData}
              nextStep={handleFinalSubmit}
            />
          )}

          {step === 3 && bookData && (
            <PreviewStep
              bookData={bookData}
              prevStep={prevStep}
              setStep={setStep}
            />
          )}
          {/* {step === 4 && (
            <div className="flex flex-col items-center justify-center  rounded-2xl shadow-md p-6 text-center mt-20 space-y-4">
              <div className="flex items-center justify-center bg-green-100 p-2 rounded-full">
                <div className="flex items-center justify-center bg-green-200 p-2 rounded-full">
                  <IoMdCheckmarkCircleOutline className="text-green-600 text-xl" />
                </div>
              </div>

              <h2 className="text-xl font-bold">Sent your book for review</h2>
              <p className="text-base text-gray-700 max-w-sm">
                Your ebook is currently undergoing review and it will take 3
                working days. Kindly check your email for updates.
              </p>

              <Button
                className="bg-black text-white mt-6"
                onClick={() => {
                  navigate("/dashboard/publications/all-books");
                  console.log("Redirecting to dashboard...");
                }}
              >
                Go to All Books
              </Button>
            </div>
          )} */}
        </div>
      </div>
    </Layout>
  );
};

export default UploadBook;
