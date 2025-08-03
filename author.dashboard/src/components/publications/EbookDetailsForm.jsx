import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FaCircle, FaCloudUploadAlt } from "react-icons/fa";
import {
  FaBold,
  FaItalic,
  FaLink,
  FaListUl,
  FaListOl,
  FaAlignLeft,
} from "react-icons/fa";

const EbookDetailsForm = () => {
  return (
    <>
      <div className=" p-6 w-full max-w-[800px] mx-auto mt-20 bg-white rounded-lg shadow-xs">
        <div className="flex flex-col items-center justify-between ">
          <h3 className="text-xl font-semibold text-gray-700">Ebook Details</h3>
          <p className="text-gray-600 mb-4">Title & Metadata Entry</p>
        </div>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label
              htmlFor="bookTitle"
              className="text-sm font-semibold text-gray-700"
            >
              Book Title*
            </Label>
            <Input
              id="bookTitle"
              className="rounded-md border-2 py-[18px] border-gray-200 focus:ring-0 focus:border-gray-200"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="subtitle"
              className="text-sm font-medium text-gray-700"
            >
              Subtitle (Optional)
            </Label>
            <Input
              id="subtitle"
              // placeholder="Enter subtitle (optional)"
              className="rounded-md border-2 py-[18px] border-gray-200 focus:ring-0 focus:border-gray-200"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="genre"
              className="text-sm font-medium text-gray-700"
            >
              Genre*
            </Label>
            <Select>
              <SelectTrigger className="w-full rounded-md shadow-sm border-gray-300 focus-visible:ring-primary/50 focus:outline-none focus-visible:ring-2 bg-white text-gray-700">
                <span className="truncate">Fiction</span>
              </SelectTrigger>
              <SelectContent className="rounded-md border-2 py-[18px] border-gray-200 focus:ring-0 focus:border-gray-200">
                <SelectItem value="fiction">Fiction</SelectItem>
                <SelectItem value="non-fiction">Non-Fiction</SelectItem>
                <SelectItem value="science-fiction">Science Fiction</SelectItem>
                {/* Add more genre options as needed */}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags" className="text-sm font-medium text-gray-700">
              Tags
            </Label>
            <Input
              id="tags"
              placeholder="Enter tags"
              className="rounded-md shadow-sm border-gray-300 focus-visible:ring-primary/50 focus:outline-none focus-visible:ring-2"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="author"
              className="text-sm font-medium text-gray-700"
            >
              Name of Author*
            </Label>
            <Select>
              <SelectTrigger className="w-full rounded-md shadow-sm border-gray-300 focus-visible:ring-primary/50 focus:outline-none focus-visible:ring-2 bg-white text-gray-700">
                <span className="truncate">Habibah Mudathir</span>
              </SelectTrigger>
              <SelectContent className="rounded-md border-2 py-[18px] border-gray-200 focus:ring-0 focus:border-gray-200">
                <SelectItem value="habibah-mudathir">
                  Habibah Mudathir
                </SelectItem>
                {/* Add more author options or make it an input if needed */}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="bookDescription"
              className="text-sm font-medium text-gray-700"
            >
              Book Description
            </Label>
            <div className="rounded-md shadow-sm border border-gray-300 bg-white">
              <div className="flex items-center p-2 text-gray-500 border-b border-gray-200">
                <Button variant="ghost" size="icon" className="mr-2 h-8 w-8">
                  <FaBold className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="mr-2 h-8 w-8">
                  <FaItalic className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="mr-2 h-8 w-8">
                  <FaLink className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="mr-2 h-8 w-8">
                  <FaListUl className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="mr-2 h-8 w-8">
                  <FaListOl className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <FaAlignLeft className="h-4 w-4" />
                </Button>
              </div>
              <Textarea
                id="bookDescription"
                placeholder="Enter book description"
                className="h-32 resize-none rounded-none border-none focus-visible:ring-primary/50 focus:outline-none focus-visible:ring-2"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">1000</p>{" "}
            {/* Assuming this is a character count */}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="coverImage"
              className="text-sm font-medium text-gray-700"
            >
              Upload Cover Image
            </Label>
            <div className="relative border rounded-md border-dashed border-gray-400 bg-gray-50 p-6 flex flex-col items-center justify-center">
              <FaCloudUploadAlt className="w-10 h-10 text-gray-500 mb-2" />
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-[#F6A920] cursor-pointer">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                JPEG/PNG - Recommended 1600x2400px (Max. 10mb)
              </p>
              <input
                type="file"
                id="coverImage"
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                accept="image/jpeg, image/png"
                // You'll need to handle file selection and state updates
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="ebookFile"
              className="text-sm font-medium text-gray-700"
            >
              Upload Ebook
            </Label>
            <div className="relative border rounded-md border-dashed border-gray-400 bg-gray-50 p-6 flex flex-col items-center justify-center">
              <FaCloudUploadAlt className="w-10 h-10 text-gray-500 mb-2" />
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-[#F6A920] cursor-pointer">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PDF/ePub/MOBI (Max. 100mb)
              </p>
              <input
                type="file"
                id="ebookFile"
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                accept="application/pdf, application/epub+zip, application/x-mobipocket-ebook"
                // You'll need to handle file selection and state updates
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline">Save As Draft</Button>
          <Button>Save and Continue</Button>
        </div>
      </div>
    </>
  );
};

export default EbookDetailsForm;
