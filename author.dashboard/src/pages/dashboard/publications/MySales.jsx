import React, { useEffect, useState } from "react";
import TableComponent from "@/components/TableComponent";
import TableGrid from "@/components/TableGrid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LayoutGrid, MoreVertical, Search } from "lucide-react";
import Layout from "@/components/shared/Layout";
import AllBookHeader from "@/components/headers/AllBookHeaders";
import { VscListFilter, VscListSelection } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyBooks, fetchMySales } from "@/redux/slices/bookSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/format";

const getStatusBadge = (status) => {
  const statusMap = {
    approved: "text-green-600 bg-green-100",
    draft: "text-gray-500 bg-gray-100",
    pending: "text-yellow-600 bg-yellow-100",
    declined: "text-red-500 bg-red-100",
    published: "text-green-600 bg-green-100",
  };

  return (
    <Badge
      className={`w-fit font-semibold ${
        statusMap[status] || "bg-gray-200 text-gray-600"
      }`}
    >
      {status}
    </Badge>
  );
};

const columns = [
  {
    id: "name",
    accessorKey: "book.title",
    header: () => (
      <span className="text-sm font-semibold text-gray-700">Name of Book</span>
    ),
    cell: ({ row }) => {
      const book = row.original.book;

      return (
        <div className="flex items-center gap-2">
          {book.cover_image ? (
            <img
              src={`https://test.amber-hive.com/storage/${book.cover_image}`}
              alt={book.title}
              className="w-10 h-14 object-cover rounded"
            />
          ) : (
            <div className="w-10 h-14 bg-gray-200 rounded" />
          )}
          <span className="text-sm text-gray-800">{book.title}</span>
        </div>
      );
    },
  },
  {
    id: "price",
    accessorKey: "book.price",
    header: () => (
      <span className="text-sm font-semibold text-gray-700">Price</span>
    ),
    cell: ({ row }) => {
      const { price, currency } = row.original.book;
      const currencySymbol = currency?.toLowerCase() === "ngn" ? "₦" : "$";

      return (
        <span className="text-sm text-gray-800">
          {currencySymbol}
          {price}
        </span>
      );
    },
  },
  {
    id: "date",
    header: () => (
      <span className="text-sm font-semibold text-gray-700">Sell Date</span>
    ),
    cell: ({ row }) => {
      const orderCreatedAt = row.original?.order?.created_at;
      return (
        <span className="text-sm text-gray-800">
          {orderCreatedAt ? formatDate(orderCreatedAt) : "-"}
        </span>
      );
    },
  },
];

const MySales = () => {
  const [view, setView] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const { mySales, statusMySales, error } = useSelector((state) => state.books);

  useEffect(() => {
    dispatch(fetchMySales());
  }, [dispatch]);

  const filteredSales = mySales.filter((sale) =>
    sale?.book?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white font-gilroy">
      <Layout
        header={
          <div className="flex flex-col px-2 mt-20 md:mt-0 justify-start items-start w-full">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-800">My Sales</h2>
            </div>
            <p className="text-gray-500 text-sm">
              Track and manage all your ebooks from this dashboard.
            </p>
          </div>
        }
      >
        <div className="pb-4 px-2">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-start md:justify-between bg-white">
            {/* Left: View toggles */}

            {/* Right: Search and Filter */}
            <div className="flex flex-col-reverse md:flex-row items-start md:items-center gap-2 w-[400px] max-w-full">
              <div className="relative flex-1 w-full">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={16}
                />
                <Input
                  type="text"
                  placeholder="Search books..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full"
                />
              </div>
            </div>
          </div>
          <div>
            <div className="bg-white rounded-lg w-full p-4 h-auto border-[1px] mt-12 shadow">
              <div className="relative overflow-x-auto rounded-t-lg">
                <TableComponent
                  columns={columns}
                  data={filteredSales}
                  isLoading={statusMySales === "loading"}
                />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default MySales;
