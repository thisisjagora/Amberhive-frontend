import React, { useState } from "react";
import SuperAdminLayout from "./DashboardLayout";
import { Button } from "@/components/ui/button";
import { VscListFilter, VscListSelection } from "react-icons/vsc";
import { LayoutGrid, MoreVertical, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import TableComponent from "@/components/TableComponent";
// import { promotionData } from "@/utils/data";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { FiChevronDown, FiDownload } from "react-icons/fi";

const promotionColumns = [

  {
    id: "name",
    header: () => (
      <span className="font-semibold text-gray-700">Name of Book</span>
    ),
    accessorKey: "name",
    cell: ({ row }) => {
      const { name, image } = row.original;
      return (
        <div className="flex items-center gap-2">
          <img
            src={image}
            alt={name}
            className="w-10 h-16 rounded-xs object-cover ring-1 ring-gray-200"
          />
          <span className="text-sm font-medium text-gray-800 break-words w-[120px]">
            {name}
          </span>
        </div>
      );
    },
  },

  {
    id: "category",
    header: () => (
      <span className="font-semibold text-gray-700 px-2">Category</span>
    ),
    accessorKey: "category",
    cell: ({ row }) => (
      <span className="text-sm px-2">{row.original.category}</span>
    ),
  },
  {
    id: "author",
    header: () => (
      <span className="font-semibold text-gray-700 px-2">Author</span>
    ),
    accessorKey: "author",
    cell: ({ row }) => (
      <span className="text-sm px-2">{row.original.author}</span>
    ),
  },
  {
    id: "unitsSold",
    header: () => (
      <span className="font-semibold text-gray-700 px-2">
        Units Sold (Promo)
      </span>
    ),
    accessorKey: "unitsSold",
    cell: ({ row }) => (
      <div className="text-center">
        <span className="text-sm px-2">{row.original.unitsSold}</span>
      </div>
    ),
  },
  {
    id: "sellingPrice",
    header: () => (
      <span className="font-semibold text-gray-700 px-2">Selling Price</span>
    ),
    accessorKey: "sellingPrice",
    cell: ({ row }) => (
       <div className="text-center">

         <span className="text-sm px-2">{row.original.sellingPrice}</span>
       </div>
    ),
  },
  {
    id: "originalPrice",
    header: () => (
      <span className="font-semibold text-gray-700 px-2">Original Prc</span>
    ),
    accessorKey: "originalPrice",
    cell: ({ row }) => (
       <div className="text-center">
        
         <span className="text-sm px-2">{row.original.originalPrice}</span>
       </div>
    ),
  },
  {
    id: "stockLevel",
    header: () => (
      <span className="font-semibold text-gray-700 px-2">Stock Level</span>
    ),
    accessorKey: "stockLevel",
    cell: ({ row }) => (
       <div className="text-center">

         <span className="text-sm px-2">{row.original.stockLevel}</span>
       </div>
    ),
  },
  {
    id: "dateAdded",
    header: () => (
      <span className="font-semibold text-gray-700 px-2">Date Added</span>
    ),
    accessorKey: "dateAdded",
    cell: ({ row }) => (
      <span className="text-sm px-2">{row.original.dateAdded}</span>
    ),
  },
  {
    id: "status",
    header: () => (
      <span className="font-semibold text-gray-700 px-2">Status</span>
    ),
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.original.status;
      const statusStyles = {
        "Promo Active": "bg-green-100 text-green-700",
        Expired: "bg-yellow-100 text-yellow-700",
        Ended: "bg-gray-100 text-gray-700",
      };
      return (
        <Badge
          className={`text-xs font-semibold ${statusStyles[status] || ""}`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="flex items-center justify-center px-2">
        <button
          onClick={() => console.log("More actions for", row.original.name)}
          title="More options"
          className="hover:text-gray-700"
        >
          <MoreVertical size={18} />
        </button>
      </div>
    ),
    size: 50,
  },
];

const promotionData = []

const PromotionReports = () => {
  const [view, setView] = useState("list");
  return (
    <SuperAdminLayout
      header={
        <div className="w-full flex justify-between items-center ">
          <div className="flex flex-col px-4 mt-20 md:mt-0 py-6 justify-start items-start w-full">
            <div className="flex flex-col items-start gap-2">
              <h1 className="text-xl font-bold">Promotion Reports</h1>
              <p className="text-gray-500 text-sm">
                Performance insights from every book promotion, in one report.
              </p>
            </div>
          </div>
          <div className="flex gap-2 px-4">
            <Button variant="outline">
              <FiDownload />
              Download Report
            </Button>
            <Button>
              Export <FiChevronDown />
            </Button>
          </div>
        </div>
      }
    >
      <div className="px-4 md:mt-8">
        <div>
          <div className="flex flex-col md:flex-row gap-4  my-4 items-start md:items-center justify-start md:justify-between bg-white">
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

          <div>
            {view === "list" ? (
              <div className="py-2">
                <div className="bg-white border-[1px] rounded-lg w-full p-4 h-auto shadow-md">
                  <div className="relative overflow-x-auto rounded-t-lg">
                    <TableComponent
                      data={promotionData}
                      columns={promotionColumns}
                      showPagination={true}
                    />
                  </div>
                </div>
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
    </SuperAdminLayout>
  );
};

export default PromotionReports;
