import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function EditStepTwoForm({
  nextStep,
  prevStep,
  setBookData,
  bookData,
}) {
  const [formData, setFormData] = useState({
    // hasIsbn: bookData.hasIsbn || "",
    // isbnNumber: bookData.isbnNumber || "",
    copyright: bookData.copyright || "",
    // licenseType: bookData.licenseType || "",
    drm: bookData.drm || false,
  });

  // console.log(bookData.copyright);

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
        <h2 className="text-lg font-semibold">Publishing Rights</h2>
        <p className="text-base text-gray-500">Copyright Settings</p>
      </div>

      <div className="bg-white border p-6 rounded-lg shadow-sm space-y-6">
        {/* ISBN Radio */}
        {/* <div className="space-y-2">
          <Label className="font-semibold text-gray-600">
            Do you have an ISBN?
          </Label>
          <div className="flex items-center space-x-6 mt-2">
            {["yes", "no"].map((val) => (
              <label key={val} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="hasIsbn"
                  value={val}
                  checked={formData.hasIsbn === val}
                  onChange={handleChange}
                  className="accent-yellow-500"
                />
                <span className="text-gray-600">
                  {val.charAt(0).toUpperCase() + val.slice(1)}
                </span>
              </label>
            ))}
          </div>
        </div> */}

        {/* Conditionally render ISBN Number field */}
        {/* {formData.hasIsbn === "yes" && (
          <div className="space-y-2">
            <Label className="font-semibold text-gray-600">
              Enter ISBN Number
            </Label>
            <Input
              name="isbnNumber"
              value={formData.isbnNumber}
              onChange={handleChange}
              className="mt-2"
              required
            />
          </div>
        )} */}

        {/* Copyright Ownership */}
        <div className="space-y-2">
          <Label className="font-semibold text-gray-600">
            Copyright Ownership*
          </Label>
          <Select
            value={formData.copyright} // bind the value
            disabled
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, copyright: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select copyright" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">I own full rights to</SelectItem>
              <SelectItem value="partial">
                I share rights with others
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* License Type */}
        {/* <div className="space-y-2">
          <Label className="font-semibold text-gray-600">License Type*</Label>
          <Select
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, licenseType: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select license type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
        </div> */}

        {/* DRM */}
        <div className="flex items-center space-x-3 mt-4">
          <input
            type="checkbox"
            id="drm"
            name="drm"
              disabled 
            checked={formData.drm}
            onChange={handleChange}
            className="accent-yellow-500"
          />
          <Label htmlFor="drm" className="text-sm text-gray-500">
            Enable DRM Protection (Prevent unauthorized sharing)
          </Label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-6 pt-6">
          <Button
            variant="outline"
            className="text-gray-600 cursor-pointer"
            onClick={prevStep}
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
