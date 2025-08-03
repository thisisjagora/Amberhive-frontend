import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  MoreVertical,
  MoreHorizontal,
  Pencil,
  Zap,
  Trash2,
  Eye,
  Loader,
} from "lucide-react";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { fetchMyDrafts, trashBook } from "@/redux/slices/bookSlice";
import { useDispatch, useSelector } from "react-redux";

export const CellAction = ({ data, viewMode }) => {
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { statusTrashBook } = useSelector((state) => state.books);
  const handleOpenDialog = () => {
    // Wait a bit for DropdownMenu to close before opening dialog
    setTimeout(() => setShowDialog(true), 100);
  };

  const handleDelete = async () => {
    try {
      const result = await dispatch(trashBook(data.id)).unwrap();
      dispatch(fetchMyDrafts());
      toast.success("Book deleted", {
        description: result?.message || `${data.name} has been removed.`,
        className: "bg-red-600 text-white",
      });

      setShowDialog(false); // close the dialog/modal
    } catch (error) {
      toast.error("Delete failed", {
        description:
          error?.message || "An error occurred while deleting the book.",
      });
    }
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-5 w-5 p-0">
            <span className="sr-only">Open menu</span>
            {viewMode === "grid" ? (
              <MoreHorizontal className="h-4 w-4" />
            ) : (
              <MoreVertical className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              navigate(`/dashboard/publications/book/${data.id}`);
            }}
          >
            <Eye className="mr-2 h-4 w-4 text-gray-700" /> View
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              navigate(`/dashboard/publications/edit-draft/${data.id}`);
            }}
          >
            <Pencil className="mr-2 h-4 w-4" /> Edit Draft
          </DropdownMenuItem>

          {/* Delete triggers alert dialog after dropdown closes */}
          <DropdownMenuItem
            className="text-red-600 focus:bg-red-50"
            onSelect={(e) => {
              e.preventDefault();
              handleOpenDialog();
            }}
          >
            <Trash2 className="mr-2 h-4 w-4 text-red-600" /> Trash
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Alert Dialog (separate from DropdownMenu) */}
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader className="flex items-center justify-center gap-2">
            <div className="flex items-center justify-center bg-red-100 p-2 rounded-full">
              <div className="flex items-center justify-center bg-red-200 p-2 rounded-full">
                <AiOutlineExclamationCircle className="text-red-600 text-xl" />
              </div>
            </div>

            <div className="flex flex-col gap-6 justify-center items-center">
              <AlertDialogTitle className="text-2xl">
                Confirm Delete
              </AlertDialogTitle>
              <p className="text-base text-center text-gray-500">
                Are you sure you want to delete this book?{" "}
                <span className="font-[700] text-gray-800">{data.name}</span>{" "}
                This action cannot be undone.
              </p>
            </div>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <div className="flex justify-between w-full">
              <AlertDialogCancel disabled={statusTrashBook === "loading"}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
                disabled={statusTrashBook === "loading"}
              >
                {statusTrashBook === "loading" ? (
                  <span className="flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    Deleting...
                  </span>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
