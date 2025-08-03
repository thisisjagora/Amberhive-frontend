import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Search } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import TableComponent from "@/components/TableComponent";
import Layout from "@/components/shared/Layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StatCard from "@/components/dashboard/StatCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthorStats } from "@/redux/slices/dashboardSlice";
import { fetchProfile } from "@/redux/slices/authSlice";

const columns = [

  {
    id: "title",
    accessorKey: "title",
    header: () => (
      <span className="text-sm font-semibold text-gray-700">Name of Book</span>
    ),
    cell: ({ row }) => {
      const { title } = row.original;
      return (
        <div className="flex items-center gap-2 py-2">
          <h1 className="text-sm text-gray-800">{title}</h1>
        </div>
      );
    },
  },
  {
    id: "sales",
    accessorKey: "sales",
    header: () => (
      <span className="text-sm font-semibold text-gray-700">Sales</span>
    ),
    cell: ({ row }) => {
      const { sales } = row.original;
      return (
        <div className="py-2">
          <span className="text-sm text-gray-800">{sales}</span>
        </div>
      );
    },
  },
  {
    id: "revenue",
    accessorKey: "revenue",
    header: () => (
      <span className="text-sm font-semibold text-gray-700">Revenue</span>
    ),
    cell: ({ row }) => {
      const { revenue } = row.original;
      return (
        <div className="py-2">
          <span className="text-sm text-gray-800">{revenue}</span>
        </div>
      );
    },
  },
];

const Overview = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();

  const { stats, status } = useSelector((state) => state.dashboard);
    const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchAuthorStats());
     dispatch(fetchProfile());
  }, [dispatch]);



  return (
    <Layout
      header={
        <div className="flex flex-col px-4 mt-20 md:mt-0 py-6 justify-start items-start w-full">
          <h1 className="text-xl font-bold">
            Welcome back, {user?.user?.name.split(" ")[0]}
          </h1>
          <p className="text-gray-500 text-sm">
            Track, manage and forecast your customers and book orders.
          </p>
        </div>
      }
    >
      {/* Cards Section */}

      <div className="px-4">
        {status === "loading" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:mt-4 mt-12">
            {/* Skeletons for loading state */}
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-[140px] bg-gray-100 animate-pulse rounded-xl"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:mt-4 mt-12">
            <StatCard
              title="Total Earnings"
              amount={`₦${stats?.total_earnings?.current ?? 0}`}
              changeText={`${Math.abs(
                stats?.total_earnings?.change_percent ?? 0
              )}%`}
              changeType={
                stats?.total_earnings?.trend === "up"
                  ? "positive"
                  : stats?.total_earnings?.trend === "down"
                  ? "negative"
                  : "neutral"
              }
              data={stats?.earningsData || []}
              strokeColor="#16a34a"
            />
            <StatCard
              title="Total Book Sales"
              amount={stats?.total_sales?.current ?? 0}
              changeText={`${Math.abs(
                stats?.total_sales?.change_percent ?? 0
              )}%`}
              changeType={
                stats?.total_sales?.trend === "up"
                  ? "positive"
                  : stats?.total_sales?.trend === "down"
                  ? "negative"
                  : "neutral"
              }
              data={stats?.bookSalesData || []}
              strokeColor="#dc2626"
            />
            <StatCard
              title="Total Royalties"
              amount={`₦${stats?.total_royalties?.current ?? 0}`}
              changeText={`${Math.abs(
                stats?.total_royalties?.change_percent ?? 0
              )}%`}
              changeType={
                stats?.total_royalties?.trend === "up"
                  ? "positive"
                  : stats?.total_royalties?.trend === "down"
                  ? "negative"
                  : "neutral"
              }
              data={stats?.royaltiesData || []}
              strokeColor="#16a34a"
            />
          </div>
        )}

        {/* Scrollable Table Section */}
        <div className="mt-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-2">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-start gap-2 w-full">
              {/* All Button (clears filters) */}
              {/* <Button variant="outline" className="flex items-center gap-1">
                All <X className="w-3 h-3" />
              </Button> */}

              {/* Status Dropdown */}
              {/* <Select>
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
            <div className="relative w-full md:w-5/12">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search"
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}

          <div className="bg-white border-[1px] rounded-lg p-2 my-2 mt-4 shadow-sm">
            <div className="">
              <div className="bg-white rounded-lg p-2 mt-4 overflow-auto">
                <TableComponent
                  columns={columns}
                  data={
                    stats?.books?.filter((book) =>
                      book.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    ) || []
                  }
                  showPagination={true}
                  isLoading={status === "loading"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Overview;
