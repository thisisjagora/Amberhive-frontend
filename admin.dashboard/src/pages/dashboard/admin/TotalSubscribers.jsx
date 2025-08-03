import { Button } from "@/components/ui/button";
import { ArrowLeft, LayoutGrid, Search } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import TableComponent from "@/components/TableComponent";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

import { Input } from "@/components/ui/input";
import { BsThreeDotsVertical } from "react-icons/bs";
import AdminLayout from "./DashboardLayout";
import { VscListFilter, VscListSelection } from "react-icons/vsc";

const subscribeColumns = [
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
    id: "subscriber",
    header: "Name of Subscriber",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <img
          src={row.original.subscriberImage}
          alt={row.original.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <span className="font-medium">{row.original.name}</span>
      </div>
    ),
  },

  {
    id: "email",
    header: "Email Address",
    accessorKey: "email",
    cell: ({ row }) => <span>{row.original.email}</span>,
  },
  {
    id: "dateSubscribed",
    header: "Date Subscribed",
    accessorKey: "dateSubscribed",
    cell: ({ row }) => <span>{row.original.dateSubscribed}</span>,
  },
  {
    id: "campaign",
    header: "Campaign Subscribed To",
    accessorKey: "campaign",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <img
          src={row.original.image}
          alt={row.original.campaign}
          className="w-10 h-14 object-cover rounded"
        />
        <span>{row.original.campaign}</span>
      </div>
    ),
  },
  {
    id: "category",
    header: "Category",
    accessorKey: "category",
    cell: ({ row }) => <span>{row.original.category}</span>,
  },
  {
    id: "status",
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.original.status;
      const statusColor =
        status === "Active"
          ? "bg-green-100 text-green-600 font-semibold"
          : "bg-gray-200 text-gray-600 font-semibold";

      return (
        <Badge className={`text-xs font-medium ${statusColor}`}>{status}</Badge>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="flex items-center gap-3 text-gray-600">
        <button
          onClick={() => console.log("Edit", row.original.id)}
          className="hover:text-yellow-600 transition-colors"
          title="Edit"
        >
          <BsThreeDotsVertical size={16} />
        </button>
      </div>
    ),
    size: 80,
  },
];

const subscribersData = []

const TotalSubscribers = () => {
  const navigate = useNavigate();
  const [view, setView] = useState("list");
  return (
    <AdminLayout
      header={
        <div className="flex flex-col gap-2 mt-3 items-start">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex flex-col mt-20 md:mt-2  px-2 justify-start items-start w-full">
            <h2 className="text-xl font-bold text-gray-800">
              Total Subscribers
            </h2>
            <p className="text-gray-500 text-base">All campaigns subscribers</p>
          </div>
        </div>
      }
    >
      <div className="mt-4">
        <div className="flex flex-col px-4 mt-6 items-center justify-between mb-4 gap-2">
          <div className="flex flex-col md:flex-row gap-4 w-full  my-4 items-start md:items-center justify-start md:justify-between bg-white">
            {/* Left: View toggles */}
            <div className="flex items-center justify-start">
              <Button
                variant="outline"
                className={`flex items-center gap-1 text-base rounded-r-none ${
                  view === "list"
                    ? "text-yellow-600 font-semibold text-base bg-gray-50 hover:text-yellow-600"
                    : ""
                }`}
                onClick={() => setView("list")}
              >
                <VscListSelection />
                List
              </Button>
              <Button
                variant="outline"
                className={`flex items-center gap-1 text-base rounded-l-none border-l ${
                  view === "grid"
                    ? "text-yellow-600 font-bold bg-gray-50 hover:text-yellow-600"
                    : ""
                }`}
                onClick={() => setView("grid")}
              >
                <LayoutGrid size={20} />
                Tiles
              </Button>
            </div>

            {/* Right: Search and Filter */}
            <div className="flex flex-col-reverse md:flex-row items-start md:items-center gap-2 w-[400px] max-w-full">
              <div className="relative w-[400px]">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={16}
                />
                <Input
                  type="text"
                  placeholder="Search ..."
                  className="pl-8 w-full"
                />
              </div>

              <Button
                variant="outline"
                className="flex text-base items-center gap-1"
              >
                <VscListFilter />
                Filter
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg border-[1px] w-full p-4 h-auto shadow-md">
            {view === "list" ? (
              <div className="overflow-auto ">
                <TableComponent
                  data={subscribersData}
                  columns={subscribeColumns}
                  showPagination={true}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg w-full p-4 h-auto shadow-md">
                {/* <TableGrid
                                  books={books}
                                  viewMode={view} // Pass the viewMode here
                                /> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default TotalSubscribers;
