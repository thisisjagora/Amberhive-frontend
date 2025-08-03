import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "../ui/input";
import TableComponent from "../TableComponent";
import { Checkbox } from "../ui/checkbox";
import { formatDate } from "@/utils/format";
import { fetchAllTickets } from "@/redux/slices/supportTicketSlice";
import AllTicketCellAction from "./allTicketCellAction";
import { Badge } from "../ui/badge";

const AllTicket = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    allTickets,
    paginationAllTickets: { currentPage, lastPage },
    statusFetchAllTickets,
  } = useSelector((state) => state.supportTicket);

  useEffect(() => {
    dispatch(fetchAllTickets(currentPage));
  }, [dispatch, currentPage]);

  const handlePageChange = (page) => {
    dispatch(fetchAllTickets(page));
  };

  const filteredTickets = allTickets?.filter((ticket) => {
    const term = searchTerm.toLowerCase();
    return (
      (ticket.subject || "").toLowerCase().includes(term) ||
      (ticket.support_id || "").toLowerCase().includes(term) ||
      (ticket.description || "").toLowerCase().includes(term) ||
      (ticket.categories?.name || "").toLowerCase().includes(term)
    );
  });

  const allTicketcolumns = [
    {
      id: "ticket_id",
      header: () => (
        <span className="font-semibold text-gray-700">Ticket ID</span>
      ),
      accessorKey: "ticket_id",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-gray-800 py-2 block">
          {row.original.support_id}
        </span>
      ),
    },
    {
      id: "subject",
      header: () => (
        <span className="font-semibold text-gray-700">Subject</span>
      ),
      accessorKey: "subject",
      cell: ({ row }) => (
        <span className="text-sm text-gray-800 py-2 block">
          {row.original.subject}
        </span>
      ),
    },
    {
      id: "description",
      header: () => (
        <span className="font-semibold text-gray-700">Description</span>
      ),
      accessorKey: "description",
      cell: ({ row }) => (
        <span className="text-sm text-gray-800 break-words whitespace-normal w-72 line-clamp-3">
          {row.original.description}
        </span>
      ),
    },
    {
      id: "category",
      header: () => (
        <span className="font-semibold text-gray-700">Category</span>
      ),
      accessorKey: "categories.name",
      cell: ({ row }) => (
        <span className="text-sm text-gray-800 py-2 block">
          {row.original.categories?.name || "—"}
        </span>
      ),
    },
    {
      id: "created_at",
      header: () => (
        <span className="font-semibold text-gray-700">Date Created</span>
      ),
      accessorKey: "created_at",
      cell: ({ row }) => (
        <span className="text-sm text-gray-800 py-2 block">
          {formatDate(row.original.created_at)}
        </span>
      ),
    },
    {
      id: "status",
      header: () => <span className="font-semibold text-gray-700">Status</span>,
      accessorKey: "status",
      cell: ({ row }) => {
        const status = (row.original.status || "").toLowerCase();

        const statusMap = {
          open: {
            label: "Open",
            className: "bg-green-100 text-green-800",
          },
          in_progress: {
            label: "In Progress",
            className: "bg-yellow-100 text-yellow-800",
          },
          closed: {
            label: "Closed",
            className: "bg-red-100 text-red-800",
          },
        };

        const badge = statusMap[status] || {
          label: status,
          className: "bg-gray-100 text-gray-800",
        };

        return <Badge className={badge.className}>{badge.label}</Badge>;
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        return <AllTicketCellAction data={row.original} />;
      },
      size: 80,
    },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 my-4 items-start md:items-center justify-start md:justify-between bg-white">
        <div className="flex flex-col-reverse md:flex-row items-start md:items-center gap-2 w-[400px] max-w-full">
          <div className="relative md:w-[400px]">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <Input
              type="text"
              placeholder="Search ..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div>
        <div className="bg-white border rounded-lg w-full p-4 my-4 h-auto shadow-md">
          <div className="relative overflow-x-auto ">
            <TableComponent
              data={filteredTickets}
              columns={allTicketcolumns}
              showPagination={true}
              isLoading={statusFetchAllTickets === "loading"}
              pagination={{
                currentPage,
                lastPage,
                onPageChange: handlePageChange,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllTicket;
