import React, { useEffect, useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyBooks } from "@/redux/slices/bookSlice";
import Release from "@/assets/icons/release-icon.png";
import { toast } from "sonner";
import {
  createCampaign,
  getCampaignDrafts,
} from "@/redux/slices/emailCampaignSlice";

const initialState = {
  ebook: "",
  coverImage: null,
  content: "",
};

const NewRelease = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(initialState);

  const dispatch = useDispatch();
  const { myBooks } = useSelector((state) => state.books);

  const { statusCreateCampaign } = useSelector((state) => state.emailCampaign);

  useEffect(() => {
    dispatch(fetchMyBooks());
  }, [dispatch]);

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
    const { ebook, subjectTitle, coverImage, content } = formData;

    if (!ebook || !subjectTitle || !coverImage || !content) {
      toast.error("All fields are required!");
      return;
    }

    const payload = new FormData();
    payload.append("ebook", ebook);
    payload.append("subject", subjectTitle);
    payload.append("cover_image", coverImage);
    payload.append("content", content);

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
          src={Release}
          alt="Release Icon"
          className="w-10 h-10 mb-2 object-cover rounded"
        />
        <div className="max-w-[140px] text-center mt-4">
          <h1 className="font-medium">New Release Update</h1>
        </div>
      </div>

      <AlertDialogContent className="max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader className="flex flex-col items-center text-center">
          <AlertDialogTitle>New Release Update</AlertDialogTitle>
          <AlertDialogDescription>
            Use this form to submit a new release update.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="subjectTitle">Subject Title*</Label>
            <Input
              id="subjectTitle"
              value={formData.subjectTitle}
              onChange={handleInputChange}
              placeholder="Get 20% Off My New eBook!"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ebook">Book*</Label>
            <Select
              value={formData.ebook}
              onValueChange={(val) =>
                setFormData((prev) => ({ ...prev, ebook: val }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select ebook" />
              </SelectTrigger>
              <SelectContent className="font-gilroy">
                {myBooks.length > 0 ? (
                  myBooks.map((bookItem) => (
                    <SelectItem key={bookItem.id} value={bookItem.title}>
                      {bookItem.title}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-muted-foreground">
                    No books found
                  </div>
                )}
              </SelectContent>
            </Select>
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
            <Label htmlFor="content">Description</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={handleInputChange}
            />
            <p className="text-xs text-muted-foreground">
              {formData.content.length} / 1000
            </p>
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
              className="w-full md:w-auto h-10 px-6 cursor-pointer rounded-md text-sm font-medium bg-primary text-white hover:bg-primary/90"
            >
              {statusCreateCampaign === "loading" ? "Submitting..." : "Save"}
            </Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default NewRelease;
