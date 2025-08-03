import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useDispatch, useSelector } from "react-redux";
import { saveBook } from "@/redux/slices/bookSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ReaderEpub from "../ReaderEpub";
import { BookOpen, X } from "lucide-react";

const PreviewStep = ({ bookData, prevStep, setStep }) => {
  const dispatch = useDispatch();
  const { genres } = useSelector((state) => state.genre);
  const navigate = useNavigate();
  const saveStatus = useSelector((state) => state.books.statusSaveBook);
  const isLoading = saveStatus === "loading";

  const handleSave = async (status) => {
    const dataToSave = status ? { ...bookData, status } : { ...bookData };

    try {
      const response = await dispatch(saveBook(dataToSave)).unwrap();

      if (response?.success !== false) {
        toast.success(response?.message);

        navigate(
          status === "pending"
            ? "/dashboard/publications/all-books"
            : "/dashboard/publications/drafts"
        );
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      console.error("Save book error:", error);
      toast.error(error); 
    }
  };

  return (
    <div className="p-6 rounded-lg bg-gray-50">
      {/* Title Section */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Preview</h2>
        <p className="text-base text-gray-500">Preview & Submit for Approval</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        {/* Cover Preview */}
        <div className="flex justify-center">
          <img
            src={
              bookData.cover_image instanceof File
                ? URL.createObjectURL(bookData.cover_image)
                : bookData.cover_image
            }
            alt="Book Cover"
            className="h-60 w-40 object-cover rounded-md shadow-md"
          />
        </div>

        {/* Book Metadata */}
        <div className="space-y-4">
          {[
            { label: "Book Title", value: bookData.title },
            { label: "Subtitle", value: bookData.subtitle },
            {
              label: "Genre",
              value:
                genres.find((g) => g.id === bookData.genre_id)?.name || "N/A",
            },
            // { label: "Page Count", value: bookData.page_count },
            { label: "Language", value: bookData.language },
            { label: "Tags", value: bookData.tags?.join(", ") },
            { label: "Author", value: bookData.author },
          ].map((item, i) => (
            <div key={i} className="space-y-2">
              <Label className="font-semibold text-gray-700">
                {item.label}
              </Label>
              <Input
                type="text"
                value={item.value || ""}
                readOnly
                className="text-sm text-gray-700 border-gray-300 rounded-md p-3 w-full bg-gray-100"
              />
            </div>
          ))}

          <div className="space-y-2">
            <Label className="font-semibold text-gray-700">Description</Label>
            <div
              className="text-sm text-gray-700 border min-h-[150px] max-h-[300px] overflow-y-auto border-gray-300 rounded-md p-3 w-full bg-gray-100 prose"
              dangerouslySetInnerHTML={{ __html: bookData.description || "" }}
            />
          </div>
        </div>

        {/* Uploaded Files Info */}
        <div className="space-y-2">
          <div className="space-y-3">
            <Label className="font-semibold text-gray-700">
              Uploaded Cover Image
            </Label>
            <div className="flex items-center gap-4">
              <Progress
                value={100}
                max={100}
                className="w-full h-3 [&>div]:!bg-yellow-500 bg-gray-200"
              />
              <p className="text-sm text-gray-700">100%</p>
            </div>
          </div>
          <div className="space-y-3">
            <Label className="font-semibold text-gray-700">
              Uploaded Ebook
            </Label>
            <div className="flex items-center gap-4">
              <Progress
                value={100}
                max={100}
                className="w-full h-3 [&>div]:!bg-yellow-500"
              />
              <p className="text-sm text-gray-700">100%</p>
            </div>
          </div>

          {/* Read Book Modal Button */}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="mt-4 cursor-pointer">
                <BookOpen className="" />
                View Book
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent
              className="relative flex flex-col overflow-hidden"
              style={{
                position: "fixed",
                width: "98vw",
                maxWidth: "none",
                height: "95vh",
                margin: 0,
                padding: 0,
                borderRadius: "0.5rem",
              }}
            >
              <AlertDialogCancel
                className="absolute right-4 top-4 p-1 rounded-md hover:bg-muted"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </AlertDialogCancel>

              <AlertDialogHeader className="pb-2 p-6">
                <AlertDialogTitle>{bookData.title}</AlertDialogTitle>
                <AlertDialogDescription></AlertDialogDescription>
              </AlertDialogHeader>

              <div className="flex-1 mt-4 overflow-hidden rounded border">
                <ReaderEpub
                  url={
                    bookData.book instanceof File
                      ? URL.createObjectURL(bookData.book)
                      : bookData.book
                  }
                />
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* ISBN & Rights */}
        <div className="space-y-4">
          {[
            // { label: "ISBN", value: bookData.isbnNumber },
            { label: "Copyright", value: bookData.copyright },
            // { label: "License Type", value: bookData.licenseType },
          ].map((item, i) => (
            <div key={i} className="space-y-2">
              <Label className="font-semibold text-gray-700">
                {item.label}
              </Label>
              <Input
                type="text"
                value={item.value || ""}
                readOnly
                className="text-sm text-gray-700 border-gray-300 rounded-md p-3 w-full bg-gray-100"
              />
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          {[
            { label: "Price", value: bookData.price },
            { label: "Currency", value: bookData.currency },
            { label: "Discount", value: bookData.discount },
          ].map((item, i) => (
            <div key={i} className="space-y-2">
              <Label className="font-semibold text-gray-700">
                {item.label}
              </Label>
              <Input
                type="text"
                value={item.value || ""}
                readOnly
                className="text-sm text-gray-700 border-gray-300 rounded-md p-3 w-full bg-gray-100"
              />
            </div>
          ))}
        </div>

        {/* Final Action */}
        <div className="flex justify-end pt-6 space-x-4">
          <Button
            variant="outline"
            onClick={prevStep}
            className="text-gray-700 border-gray-300 cursor-pointer hover:bg-gray-100"
          >
            Go Back
          </Button>
          <Button
            onClick={() => handleSave()}
            disabled={isLoading}
            className={`border border-gray-300 cursor-pointer ${
              isLoading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {isLoading ? "Saving..." : "Save as Draft"}
          </Button>

          <Button
            onClick={() => handleSave("pending")}
            disabled={isLoading}
            className={`text-white cursor-pointer ${
              isLoading
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            {isLoading ? "Submitting..." : "Submit for Review"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreviewStep;
