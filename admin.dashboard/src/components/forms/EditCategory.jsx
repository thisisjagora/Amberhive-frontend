import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import {
  updateCategory,
  fetchCategories,
} from "@/redux/slices/supportTicketSlice";

const EditCategory = ({ editData, isOpen, onClose }) => {
  const [form, setForm] = useState({ name: "", description: "" });
  const dispatch = useDispatch();

  const { statusUpdateCategory, error } = useSelector(
    (state) => state.supportTicket
  );

  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name || "",
        description: editData.description || "",
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.description) {
      toast.error("All fields are required.");
      return;
    }

    try {
      const result = await dispatch(
        updateCategory({ id: editData.id, ...form })
      ).unwrap();
      toast.success(result.message || "Category updated.");
      dispatch(fetchCategories());
      onClose();
    } catch (err) {
      toast.error(err?.message || "Failed to update category.");
    }
  };


  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-lg w-full md:mx-4 sm:mx-auto">
        <AlertDialogHeader className="w-full flex flex-col items-center">
          <AlertDialogTitle className="text-xl font-bold">
            Edit Category
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-gray-500 text-center">
            Update the category details below.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form className="space-y-4 mt-4">
          <div>
            <Label className="text-sm font-medium text-gray-700">
              Category Name*
            </Label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">
              Description*
            </Label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
{/* 
          {error && (
            <p className="text-sm text-red-500 mt-1">
              {typeof error === "string" ? error : "An error occurred."}
            </p>
          )} */}
        </form>

        <AlertDialogFooter className="mt-6">
          <div className="w-full flex flex-col-reverse md:flex-row justify-end items-stretch md:items-center gap-3 md:gap-4">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              className="w-full md:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                !form.name ||
                !form.description ||
                statusUpdateCategory === "loading"
              }
              className="w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {statusUpdateCategory === "loading" ? "Updating..." : "Update"}
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditCategory;
