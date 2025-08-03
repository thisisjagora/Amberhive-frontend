import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreVertical, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router";
import { TbFileCheck } from "react-icons/tb";
import { MdOutlineBlock } from "react-icons/md";
import { FiEye, FiStar } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { toggleFeatureBook, fetchFeaturedBooks } from "@/redux/slices/bookApprovalSlice";

export const CellAction = ({ data, viewMode }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleToggleFeatured = async () => {
    try {
      const response = await dispatch(toggleFeatureBook(data.id)).unwrap();
      dispatch(fetchFeaturedBooks()); // Refresh featured list
      toast.success(response.message);
    } catch (err) {
      toast.error(err?.message || err || "An error occurred");
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
          <DropdownMenuItem>
            <TbFileCheck className="mr-2 text-gray-700" /> Approve
          </DropdownMenuItem>
          <DropdownMenuItem>
            <MdOutlineBlock className="mr-2 text-gray-700" /> Reject
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              navigate(`/admin/content-management/book-approvals/${data.id}`);
            }}
          >
            <FiEye className="mr-2 text-gray-700" />
            {data.approval_status === "approved" ? "View Book" : "View Request"}
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleToggleFeatured}>
            <FiStar className="mr-2 text-yellow-500" />
            {data.featured ? "Remove from Featured" : "Add to Featured"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
