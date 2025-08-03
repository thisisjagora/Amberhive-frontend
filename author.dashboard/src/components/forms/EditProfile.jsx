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
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  fetchAuthorProfile,
  updateAuthorProfile,
} from "@/redux/slices/profileSlice";
import { Textarea } from "../ui/textarea";

const EditProfile = () => {
  const dispatch = useDispatch();
  const { profile, status } = useSelector((state) => state.profile);

  const [phone, setPhone] = useState(profile?.address_details?.phone || "");
  const [imageFile, setImageFile] = useState(null);
  const [bio, setBio] = useState(profile?.bio || "");
  const [website, setWebsite] = useState(profile?.website || "");
  const [facebook, setFacebook] = useState(profile?.facebook || "");
  const [instagram, setInstagram] = useState(profile?.instagram || "");
  const [twitter, setTwitter] = useState(profile?.x || "");
  const [linkedin, setLinkedin] = useState(profile?.linkedin || "");

  const imageInputRef = useRef(null);
  const dialogCloseRef = useRef(null);

  const isLoading = status === "loading";

  const handleImageClick = () => {
    imageInputRef.current?.click();
  };

const handleSave = async () => {
  const formData = new FormData();
  formData.append("phone", phone);
  formData.append("bio", bio);
  formData.append("website", website);
  formData.append("facebook", facebook);
  formData.append("instagram", instagram);
  formData.append("x", twitter); // or "twitter"
  formData.append("linkedin", linkedin);
  if (imageFile) formData.append("profile_image", imageFile);

  const storedUser = localStorage.getItem("user");
  let id = null;

  if (storedUser) {
    const user = JSON.parse(storedUser);
    id = user.author_id;
  }

  try {
    const result = await dispatch(
      updateAuthorProfile({ id, formData })
    ).unwrap();
    dispatch(fetchAuthorProfile());
    toast.success(result?.message || "Profile updated successfully");
    dialogCloseRef.current?.click();
  } catch (error) {
    toast.error(typeof error === "string" ? error : "Failed to update profile");
  }
};





  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="default"
          size="sm"
          className="rounded-md h-9 px-4 text-sm flex cursor-pointer items-center gap-2"
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

        <div className="space-y-4 py-2 max-h-[400px] overflow-auto">
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

          {/* Bio */}
          <div>
            <Label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-600"
            >
              Bio
            </Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          {/* Website */}
          <div>
            <Label
              htmlFor="website"
              className="block text-sm font-medium text-gray-600"
            >
              Website
            </Label>
            <Input
              id="website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          {/* Facebook */}
          <div>
            <Label
              htmlFor="facebook"
              className="block text-sm font-medium text-gray-600"
            >
              Facebook
            </Label>
            <Input
              id="facebook"
              type="url"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
            />
          </div>

          {/* Instagram */}
          <div>
            <Label
              htmlFor="instagram"
              className="block text-sm font-medium text-gray-600"
            >
              Instagram
            </Label>
            <Input
              id="instagram"
              type="url"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />
          </div>

          {/* X / Twitter */}
          <div>
            <Label
              htmlFor="x"
              className="block text-sm font-medium text-gray-600"
            >
              X (Twitter)
            </Label>
            <Input
              id="x"
              type="url"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
            />
          </div>

          {/* LinkedIn */}
          <div>
            <Label
              htmlFor="linkedin"
              className="block text-sm font-medium text-gray-600"
            >
              LinkedIn
            </Label>
            <Input
              id="linkedin"
              type="url"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button ref={dialogCloseRef} className="cursor-pointer" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSave} className="cursor-pointer" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfile;
