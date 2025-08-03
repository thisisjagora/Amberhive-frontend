import React, { useEffect, useState } from "react";
import SuperAdminLayout from "../superadmin/DashboardLayout";
import TableComponent from "@/components/TableComponent";
import { Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "@/utils/format";
import { useNavigate } from "react-router";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchMyTickets } from "@/redux/slices/ticketJagoraSlice";
import CreateTicket from "@/components/forms/CreateTicket";

const JagoraSupport = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { myTickets, statusMyTickets } = useSelector(
    (state) => state.ticketJagora
  );

  useEffect(() => {
    dispatch(fetchMyTickets());
  }, [dispatch]);

  // console.log(myTickets);

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          className="border-gray-300"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          className="border-gray-300"
        />
      ),
      size: 40,
    },
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
        <span className="text-sm text-gray-800 py-2 break-words whitespace-normal w-72 block">
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
        const status = row.original.status.toLowerCase();
        const statusClass =
          status === "open"
            ? "text-green-600"
            : status === "closed"
            ? "text-red-500"
            : "text-yellow-500";

        return (
          <span className={`text-sm font-medium ${statusClass}`}>
            {row.original.status}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const id = row.original.id;
        return (
          <div className="flex items-center gap-3 py-2">
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={() => navigate(`/super-admin/jagora-support/${id}`)}
            >
              View Ticket
            </Button>
          </div>
        );
      },
      size: 80,
    },
  ];

  const filteredTickets = myTickets?.filter((ticket) => {
    const term = searchTerm.toLowerCase();
    return (
      ticket.subject?.toLowerCase().includes(term) ||
      ticket.support_id?.toLowerCase().includes(term)
    );
  });

  return (
    <SuperAdminLayout
      header={
        <div className="flex flex-col px-4 mt-20 md:mt-0 py-6 justify-start items-start w-full">
          <div className="flex flex-col items-start gap-2">
            <h1 className="text-xl font-bold">Jagora Support</h1>
            <p className="text-gray-500 text-sm">
              Track, manage and gain insights from your tickets.
            </p>
          </div>
        </div>
      }
    >
      <div className="px-4 py-2">
        <div className="max-w-[80rem] mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row gap-4 my-4 items-start md:items-center justify-between bg-white">
            <div className="relative md:w-[400px]">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={16}
              />
              <Input
                type="text"
                placeholder="Search by subject or ticket ID..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <CreateTicket />
          </div>

          <div className="bg-white border-[1px] rounded-lg w-full p-4 h-auto shadow-md">
            <div className="relative overflow-x-auto rounded-t-lg">
              <TableComponent
                data={filteredTickets}
                columns={columns}
                showPagination={true}
                isLoading={statusMyTickets === "loading"}
              />
            </div>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default JagoraSupport;
