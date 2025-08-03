import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import TableComponent from "../TableComponent";
import { Checkbox } from "../ui/checkbox";
import { formatDate } from "@/utils/format";
import { Link } from "react-router";
import { FiMoreVertical } from "react-icons/fi";
import { fetchMyTickets } from "@/redux/slices/supportTicketSlice";
import MyTicketCellAction from "./MyTicketCellAction";
import { Badge } from "../ui/badge";

const MyTicket = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const {
    myTickets,
    paginationMyTickets: { currentPage, lastPage },
    statusFetchMyTickets,
  } = useSelector((state) => state.supportTicket);

  useEffect(() => {
    dispatch(fetchMyTickets(currentPage));
  }, [dispatch, currentPage]);

  const handlePageChange = (page) => {
    dispatch(fetchMyTickets(page));
  };

  const myTicketcolumns = [
    {
      id: "support_id",
      header: () => (
        <span className="font-semibold text-gray-700">Ticket ID</span>
      ),
      accessorKey: "support_id",
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
      // Use the nested categories.name property safely
      accessorFn: (row) => row.categories?.name || "—",
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
        return <MyTicketCellAction data={row.original} />;
      },
      size: 80,
    },
  ];

  const filteredTickets = myTickets?.filter((ticket) =>
    ticket.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              placeholder="Search by subject..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div>
        <div className="bg-white border-[1px] rounded-lg w-full p-4 my-4 h-auto shadow-md">
          <div className="relative overflow-x-auto rounded-t-lg">
            <TableComponent
              data={filteredTickets}
              columns={myTicketcolumns}
              showPagination={true}
              isLoading={statusFetchMyTickets === "loading"}
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

export default MyTicket;
