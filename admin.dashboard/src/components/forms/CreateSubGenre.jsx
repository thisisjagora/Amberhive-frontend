import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { addSubGenre, fetchSubGenres } from "@/redux/slices/genreSlice";
import { FaPlus } from "react-icons/fa";

const CreateSubGenre = ({ genres }) => {
  const [parentGenreId, setParentGenreId] = useState("");
  const [subGenreName, setSubGenreName] = useState("");
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const { statusAddSubGenre } = useSelector((state) => state.genre);

  const resetForm = () => {
    setParentGenreId("");
    setSubGenreName("");
  };

  const handleSubmit = async () => {
    if (!parentGenreId || !subGenreName.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    const formData = {
      name: subGenreName.trim(),
      category_id: parentGenreId,
    };

    try {
      const response = await dispatch(addSubGenre(formData)).unwrap();
      dispatch(fetchSubGenres());
      toast.success(response?.message);
      resetForm();
      setOpen(false);
    } catch (err) {
      toast.error(err || "Failed to create sub-genre.");
    }
  };

  const handleCancel = () => {
    resetForm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <FaPlus className="mr-2  font-gilroy" /> Create Sub-Genre
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Sub-Genre</DialogTitle>
          <DialogDescription>
            Add a new sub-genre under an existing genre.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Genre Select */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="genre">Genre</Label>
            <Select value={parentGenreId} onValueChange={setParentGenreId}>
              <SelectTrigger id="genre" className="w-full">
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent className="w-full font-gilroy">
                {genres.map((genre) => (
                  <SelectItem key={genre.id} value={genre.id}>
                    {genre.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sub-Genre Name */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="subgenre">Sub-Genre Name</Label>
            <Input
              id="subgenre"
              placeholder="Enter sub-genre name"
              value={subGenreName}
              onChange={(e) => setSubGenreName(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse md:flex-row gap-2 mt-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={statusAddSubGenre === "loading"}
            className="w-full md:w-auto cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={statusAddSubGenre === "loading"}
            className="w-full md:w-auto cursor-pointer"
          >
            {statusAddSubGenre === "loading" ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSubGenre;
