import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { FaPlus } from "react-icons/fa";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { createCategory, fetchCategories } from "@/redux/slices/supportTicketSlice";

const initialState = {
  name: "",
  description: "",
};

const CreateCategory = () => {
  const [form, setForm] = useState(initialState);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const dispatch = useDispatch();

  const { statusCreateCategory, error } = useSelector(
    (state) => state.supportTicket
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { name, description } = form;

    if (!name || !description) {
      toast.error("Both name and description are required.", {
        style: { background: "#000", color: "#fff" },
      });
      return;
    }

    try {
      const resultAction = await dispatch(createCategory(form)).unwrap();
      dispatch(fetchCategories());

      toast.success("Category Created", {
        description: resultAction?.message || `${form.name} has been added.`,
        style: { background: "#000", color: "#fff" },
      });

      setForm(initialState);
      setDialogOpen(false);
    } catch (err) {
      // This catches unexpected issues; Redux errors handled in useEffect
      toast.error(err?.message || "Something went wrong.", {
        style: { background: "#000", color: "#fff" },
      });
    }
  };

  // Show Redux error toast
  useEffect(() => {
    if (statusCreateCategory === "failed" && error) {
      toast.error(error, {
        style: { background: "#000", color: "#fff" },
      });
    }
  }, [statusCreateCategory, error]);

  return (
    <div className="w-full md:w-auto flex px-6 justify-start md:justify-end">
      <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button className="gap-2">
            <FaPlus /> Create Category
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent className="max-w-lg w-full md:mx-4 sm:mx-auto">
          <AlertDialogHeader className="w-full flex flex-col items-center">
            <AlertDialogTitle className="text-xl font-bold">
              Add Category
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-500 mt-1">
              Define a new category for your content.
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
          </form>

          <AlertDialogFooter className="mt-6">
            <div className="w-full flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 justify-end">
              <Button
                variant="outline"
                type="button"
                onClick={() => setDialogOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  !form.name ||
                  !form.description ||
                  statusCreateCategory === "loading"
                }
                className="w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {statusCreateCategory === "loading" ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CreateCategory;
