import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FiUploadCloud } from "react-icons/fi";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { FaPlus } from "react-icons/fa";
import { registerUser } from "@/redux/slices/authSlice";
import { fetchAdmins } from "@/redux/slices/usersSlice";

const initialState = {
  name: "",
  email: "",
  role: "",
  password: "",
  image: null,
};

const CreateAdmin = () => {
  const [form, setForm] = useState(initialState);
  const [isMainDialogOpen, setMainDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);

  // Generic change handler for text inputs and file input
  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === "file") {
      setForm((prev) => ({ ...prev, [name]: files[0] || null }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Special handler for Select component since it doesn't use event.target
  const handleRoleChange = (value) => {
    setForm((prev) => ({ ...prev, role: value }));
  };

  const handleSubmit = async () => {
    const { name, email, role, password, image } = form;

    if (!name || !email || !role || !password) {
      toast.error("Please fill out all required fields.", {
        style: { background: "#000", color: "#fff" },
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("role", role);
    formData.append("password", password);
    if (image) {
      formData.append("image", image);
    }

    try {
      const resultAction = await dispatch(registerUser(formData)).unwrap();

      dispatch(fetchAdmins())

      // toast.success(resultAction?.message);
      toast.success("Admin registered successfully");
      

      // Reset form and close dialog
      setForm(initialState);
      setMainDialogOpen(false);
    } catch (err) {
      toast.error(err?.message);
    }
  };

  return (
    <div className="w-full md:w-auto flex px-6 justify-start md:justify-end">
      <AlertDialog open={isMainDialogOpen} onOpenChange={setMainDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button className="cursor-pointer">
            <FaPlus className="mr-2 font-gilroy" /> Add Admin
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="max-w-lg w-full font-gilroy">
          <AlertDialogHeader className="w-full flex flex-col items-center">
            <AlertDialogTitle className="text-xl font-bold">
              Add Admin
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-500 text-center">
              Engage on our 24/7 support
            </AlertDialogDescription>
          </AlertDialogHeader>

          <form className="space-y-4 mt-4">
            {/* Full name */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Full Name*
              </label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Email Address*
              </label>
              <Input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Password*
              </label>
              <Input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            {/* Assign Role */}
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Assign Role*
              </Label>
              <Select onValueChange={handleRoleChange} value={form.role}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="font-gilroy">
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="super admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Image Upload */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Image (Optional)
              </label>
              <div className="mt-1 border-2 border-dashed border-gray-300 p-4 text-center rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                <input
                  type="file"
                  name="image"
                  accept="image/png, image/jpeg"
                  onChange={handleChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer block">
                  <FiUploadCloud className="mx-auto text-3xl text-gray-400" />
                  <span className="text-xs text-yellow-500">
                    Click to upload
                  </span>
                  <span className="text-xs text-gray-500">
                    or drag and drop
                  </span>
                  <br />
                  <span className="text-xs text-gray-400">
                    JPEG/PNG - Recommended 1600x2400px (Max. 10mb)
                  </span>
                </label>
                {form.image && (
                  <p className="mt-2 text-sm text-green-600">
                    {form.image.name}
                  </p>
                )}
                {/* {form.image && (
                  <>
                  <div className="flex flex-col justify-center items-center">

                    <p className="mt-2 text-sm text-green-600">
                      {form.image.name}
                    </p>
                    <img
                      src={URL.createObjectURL(form.image)}
                      alt="preview"
                      className="mt-2 w-24 h-24 object-cover rounded"
                      onLoad={() => URL.revokeObjectURL(form.image)}
                    />
                  </div>
                  </>
                )} */}
              </div>
            </div>
          </form>

          {/* Footer Buttons */}
          <AlertDialogFooter className="mt-6 gap-2">
            <div className="w-full flex justify-between gap-4">
              <Button
                variant="outline"
                type="button"
                className={`cursor-pointer`}
                onClick={() => setMainDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  status === "loading" ||
                  !form.name ||
                  !form.email ||
                  !form.role ||
                  !form.password
                }
                className="disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                {status === "loading" ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CreateAdmin;
