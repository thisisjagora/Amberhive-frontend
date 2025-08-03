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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { createTicket, fetchCategories, fetchMyTickets } from "@/redux/slices/ticketSlice";


const initialState = {
  subject: "",
  description: "",
  category: "",
  image: null,
};

const CreateTicket = () => {
  const [form, setForm] = useState(initialState);
  const [isMainDialogOpen, setMainDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();

  const { categories } = useSelector((state) => state.tickets);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  //   console.log(categories);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === "file") {
      setForm((prev) => ({ ...prev, [name]: files[0] || null }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCategoryChange = (value) => {
    setForm((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = async () => {
    const { subject, description, category, image } = form;

    if (!subject || !description || !category) {
      toast.error("Please fill all required fields.", {
        style: { background: "#000", color: "#fff" },
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("subject", subject);
      formData.append("description", description);
      formData.append("category", parseInt(category, 10));
      if (image) formData.append("image", image);

      const response = await dispatch(createTicket(formData)).unwrap();

      await dispatch(fetchMyTickets());

      toast.success(response.message || "Ticket submitted successfully!", {
        style: { background: "#000", color: "#fff" },
      });

      setForm(initialState);
      setMainDialogOpen(false);
    } catch (err) {
      toast.error("Something went wrong.", {
        style: { background: "#000", color: "#fff" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="md:w-full flex md:px-6 justify-start md:justify-end">
      <AlertDialog open={isMainDialogOpen} onOpenChange={setMainDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button className={`cursor-pointer`}>
            <FaPlus className="mr-2" /> Create Ticket
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="max-w-lg w-full">
          <AlertDialogHeader className="w-full flex flex-col items-center">
            <AlertDialogTitle className="text-xl font-bold">
              Create Ticket
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-500 text-center">
              Describe the issue and we’ll get back to you ASAP.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <form className="space-y-4 mt-4">
            {/* Subject */}
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Subject*
              </Label>
              <Input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="mt-1"
                placeholder="e.g. Error While Subscribing to Premium Plan"
              />
            </div>

            {/* Description */}
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Description*
              </Label>
              <Textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="mt-1"
                rows={5}
                placeholder="Provide a detailed explanation of the issue..."
              />
            </div>

            {/* Category */}
            <Select value={form.category} onValueChange={handleCategoryChange}>
              <SelectTrigger className="mt-1 w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Image Upload */}
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Image (optional)
              </Label>
              <div className="mt-1 border-2 border-dashed border-gray-300 p-4 text-center rounded-md bg-gray-50 hover:bg-gray-100 transition">
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
                  <p className="text-sm text-gray-600 mt-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-400">JPEG/PNG (Max. 10mb)</p>
                </label>
                {form.image && (
                  <p className="mt-2 text-sm text-green-600">
                    {form.image.name}
                  </p>
                )}
              </div>
            </div>
          </form>

          {/* Footer Buttons */}
          <AlertDialogFooter className="mt-6">
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
                  isSubmitting ||
                  !form.subject ||
                  !form.description ||
                  !form.category
                }
                className="disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CreateTicket;
