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
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import {
  MoreVertical,
  MoreHorizontal,
  Pencil,
  Zap,
  Trash2,
  Eye,
} from "lucide-react";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { FiUser } from "react-icons/fi";
import { BsCart2, BsEnvelopePaper } from "react-icons/bs";
import { MdOutlineBlock } from "react-icons/md";

export const CellAction = ({ data, viewMode }) => {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showOrdersDialog, setShowOrdersDialog] = useState(false);

  const handleDelete = () => {
    console.log("Deleted:", data.id);
    toast.success("Book deleted", {
      description: `${data.name} has been removed.`,
      className: "bg-red-600 text-white",
    });
    setShowDeleteDialog(false);
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
              setTimeout(() => setShowOrdersDialog(true), 100);
            }}
          >
            <BsCart2 className="mr-2 text-[18px] text-gray-700" /> View Orders
          </DropdownMenuItem>

          <DropdownMenuItem>
            <BsEnvelopePaper className="mr-2 text-[18px] text-gray-700" />{" "}
            Contact Buyer
          </DropdownMenuItem>

          <DropdownMenuItem>
            <MdOutlineBlock className="mr-2 text-[18px] text-gray-700" /> Block
            Buyer
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Eye className="mr-2 text-[18px] text-gray-700" /> View Profile
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-red-600 focus:bg-red-50"
            onSelect={(e) => {
              e.preventDefault();
              setTimeout(() => setShowDeleteDialog(true), 100);
            }}
          >
            <Trash2 className="mr-2 text-[18px] text-red-600" /> Delete Account
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="font-gilroy">
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
                Are you sure you want to delete this book?
                <span className="font-bold text-gray-800"> {data.name}</span>?
                This action cannot be undone.
              </p>
            </div>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <div className="w-full flex justify-between gap-4">
              <AlertDialogCancel className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-md py-2">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-md py-2"
              >
                Delete
              </AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Orders Dialog */}
      <AlertDialog open={showOrdersDialog} onOpenChange={setShowOrdersDialog}>
        <AlertDialogContent className="font-gilroy w-[90vw] max-w-md">
          <AlertDialogHeader>
            <div className="flex flex-col items-start gap-4">
              <div className="w-full flex justify-between">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  {data?.image ? (
                    <img
                      src={data.image}
                      alt="User"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <FiUser className="text-gray-500 text-3xl" />
                  )}
                </div>
                <Button variant="outline">Send Mail</Button>
              </div>

              <div>
                <h2 className="text-lg font-bold">{data?.name}</h2>
                <p className="text-sm text-gray-600">{data?.email}</p>
                <p className="text-sm text-gray-600">{data?.phone}</p>
              </div>
            </div>
          </AlertDialogHeader>

          <AlertDialogDescription className="mt-4">
            <p className="font-medium mb-2">Purchase History</p>
            {data?.purchases && data.purchases.length > 0 ? (
              <ul className="text-sm space-y-2">
                {data.purchases.map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center gap-2"
                  >
                    <span className="w-4 text-gray-500">{index + 1}.</span>
                    <p className="flex-1 text-gray-600">{item.title}</p>

                    <div className="flex items-center gap-x-4">
                      <span className="whitespace-nowrap text-gray-700">
                        {item.date}
                      </span>
                      <span className="whitespace-nowrap text-gray-700">
                        {item.amount}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs whitespace-nowrap ${
                          item.status === "Completed"
                            ? "bg-green-100 text-green-600"
                            : "bg-orange-100 text-orange-600"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">
                No purchase history available.
              </p>
            )}
          </AlertDialogDescription>

          <AlertDialogFooter>
            <AlertDialogCancel className="flex-1">Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
