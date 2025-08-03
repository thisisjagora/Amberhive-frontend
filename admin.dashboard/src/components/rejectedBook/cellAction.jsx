import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreVertical, MoreHorizontal, Pencil, Zap, Eye } from "lucide-react";
import { useNavigate } from "react-router";
import { TbFileCheck } from "react-icons/tb";
import { MdOutlineBlock } from "react-icons/md";
import { FiEye } from "react-icons/fi";

export const CellAction = ({ data, viewMode }) => {
  const navigate = useNavigate();

  // const handleDelete = () => {
  //   // Replace with real delete logic
  //   console.log("Deleted:", data.id);
  //   // toast.success(`"${data.name}" has been deleted successfully.`);
  //   toast.success("Book deleted", {
  //     description: `${data.name} has been removed.`,
  //     className: "bg-red-600 text-white",
  //   });
  //   setShowDialog(false);
  // };

  // const handleOpenDialog = () => {
  //   // Wait a bit for DropdownMenu to close before opening dialog
  //   setTimeout(() => setShowDialog(true), 100);
  // };

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
          <DropdownMenuItem>
            <TbFileCheck className="mr-2 text-gray-700" /> Approve
          </DropdownMenuItem>
          <DropdownMenuItem>
            <MdOutlineBlock className="mr-2 text-gray-700" /> Reject
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              navigate(
                `/admin/content-management/book-approvals/${data.id}`
              );
            }}
          >
            <FiEye className="mr-2 text-gray-700" /> View Request
          </DropdownMenuItem>

          {/* Delete triggers alert dialog after dropdown closes */}
          {/* <DropdownMenuItem
            className="text-red-600 focus:bg-red-50"
            onSelect={(e) => {
              e.preventDefault();
              handleOpenDialog();
            }}
          >
            <Trash2 className="mr-2 h-4 w-4 text-red-600" /> Delete
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Alert Dialog (separate from DropdownMenu)
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
                <span className="font-[700] text-gray-800"> {data.name}</span>{" "}
                This action cannot be undone.
              </p>
            </div>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <div className="flex justify-between w-full">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
    </>
  );
};
