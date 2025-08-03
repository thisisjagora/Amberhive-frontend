import React, { useEffect, useState } from "react";
import SuperAdminLayout from "./DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TableComponent from "@/components/TableComponent";
import { Search } from "lucide-react";
import AddSubscriptions from "@/components/forms/AddSubscriptions";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubscriptionPlans } from "@/redux/slices/subscriptionPlanSlice";
import { formatDate } from "@/utils/format";
import EditSubscriptionDialog from "@/components/forms/EditSubscriptionDialog";

const Subscription = () => {
  const dispatch = useDispatch();

  const { plans, statusFetch } = useSelector(
    (state) => state.subscriptionPlans
  );

  useEffect(() => {
    dispatch(fetchSubscriptionPlans());
  }, [dispatch]);

  const columns = [
    {
      id: "title",
      header: () => (
        <span className="font-semibold text-gray-700 px-3">
          Name of Subscription
        </span>
      ),
      accessorKey: "name",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-gray-800 px-3">
          {row.original.name}
        </span>
      ),
    },
    {
      id: "cost",
      header: () => (
        <span className="font-semibold text-gray-700 px-3">Cost</span>
      ),
      accessorKey: "monthly_price",
      cell: ({ row }) => (
        <span className="text-sm text-gray-600 px-3">
          {row.original.monthly_price}
        </span>
      ),
    },
    {
      id: "features",
      header: () => (
        <span className="font-semibold text-gray-700 px-3">Features</span>
      ),
      accessorKey: "features",
      cell: ({ row }) => {
        const featuresList = row.original.features || [];
        return (
          <div className="px-3 text-left">
            <ul className="list-disc list-outside pl-5 text-sm text-gray-500 max-w-[280px] space-y-2">
              {Array.isArray(featuresList) &&
                featuresList.map((item, index) => (
                  <li key={index} className="break-words whitespace-normal">
                    {item}
                  </li>
                ))}
            </ul>
          </div>
        );
      },
    },
    {
      id: "date",
      header: () => (
        <span className="font-semibold text-gray-700 px-3">
          Date Created
        </span>
      ),
      accessorKey: "created_at",
      cell: ({ row }) => (
        <span className="text-sm text-gray-600 px-3">
          {formatDate(row.original.created_at)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center gap-3 text-gray-500 px-3">
          <EditSubscriptionDialog plan={row.original}  />
        </div>
      ),
      size: 80,
    },
  ];



  return (
    <SuperAdminLayout
      header={
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center ">
          <div className="flex flex-col px-4 mt-20 md:mt-0 py-6 justify-start items-start w-full">
            <div className="flex flex-col items-start gap-2">
              <h1 className="text-xl font-bold">Subscription</h1>
              <p className="text-gray-500 text-sm">
                Manage users subscriptions here
              </p>
            </div>
          </div>
          <div className="w-full md:w-auto flex md:px-6 justify-start md:justify-end">
            <AddSubscriptions />
          </div>
        </div>
      }
    >
      <div className="md:mt-6 mt-16 mx-4">
        <div className="w-full">
          <div className="flex flex-col md:flex-row gap-4 my-4 items-start md:items-center justify-start md:justify-between bg-white">
            {/* Search */}
            <div className="flex flex-col-reverse md:flex-row items-start md:items-center gap-2 w-[400px] max-w-full">
              <div className="relative w-full md:w-[400px]">
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
            </div>
          </div>

          <div className="bg-white border-[1px] rounded-lg w-full p-4 h-auto shadow-md">
            <div className="relative overflow-x-auto rounded-t-lg">
              <TableComponent
                data={plans}
                columns={columns}
                showPagination={false}
                isLoading={statusFetch === "loading"}
              />
            </div>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default Subscription;
