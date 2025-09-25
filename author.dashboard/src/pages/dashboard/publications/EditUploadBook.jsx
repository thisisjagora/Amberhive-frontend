import React, { useState, useEffect } from "react";
import Layout from "@/components/shared/Layout";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import EditStepOneForm from "@/components/forms/EditStepOneForm";
import EditStepTwoForm from "@/components/forms/EditStepTwoForm";
import EditStepThreeForm from "@/components/forms/EditStepThreeForm";
import EditPreviewStep from "@/components/forms/EditPreviewStep";
import { fetchBookById } from "@/redux/slices/bookSlice";

const steps = ["EBook Details", "Publishing Rights", "Pricing", "Preview"];

const EditUploadBook = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  // Redux state
  const { bookDetail, statusBookDetail, error } = useSelector(
    (state) => state.books
  );

  // Local state for editing
  const [bookData, setBookData] = useState({
    title: "",
    subtitle: "",
    tags: [],
    author: "",
    description: "",
    cover_image: null,
    book: null,
    genre_id: "",
    language: "",
    copyright: "",
    drm: false,
    price: "",
    currency: "",
    discount: "",
    duration: "",
  });

  // Fetch book on mount
  useEffect(() => {
    if (id) {
      dispatch(fetchBookById(id));
    }
  }, [dispatch, id]);

  // Prefill form when bookDetail is available
  useEffect(() => {
    if (bookDetail) {
      setBookData({
        title: bookDetail.title || "",
        subtitle: bookDetail.subtitle || "",
        tags: bookDetail.tags || [],
        author: bookDetail.author.user.name || "",
        description: bookDetail.description || "",
        genre_id: bookDetail.categories?.[0]?.id || bookDetail.genre_id || "",
        language: bookDetail.language || "",
        copyright: bookDetail.copyright || "",
        drm: bookDetail.drm || false,
        price: bookDetail.price || "",
        currency: bookDetail.currency || "",
        discount: bookDetail.discount || "",
        duration: bookDetail.duration || "",
        cover_image: bookDetail.cover_image || null,
        book: bookDetail.book || null,
      });
    }
  }, [bookDetail]);

  const nextStep = () => step < steps.length - 1 && setStep(step + 1);
  const prevStep = () => step > 0 && setStep(step - 1);
  const handleFinalSubmit = () => nextStep();

  const dotSize = 24;

  if (statusBookDetail === "loading") {
    return (
      <Layout>
        <div className="p-4 bg-white">
          <div className="flex flex-col items-center justify-center text-center mt-20 space-y-4">
            <div className="h-6 w-6 bg-gray-300 rounded-full animate-spin border-t-2 border-gray-500" />
            <p className="text-sm text-gray-500">Loading Book...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // if (error) {
  //   return (
  //     <Layout>
  //       <div className="flex justify-center items-center h-96">
  //         <p className="text-red-500">Failed to load book: {error}</p>
  //       </div>
  //     </Layout>
  //   );
  // }

  return (
    <Layout
      header={
        <div className="flex flex-col mt-20 px-2 md:mt-0 justify-start items-start w-full">
          <h2 className="text-xl font-semibold text-gray-800">Edit Ebook</h2>
        </div>
      }
    >
      <div className="">
        {/* Step indicator */}
        <div className="w-full overflow-auto px-2">
          <div className="relative bg-white flex justify-between mb-10 max-w-[1000px] mx-auto">
            <div className="absolute top-[40px] left-[12px] right-[12px] h-2 bg-gray-200 rounded-full z-0" />
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

        {/* Steps */}
        <div className="max-w-2xl w-full mx-auto px-4 py-8">
          {step === 0 && (
            <EditStepOneForm
              nextStep={nextStep}
              setBookData={setBookData}
              bookData={bookData}
            />
          )}
          {step === 1 && (
            <EditStepTwoForm
              nextStep={nextStep}
              prevStep={prevStep}
              bookData={bookData}
              setBookData={setBookData}
            />
          )}
          {step === 2 && (
            <EditStepThreeForm
              bookData={bookData}
              prevStep={prevStep}
              setBookData={setBookData}
              nextStep={handleFinalSubmit}
            />
          )}
          {step === 3 && bookData && (
            <EditPreviewStep
              id={id}
              bookData={bookData}
              prevStep={prevStep}
              setStep={setStep}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EditUploadBook;
