import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pen, UploadCloud } from "lucide-react";
import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "@/redux/slices/authSlice";
import { toast } from "sonner";

const EditProfile = () => {
  const dispatch = useDispatch();
  const { profile, updateProfileStatus } = useSelector((state) => state.auth);

  const [phone, setPhone] = useState(profile?.user?.phone || "");
  const [imageFile, setImageFile] = useState(null);

  const imageInputRef = useRef(null);
  const dialogCloseRef = useRef(null);

  const isLoading = updateProfileStatus === "loading";

  const handleImageClick = () => {
    imageInputRef.current?.click();
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("phone", phone);
    if (imageFile) formData.append("image", imageFile);

    try {
      const result = await dispatch(updateProfile(formData)).unwrap();
      toast.success(result?.message || "Profile updated successfully");
      dialogCloseRef.current?.click();
    } catch (error) {
      toast.error(error?.message || "Failed to update profile");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="default"
          size="sm"
          className="rounded-md h-9 px-4 text-sm flex items-center gap-2"
        >
          <Pen className="w-4 h-4" />
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md font-gilroy">
        <DialogHeader className="flex flex-col items-center text-center space-y-1">
          <DialogTitle className="text-lg font-semibold">
            Edit Profile
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Update your phone number or profile image.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Phone Field */}
          <div>
            <Label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-600"
            >
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            />
          </div>

          {/* Image Upload */}
          <div
            className="border rounded-md p-6 text-center bg-gray-50 cursor-pointer"
            onClick={handleImageClick}
          >
            <UploadCloud className="mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-yellow-600 font-medium">
              Click to upload
            </p>
            <p className="text-xs text-gray-500">
              or drag and drop <br />
              JPEG/PNG - Recommended 1600×2400px (Max. 10mb)
            </p>

            {imageFile && (
              <>
                <p className="text-sm text-green-600 mt-2">
                  Selected: {imageFile.name}
                </p>
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  className="w-20 h-20 rounded-full object-cover mx-auto mt-2 border"
                />
              </>
            )}

            <Input
              type="file"
              accept="image/*"
              ref={imageInputRef}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImageFile(file);
                }
              }}
            />
          </div>
        </div>

        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button ref={dialogCloseRef} variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfile;
