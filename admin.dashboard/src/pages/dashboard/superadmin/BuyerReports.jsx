import React, { useEffect, useState } from "react";
import SuperAdminLayout from "./DashboardLayout";
import { Button } from "@/components/ui/button";
import { VscListFilter, VscListSelection } from "react-icons/vsc";
import { LayoutGrid, MoreVertical, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import TableComponent from "@/components/TableComponent";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { FiChevronDown, FiDownload } from "react-icons/fi";
import { fetchBuyerReports } from "@/redux/slices/reportSlice";
import { useDispatch, useSelector } from "react-redux";

const buyerColumns = [

  {
    id: "name",
    header: () => <span className="font-semibold text-gray-700 px-2 py-2">Name of Buyer</span>,
    accessorKey: "name",
    cell: ({ row }) => {
      const { buyer_name } = row.original;
      return (
        <div className="flex items-center gap-2 px-2 py-2">
          <h1 className="text-sm font-medium text-gray-800 break-words">{buyer_name}</h1>
        </div>
      );
    },
  },
  {
    id: "email",
    header: () => <span className="font-semibold text-gray-700 px-2 py-2">Email Address</span>,
    accessorKey: "email",
    cell: ({ row }) => (
      <span className="text-sm text-gray-700 px-2 py-2">{row.original.email}</span>
    ),
  },
  {
    id: "sellingPrice",
    header: () => (
      <div className="flex justify-center py-2">
        <span className="font-semibold text-gray-700 px-2">Selling Price</span>
      </div>
    ),
    accessorKey: "sellingPrice",
    cell: ({ row }) => (
      <div className="text-center py-2">
        <span className="text-sm text-gray-800 px-2">{row.original.selling_price}</span>
      </div>
    ),
  },
  {
    id: "status",
    header: () => (
      <div className="flex justify-center py-2">
        <span className="font-semibold text-gray-700 px-2">Status</span>
      </div>
    ),
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.original.status?.toLowerCase();
      const statusStyles = {
        pending: "bg-yellow-100 text-yellow-700",
        processing: "bg-blue-100 text-blue-700",
      };

      return (
        <div className="flex justify-center py-2">
          <Badge
            className={`rounded-full px-2 py-1 text-xs font-semibold capitalize ${
              statusStyles[status] || "bg-gray-100 text-gray-700"
            }`}
          >
            {status}
          </Badge>
        </div>
      );
    },
  },
 
];

const BuyerReports = () => {
  const [view, setView] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();

  const { buyerReports, statusBuyerReports } = useSelector((state) => state.report);

  useEffect(() => {
    dispatch(fetchBuyerReports());
  }, []);

  // ✅ Filter buyerReports based on search term
  const filteredBuyerReports = buyerReports?.filter((report) => {
    const term = searchTerm.toLowerCase();
    return (
      (report?.buyer_name || "").toLowerCase().includes(term) ||
      (report?.email || "").toLowerCase().includes(term)
    );
  });

  return (
    <SuperAdminLayout
      header={
        <div className="w-full flex justify-between items-center ">
          <div className="flex flex-col px-4 mt-20 md:mt-0 py-6 justify-start items-start w-full">
            <div className="flex flex-col items-start gap-2">
              <h1 className="text-xl font-bold">Buyer Reports</h1>
              <p className="text-gray-500 text-sm">
                Insights into book sales, ratings, and trends by author.
              </p>
            </div>
          </div>
          {/* <div className="flex gap-2 px-4">
            <Button variant="outline">
              <FiDownload />
              Download Report
            </Button>
            <Button>
              Export <FiChevronDown />
            </Button>
          </div> */}
        </div>
      }
    >
      <div className="px-4 md:mt-8">
        <div>
          <div className="flex flex-col md:flex-row gap-4 my-4 items-start md:items-center justify-start md:justify-between bg-white">
            {/* Left: View toggles */}
            {/* <div className="flex items-center justify-start">
              <Button
                variant="outline"
                className={`flex items-center gap-1 text-base rounded-r-none ${
                  view === "list"
                    ? "text-yellow-600 font-semibold bg-gray-50 hover:text-yellow-600"
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
            </div> */}

            {/* Right: Search and Filter */}
            <div className="flex flex-col-reverse md:flex-row items-start md:items-center gap-2 w-[400px] max-w-full">
              <div className="relative w-[400px]">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={16}
                />
                <Input
                  type="text"
                  placeholder="Search by name or email..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

             
            </div>
          </div>

          <div>
            <div className="py-2">
              <div className="bg-white border-[1px] rounded-lg w-full p-4 h-auto shadow-md">
                <div className="relative overflow-x-auto rounded-t-lg">
                  <TableComponent
                    data={filteredBuyerReports}
                    columns={buyerColumns}
                    showPagination={true}
                    isLoading={statusBuyerReports === "loading"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default BuyerReports;
