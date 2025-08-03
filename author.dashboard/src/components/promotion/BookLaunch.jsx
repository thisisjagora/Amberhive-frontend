import React, { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

import BookLaunchIcon from "@/assets/icons/book-launch-icon.png";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import {
  createCampaign,
  getCampaignDrafts,
} from "@/redux/slices/emailCampaignSlice";

const initialState = {
  coverImage: null,
  content: "",

  subject: "",
  link: "",
};

const BookLaunch = () => {
  const [formData, setFormData] = useState(initialState);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const { statusCreateCampaign } = useSelector((state) => state.emailCampaign);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, coverImage: file }));
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { coverImage, content, subject, link } = formData;

    if (!coverImage || !content || !subject || !link) {
      toast.error("All fields are required!");
      return;
    }

    const payload = new FormData();
    payload.append("cover_image", coverImage);
    payload.append("content", content);
    payload.append("subject", subject);
    payload.append("link", link);

    // 🔍 Log payload content
    // for (const [key, value] of payload.entries()) {
    //   console.log(`${key}:`, value);
    // }

    try {
      const res = await dispatch(createCampaign(payload)).unwrap();
      dispatch(getCampaignDrafts());
      toast.success(res.message || "Campaign request submitted successfully!");
      setFormData(initialState); // reset the form
      setIsOpen(false); // close the modal
    } catch (err) {
      toast.error(err.message || "Failed to submit campaign.");
      console.error(err);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <div
        onClick={() => setIsOpen(true)}
        className="flex flex-col items-center justify-center border-2 cursor-pointer rounded-md p-14 mt-4 mb-2 hover:bg-accent transition-colors"
      >
        <img
          src={BookLaunchIcon}
          alt="Book Icon"
          className="w-10 h-10 mb-2 object-cover rounded"
        />
        <div className="max-w-[200px] text-center mt-4">
          <h1 className="font-medium">Book Launch Announcement</h1>
        </div>
      </div>

      <AlertDialogContent className="max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader className="flex flex-col items-center text-center">
          <AlertDialogTitle>New Campaign Request</AlertDialogTitle>
          <AlertDialogDescription>
            Use this form to submit a new campaign request.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="subject">Subject Title*</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cover-image">Upload Cover Image</Label>
            <div className="border-2 border-dashed border-gray-300 p-4 text-center rounded-md relative">
              <Input
                type="file"
                id="cover-image"
                className="hidden"
                onChange={handleFileChange}
                accept="image/jpeg,image/png"
              />
              <label
                htmlFor="cover-image"
                className="cursor-pointer block text-sm"
              >
                <FaCloudUploadAlt className="text-2xl text-gray-500 mb-1 mx-auto" />
                <span className="text-yellow-500">Click to upload</span> or drag
                and drop
                <p className="text-xs text-gray-500 mt-1">
                  JPEG/PNG - 1600x2400px (Max. 10mb)
                </p>
              </label>
              {formData.coverImage && (
                <p
                  className="text-sm text-green-600 mt-3 truncate"
                  title={formData.coverImage.name}
                >
                  Selected file: {formData.coverImage.name}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="content">Book Description</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={handleInputChange}
            />
            <p className="text-xs text-muted-foreground">
              {formData.content.length} / 1000
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="link">Link to Purchase</Label>
            <Input
              id="link"
              type="url"
              placeholder="https://amber-hive.com"
              value={formData.link}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex flex-col md:flex-row items-center md:justify-between gap-3 pt-2">
            <AlertDialogCancel
              type="button"
              className="w-full md:w-auto h-10 px-6 cursor-pointer rounded-md border border-input bg-transparent hover:bg-accent text-sm"
            >
              Cancel
            </AlertDialogCancel>
            <Button
              type="submit"
              disabled={statusCreateCampaign === "loading"}
              className="w-full md:w-auto h-10 cursor-pointer px-6 rounded-md text-sm font-medium bg-primary text-white hover:bg-primary/90"
            >
              {statusCreateCampaign === "loading" ? "Submitting..." : "Save"}
            </Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BookLaunch;
