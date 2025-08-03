import React, { useEffect, useState } from "react";
import EmptyBooks from "@/components/EmptyBooks";
import TableComponent from "@/components/TableComponent";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LayoutGrid, MoreVertical, Search } from "lucide-react";
import { VscListFilter, VscListSelection } from "react-icons/vsc";
import BuyerMHeader from "@/components/headers/BuyerMHeader";
import { columns } from "@/components/buyermanagement/columns";
import TableGrid from "@/components/buyermanagement/tableGrid";
import AdminLayout from "./DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { fetchBuyerReports } from "@/redux/slices/reportSlice";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

const buyerColumns = [

  {
    id: "name",
    header: () => (
      <span className="font-semibold text-gray-700 px-2 py-2">
        Name of Buyer
      </span>
    ),
    accessorKey: "name",
    cell: ({ row }) => {
      const { buyer_name } = row.original;
      return (
        <div className="flex items-center gap-2 px-2 py-2">
          <h1 className="text-sm font-medium text-gray-800 break-words">
            {buyer_name}
          </h1>
        </div>
      );
    },
  },
  {
    id: "email",
    header: () => (
      <span className="font-semibold text-gray-700 px-2 py-2">
        Email Address
      </span>
    ),
    accessorKey: "email",
    cell: ({ row }) => (
      <span className="text-sm text-gray-700 px-2 py-2">
        {row.original.email}
      </span>
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
        <span className="text-sm text-gray-800 px-2">
          {row.original.selling_price}
        </span>
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
  // {
  //   id: "actions",
  //   header: () => <div className="py-2" />,
  //   cell: ({ row }) => (
  //     <div className="flex items-center justify-center px-2 py-2">
  //       <MoreVertical size={18} />
  //     </div>
  //   ),
  //   size: 50,
  // },
];

const BuyerManagement = () => {
  const [view, setView] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();

  const { buyerReports, statusBuyerReports, error } = useSelector(
    (state) => state.report
  );

  useEffect(() => {
    dispatch(fetchBuyerReports());
  }, []);

  const filteredReports = buyerReports.filter((report) => {
    const query = searchQuery.toLowerCase();
    return (
      report.buyer_name?.toLowerCase().includes(query) ||
      report.email?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="bg-white font-gilroy">
      {/* {buyerReports.length === 0 ? (
        <AdminLayout header={<BuyerMHeader count={buyerReports.length} />}>
          <EmptyBooks />
        </AdminLayout>
      ) : ( */}
      <AdminLayout header={<BuyerMHeader />}>
        <div className="pb-2 mt-5 px-4">
          <div className="flex flex-col md:flex-row gap-4  my-4 items-start md:items-center justify-start md:justify-between bg-white">
            {/* Left: View toggles */}
         
            {/* Right: Search and Filter */}
            <div className="flex flex-col-reverse md:flex-row items-start md:items-center gap-2 w-[400px] max-w-full">
              <div className="relative md:w-[400px]">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={16}
                />
                <Input
                  type="text"
                  placeholder="Search by name or email..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* <Button
                  variant="outline"
                  className="flex text-base items-center gap-1"
                >
                  <VscListFilter />
                  Filter
                </Button> */}
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg w-full p-4 h-auto shadow-md">
              <div className="relative overflow-x-auto rounded-t-lg">
                <TableComponent
                  data={filteredReports}
                  columns={buyerColumns}
                  showPagination={true}
                  isLoading={statusBuyerReports === "loading"}
                />
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
      {/* )} */}
    </div>
  );
};

export default BuyerManagement;
