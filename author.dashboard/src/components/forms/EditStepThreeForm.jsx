import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function EditStepThreeForm({
  nextStep,
  prevStep,
  setBookData,
  bookData,
}) {
  const [formData, setFormData] = useState({
    price: bookData.price || "",
    currency: bookData.currency || "",
    discount: bookData.discount || "",
    duration: bookData.duration || "",
    // monthly_book_limit: bookData.monthly_book_limit || "",
  });

  // console.log(bookData.duration);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    setBookData((prev) => ({
      ...prev,
      ...formData,
    }));
    nextStep();
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold">Pricing</h2>
        <p className="text-base text-gray-500">Setting Price, Discounts</p>
      </div>

      <div className="bg-white border p-6 rounded-lg shadow-sm space-y-4">
        {/* Price Input Section */}
        <div className="flex flex-col space-y-4">
          <Label className="font-semibold text-gray-600">Price*</Label>
          <div className="flex items-center space-x-2">
            {/* Currency Selector */}
            <Select
              value={formData.currency}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, currency: value }))
              }
            >
              <SelectTrigger className="">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usd">USD ($)</SelectItem>
                <SelectItem value="ngn">NGN (₦)</SelectItem>
              </SelectContent>
            </Select>
            {/* Price Input Field */}
            <Input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder={formData.currency === "usd" ? "$950.00" : "₦950.00"}
              className="flex-1 p-3 border  border-gray-300 rounded-md"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        {/* Discount & Duration (read-only) */}
        <div className="flex space-x-4">
          <div className="flex-1 space-y-4">
            <Label className="font-semibold text-gray-600">Discount</Label>
            <Input
              type="number"
                disabled 
              value={formData.discount}
              readOnly
              className="p-3 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-gray-600"
            />
          </div>
          <div className="flex-1 space-y-4">
            <Label className="font-semibold text-gray-600">Duration</Label>
            <Input
              type="text"
                disabled 
              value={formData.duration?.split(" ")[0] || ""}
              readOnly
              className="p-3 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-gray-600"
            />
          </div>
        </div>

        {/* <div className="space-y-2">
          <Label className="font-semibold text-gray-600">
            Monthly Book Limit
          </Label>
          <Input
            name="monthly_book_limit"
            type="number"
            min="1"
            value={formData.monthly_book_limit}
            onChange={handleChange}
            placeholder="e.g. 5"
            className="font-semibold text-gray-600"
            required
          />
        </div> */}

        {/* Buttons */}
        <div className="flex justify-end gap-6 pt-6">
          <Button
            variant="outline"
            onClick={prevStep}
            className="text-gray-600 cursor-pointer"
          >
            Back
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-black text-white cursor-pointer"
          >
            Save and Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
