import React, { useState } from "react";
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
import { addGenre, fetchGenres } from "@/redux/slices/genreSlice";
import { Loader2 } from "lucide-react";

const initialState = {
  name: "",
  description: "",
};

const CreateGenre = () => {
  const [form, setForm] = useState(initialState);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const dispatch = useDispatch();

  const { statusAddGenre } = useSelector((state) => state.genre);

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
      const resultAction = await dispatch(addGenre(form)).unwrap();
      dispatch(fetchGenres());

      toast.success(resultAction?.message);
      setForm(initialState);
      setDialogOpen(false);
    } catch (err) {
      toast.error(err?.message);
    }
  };

  return (
    <div className="w-full md:w-auto flex px-6 justify-start md:justify-end">
      <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button className="cursor-pointer">
            <FaPlus className="mr-2  font-gilroy" /> Create Genre
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent className="max-w-lg w-full font-gilroy">
          <AlertDialogHeader className="w-full flex flex-col items-center">
            <AlertDialogTitle className="text-xl font-bold">
              Add Genre
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-500 text-center">
              Define a new category for your content.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <form className="space-y-4 mt-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Genre Name*
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

          <AlertDialogFooter className="mt-6 gap-2">
            <div className="w-full flex justify-between gap-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => setDialogOpen(false)}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  !form.name ||
                  !form.description ||
                  statusAddGenre === "loading"
                }
                className="disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
              >
                {statusAddGenre === "loading" && (
                  <Loader2 className="animate-spin w-4 h-4" />
                )}
                {statusAddGenre === "loading" ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CreateGenre;
