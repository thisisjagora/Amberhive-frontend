import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreVertical } from "lucide-react";
import { Link } from "react-router";
import { FiEye } from "react-icons/fi";

const MyTicketCellAction = ({ data }) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-5 w-5 p-0">
          <span className="sr-only">Open menu</span>

          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="font-gilroy">
        <DropdownMenuItem className="p-0">
          <Link
            to={`/admin/my-ticket/${data.id}`}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-muted"
          >
            <FiEye className="w-4 h-4" />
            View Ticket
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MyTicketCellAction;
