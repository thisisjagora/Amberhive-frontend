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
import { fetchBookReports } from "@/redux/slices/reportSlice";
import { formatDate } from "@/utils/format";

const bookColumns = [
  {
    id: "name",
    header: () => (
      <span className="font-semibold text-gray-700">Name of Book</span>
    ),
    accessorKey: "name",
    cell: ({ row }) => {
      const { cover_image, title } = row.original;
      return (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {cover_image ? (
            <img
              src={`https://test.amber-hive.com/storage/${cover_image}`}
              alt={title}
              className="w-10 h-14 object-cover rounded"
            />
          ) : (
            <div className="w-10 h-14 bg-gray-200 rounded" />
          )}
          {title}
        </div>
      );
    },
  },
  {
    id: "author",
    header: () => (
      <span className="font-semibold text-gray-700 px-2">Author</span>
    ),
    accessorKey: "author",
    cell: ({ row }) => (
      <span className="text-sm px-2">{row.original?.author?.user?.name}</span>
    ),
  },
  {
    id: "category",
    header: () => (
      <span className="font-semibold text-gray-700 px-2">Category</span>
    ),
    accessorKey: "categories",
    cell: ({ row }) => {
      const categories = row.original.categories;
      const firstCategory = categories?.[0]?.name || "—";
      return <span className="text-sm px-2">{firstCategory}</span>;
    },
  },
  {
    id: "unitsSold",
    header: () => (
      <span className="font-semibold text-gray-700 px-2">Units Sold</span>
    ),
    accessorKey: "unitsSold",
    cell: ({ row }) => (
      <span className="text-sm px-2">{row.original.units_sold}</span>
    ),
  },
{
  id: "sellingPrice",
  header: () => (
    <span className="font-semibold text-gray-700 px-2">Selling Price</span>
  ),
  accessorKey: "selling_price",
  cell: ({ row }) => {
    const currencySymbol = row.original.currency === "ngn" ? "₦" : "$";
    const price = row.original.price || 0;
    return (
      <span className="text-sm text-gray-800 px-2">
        {currencySymbol}
        {price}
      </span>
    );
  },
},

  {
    id: "totalRevenue",
    accessorKey: "total_revenue",
    header: () => (
      <span className="font-semibold text-gray-700 px-2">Total Revenue</span>
    ),
    cell: ({ row }) => {
      const currencySymbol = row.original.currency === "ngn" ? "₦" : "$";
      const totalRevenue = row.original.total_revenue || 0;
      return (
        <span className="text-sm text-gray-800 px-2">
          {currencySymbol}
          {totalRevenue}
        </span>
      );
    },
  },

  {
    id: "dateAdded",
    header: () => (
      <span className="font-semibold text-gray-700 px-2">Date Published</span>
    ),
    accessorKey: "dateAdded",
    cell: ({ row }) => (
      <span className="text-sm px-2">
        {formatDate(row.original.published_at)}
      </span>
    ),
  },
  {
    id: "status",
    header: () => (
      <span className="font-semibold text-gray-700 px-2">Status</span>
    ),
    accessorKey: "status",
    cell: ({ row }) => {
      const isPublished = row.original.status;

      return (
        <Badge
          className={`text-xs font-semibold ${
            isPublished
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {isPublished ? "Published" : "Unpublished"}
        </Badge>
      );
    },
  },
];

const BookReports = () => {
  const [view, setView] = useState("list");
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const { bookReports, statusBookReports, error } = useSelector(
    (state) => state.report
  );

  useEffect(() => {
    dispatch(fetchBookReports());
  }, []);

  // ✅ Filter the data based on the search term
  const filteredReports = bookReports?.filter((report) => {
    const term = searchTerm.toLowerCase();
    return (
      (report?.author?.user?.name || "").toLowerCase().includes(term) ||
      (report?.title || "").toLowerCase().includes(term)
    );
  });

  return (
    <SuperAdminLayout
      header={
        <div className="w-full flex justify-between items-center ">
          <div className="flex flex-col px-4 mt-20 md:mt-0 py-6 justify-start items-start w-full">
            <div className="flex flex-col items-start gap-2">
              <h1 className="text-xl font-bold">Book Reports</h1>
              <p className="text-gray-500 text-sm">
                Monitor trends, reader stats, and sales — all in real time.
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
                  placeholder="Search book or author..."
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
                    data={filteredReports}
                    columns={bookColumns}
                    showPagination={true}
                    isLoading={statusBookReports === "loading"}
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

export default BookReports;
