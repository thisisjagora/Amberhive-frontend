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
import { useDispatch, useSelector } from "react-redux";
import { fetchEarningsReport } from "@/redux/slices/reportSlice";

const earningsColumns = [

  {
    id: "date",
    header: () => (
      <span className="font-semibold text-gray-700 px-2 py-2">Date</span>
    ),
    accessorKey: "date",
    cell: ({ row }) => (
      <span className="text-sm px-2 py-2">{row?.original?.date}</span>
    ),
  },
  {
    id: "unitsSold",
    header: () => (
      <span className="font-semibold text-gray-700 px-2 py-2">Units Sold</span>
    ),
    accessorKey: "unitsSold",
    cell: ({ row }) => (
      <div className="text-center py-2">
        <span className="text-sm px-2">{row?.original?.units_sold}</span>
      </div>
    ),
  },
  {
    id: "grossRevenue",
    header: () => (
      <span className="font-semibold text-gray-700 px-2 py-2">
        Gross Revenue
      </span>
    ),
    accessorKey: "grossRevenue",
    cell: ({ row }) => (
      <div className="text-center py-2">
        <span className="text-sm px-2 py-2">
          {row?.original?.gross_revenue}
        </span>
      </div>
    ),
  },
  {
    id: "discounts",
    header: () => (
      <span className="font-semibold text-gray-700 px-2 py-2">Discounts</span>
    ),
    accessorKey: "discounts",
    cell: ({ row }) => (
      <div className="text-center py-2">
        <span className="text-sm px-2 py-2">{row?.original?.discounts}</span>
      </div>
    ),
  },
  {
    id: "netRevenue",
    header: () => (
      <span className="font-semibold text-gray-700 px-2 py-2">Net Revenue</span>
    ),
    accessorKey: "netRevenue",
    cell: ({ row }) => (
      <div className="text-center py-2">
        <span className="text-sm px-2 py-2">{row?.original?.net_revenue}</span>
      </div>
    ),
  },
  {
    id: "returnsRefunds",
    header: () => (
      <span className="font-semibold text-gray-700 px-2 py-2">
        Returns / Refunds
      </span>
    ),
    accessorKey: "returnsRefunds",
    cell: ({ row }) => (
      <div className="text-center py-2">
        <span className="text-sm px-2 py-2">{row?.original?.returns}</span>
      </div>
    ),
  },
  {
    id: "topSellingBook",
    header: () => (
      <span className="font-semibold text-gray-700 px-2 py-2">
        Top-Selling Book
      </span>
    ),
    accessorKey: "topSellingBook",
    cell: ({ row }) => (
      <div className="text-center py-2">
        <span className="text-sm px-2">{row?.original?.top_selling_book}</span>
      </div>
    ),
  },
  {
    id: "status",
    header: () => (
      <span className="font-semibold text-gray-700 px-2 py-2">Status</span>
    ),
    accessorKey: "status",
    cell: ({ row }) => {
      const rawStatus = row?.original?.status;
      const statusArray = rawStatus
        .split(",")
        .map((s) => s.trim().toLowerCase()); // normalize for safe matching

      const statusStyles = {
        pending: "bg-yellow-100 text-yellow-700",
        processing: "bg-blue-100 text-blue-700",
      };

      return (
        <div className="flex flex-wrap gap-2 px-2 py-2">
          {statusArray.map((status, idx) => (
            <Badge
              key={idx}
              className={`text-xs font-semibold ${
                statusStyles[status] || "bg-gray-100 text-gray-700"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          ))}
        </div>
      );
    },
  },
 
];

const EarningsReports = () => {
  const [view, setView] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();

  const { earningsReport, statusEarningsReport, error } = useSelector(
    (state) => state.report
  );

  useEffect(() => {
    dispatch(fetchEarningsReport());
  }, []);

  const filteredEarnings = earningsReport?.filter((report) => {
    const search = searchTerm.toLowerCase();
    return (
      report?.date?.toLowerCase().includes(search) ||
      report?.top_selling_book?.toLowerCase().includes(search) ||
      report?.status?.toLowerCase().includes(search)
    );
  });

  return (
    <SuperAdminLayout
      header={
        <div className="w-full flex justify-between items-center ">
          <div className="flex flex-col px-4 mt-20 md:mt-0 py-6 justify-start items-start w-full">
            <div className="flex flex-col items-start gap-2">
              <h1 className="text-xl font-bold">Earnings Reports</h1>
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
          <div className="flex flex-col md:flex-row gap-4  my-4 items-start md:items-center justify-start md:justify-between bg-white">
            {/* Left: View toggles */}
            {/* <div className="flex items-center justify-start">
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
                  placeholder="Search by book, or status..."
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
                    data={filteredEarnings}
                    columns={earningsColumns}
                    showPagination={true}
                    isLoading={statusEarningsReport === "loading"}
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

export default EarningsReports;
