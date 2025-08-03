import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import TableComponent from "@/components/TableComponent";
import { Badge } from "@/components/ui/badge";
import DashboardHeader from "@/components/headers/DashboardHeader";

import StatCard from "@/components/dashboard/StatCard";
import { Link } from "react-router";
import AdminLayout from "./DashboardLayout";
import { fetchAllBooks } from "@/redux/slices/bookApprovalSlice";
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "@/utils/format";
import { fetchAdminDashborad } from "@/redux/slices/dashboardSlice";
import { Skeleton } from "@/components/ui/skeleton";

const statusMap = {
  approved: "text-green-600 bg-green-100",
  draft: "text-gray-500 bg-gray-100",
  pending: "text-yellow-600 bg-yellow-100",
  declined: "text-red-500 bg-red-100",
  published: "text-green-600 bg-green-100",
};

const columns = [
  {
    id: "name",
    accessorKey: "name",
    header: () => (
      <span className="text-sm font-semibold text-gray-700">Name of Book</span>
    ),
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
    id: "price",
    accessorKey: "price",
    header: () => (
      <span className="text-sm font-semibold text-gray-700">Price</span>
    ),
    cell: ({ row }) => {
      const currencySymbol = row.original.currency === "ngn" ? "₦" : "$";
      const price = row.original.price || 0;
      return (
        <span className="text-sm text-gray-600">
          {currencySymbol}
          {price}
        </span>
      );
    },
  },
  {
    id: "date",
    accessorKey: "created_at",
    header: () => (
      <span className="text-sm font-semibold text-gray-700">Date Created</span>
    ),
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">
        {formatDate(row.original.created_at)}
      </span>
    ),
  },
  {
    id: "approval_status",
    accessorKey: "approval_status",
    header: () => (
      <span className="text-sm font-semibold text-gray-700">
        Approval Status
      </span>
    ),
    cell: ({ row }) => {
      const status = row.original.approval_status;
      const style =
        statusMap[status?.toLowerCase()] || "text-gray-600 bg-gray-200";
      return (
        <Badge className={`w-fit font-semibold capitalize ${style}`}>
          {status}
        </Badge>
      );
    },
  },
];

const Overview = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const { allBooks, statusAllBooks } = useSelector(
    (state) => state.bookApproval
  );

  const { adminDash, statusAdminDash, error } = useSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    dispatch(fetchAllBooks());
    dispatch(fetchAdminDashborad());
  }, [dispatch]);

  const isLoading = statusAllBooks === "loading";

  const filteredBooks = allBooks.filter((book) => {
    const lowerSearch = searchTerm.toLowerCase();

    const matchesStatus =
      !statusFilter || book.status?.toLowerCase() === statusFilter;

    const matchesSearch =
      !searchTerm ||
      book.title?.toLowerCase().includes(lowerSearch) ||
      book.status?.toLowerCase().includes(lowerSearch);

    return matchesStatus && matchesSearch;
  });

  return (
    <AdminLayout header={<DashboardHeader />}>
      {/* Cards Section */}
      <div className="px-4 md:mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:mt-4 mt-12">
          {statusAdminDash === "loading" ? (
            // Show 4 skeleton cards while loading
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 border rounded-xl bg-white shadow">
                <Skeleton className="h-4 w-1/2 mb-3" />
                <Skeleton className="h-6 w-2/3 mb-1" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))
          ) : (
            <>
              <StatCard
                title="Active Users"
                amount={adminDash?.users?.current}
                changeText={`${adminDash?.users?.change_percent}%`}
                changeType={
                  adminDash?.users?.trend === "up" ? "positive" : "negative"
                }
                strokeColor="#16a34a"
              />
              <StatCard
                title="No. of Authors"
                amount={adminDash?.authors?.current}
                changeText={`${adminDash?.authors?.change_percent}%`}
                changeType={
                  adminDash?.authors?.trend === "up" ? "positive" : "negative"
                }
                strokeColor="#16a34a"
              />
              <StatCard
                title="Books Reviewed"
                amount={adminDash?.total_books_reviewed?.current}
                changeText={`${adminDash?.total_books_reviewed?.change_percent}%`}
                changeType={
                  adminDash?.total_books_reviewed?.trend === "up"
                    ? "positive"
                    : "negative"
                }
                strokeColor="#16a34a"
              />
              <StatCard
                title="Pending Review Requests"
                amount={adminDash?.pending_review_requests}
                changeText="0%"
                changeType="positive"
                strokeColor="#16a34a"
              />
            </>
          )}
        </div>

        {/* Scrollable Table Section */}
        <div className="mt-6">
          {/* Filters */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-2">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-start gap-2 w-full">
              {/* All Button (clears filters) */}
              {/* <Button
                variant="outline"
                className="flex items-center gap-1"
                onClick={() => {
                  setStatusFilter("");
                  setSearchTerm("");
                }}
              >
                All <X className="w-3 h-3" />
              </Button> */}

              {/* Status Dropdown */}
              {/* <Select onValueChange={(value) => setStatusFilter(value)}>
                <SelectTrigger className="w-full md:w-[150px] h-9 text-sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending approval">
                    Pending Approval
                  </SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select> */}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-[400px]">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={16}
              />
              <Input
                type="text"
                placeholder="Search books..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg p-2 my-2 mt-4 shadow-sm">
            {/* Table */}
            <div className=" border-[1px] rounded-md">
              <div className="bg-white rounded-lg p-2 mt-4 overflow-auto">
                <TableComponent
                  columns={columns}
                  data={filteredBooks.slice(0, 5)}
                  showPagination={false}
                  isLoading={isLoading}
                />
              </div>
            </div>

            {/* See All Button */}

            {filteredBooks.length === 0 ? (
              ""
            ) : (
              <div className="flex justify-end mt-4">
                <Link to="/admin/content-management/all-book">
                  <Button variant="link" className="text-sm">
                    See All
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Overview;
