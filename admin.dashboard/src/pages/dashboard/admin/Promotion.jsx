import React, { useEffect, useState } from "react";
import PromotionHeader from "@/components/headers/PromotionHeader";

import { MoreVertical, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import TableComponent from "@/components/TableComponent";
import { Checkbox } from "@/components/ui/checkbox";
import StatCard from "@/components/dashboard/StatCard";
import AdminLayout from "./DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCampaignStats } from "@/redux/slices/promotionSlice";
import { formatDate } from "@/utils/format";
import { Skeleton } from "@/components/ui/skeleton";

const campaignColumns = [

  {
    id: "campaignName",
    header: "Campaign Name",
    accessorKey: "subject",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        {row.original.cover_image ? (
          <img
            src={`https://test.amber-hive.com/storage/${row.original.cover_image}`}
            alt={row.original.subject}
            className="w-16 h-20 object-cover rounded"
          />
        ) : (
          <div className="w-16 h-20 flex items-center justify-center text-xs text-gray-400 bg-gray-100 rounded">
            No image
          </div>
        )}
        <span className="font-[500]">{row.original.subject}</span>
      </div>
    ),
  },
  {
    id: "recipients",
    header: "Recipients",
    accessorKey: "mailchimp_stats.recipients",
    cell: ({ row }) => <span>{row.original.mailchimp_stats.recipients}</span>,
  },
  {
    id: "opens",
    header: "Opens",
    accessorKey: "mailchimp_stats.opens",
    cell: ({ row }) => <span>{row.original.mailchimp_stats.opens}</span>,
  },
  {
    id: "clicks",
    header: "Clicks",
    accessorKey: "mailchimp_stats.clicks",
    cell: ({ row }) => <span>{row.original.mailchimp_stats.clicks}</span>,
  },
  {
    id: "unsubscribes",
    header: "Unsubscribes",
    accessorKey: "mailchimp_stats.unsubscribes",
    cell: ({ row }) => <span>{row.original.mailchimp_stats.unsubscribes}</span>,
  },
  {
    id: "createdBy",
    header: "Author",
    accessorKey: "author",
    cell: ({ row }) => <span>{row.original.author}</span>,
  },
  {
    id: "dateCreated",
    header: "Sent At",
    accessorKey: "sent_at",
    cell: ({ row }) => <span>{formatDate(row.original.sent_at)}</span>,
  },
  // {
  //   id: "actions",
  //   header: "",
  //   cell: ({ row }) => (
  //     <div className="flex items-center gap-3 text-gray-600">
  //       <button
  //         className="hover:text-yellow-600 transition-colors"
  //         title="Edit"
  //       >
  //         <MoreVertical size={18} />
  //       </button>
  //     </div>
  //   ),
  //   size: 80,
  // },
];

const Promotion = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const { status } = useSelector((state) => state.promotion);
  const { stats, campaigns } = useSelector(
    (state) => state.promotion.campaignStats
  );

  useEffect(() => {
    dispatch(fetchAllCampaignStats());
  }, [dispatch]);

  // Filter campaigns by subject or author
  const filteredCampaigns =
    campaigns?.filter((campaign) => {
      const query = searchQuery.toLowerCase();
      return (
        campaign?.subject?.toLowerCase().includes(query) ||
        campaign?.author?.toLowerCase().includes(query)
      );
    }) || [];

  return (
    <AdminLayout header={<PromotionHeader />}>
      <div className="flex flex-col md:mt-10 px-4 gap-6">
        <div className="">
          {/* Cards Section */}

          {status === "loading" ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-y-auto">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="space-y-2 p-4 border rounded-md shadow-sm bg-white"
                >
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-y-auto">
              <StatCard
                title="Total Campaigns"
                amount={campaigns?.length || 0}
                changeText="0%" // Optional: calculate if needed
                changeType="positive"
                strokeColor="#16a34a"
                viewUrl="/admin/promotion/total-campaigns"
              />
              <StatCard
                title="Emails Sent"
                amount={stats?.recipients || 0}
                changeText="0%"
                changeType="positive"
                strokeColor="#16a34a"
                viewUrl="/admin/promotion/total-subscribers"
              />
              <StatCard
                title="Unsubscribed"
                amount={stats?.unsubscribes || 0}
                changeText="0%"
                changeType="negative"
                strokeColor="#dc2626"
                viewUrl="/admin/promotion/total-unsubscribers"
              />
              <StatCard
                title="Emails Opened"
                amount={stats?.opens || 0}
                changeText="0%"
                changeType="positive"
                strokeColor="#16a34a"
                viewUrl="/admin/promotion/total-views"
              />
            </div>
          )}

          <div className="my-8">
            <h1 className="font-[600]">Campaigns</h1>
          </div>

          <div className="flex flex-col mt-6 items-center justify-between mb-4 gap-2">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-start gap-2 w-full">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-start gap-2 w-full">
                {/* All Button (clears filters) */}
                <Button variant="outline" className="flex items-center gap-1">
                  All <X className="w-3 h-3" />
                </Button>
              </div>

              {/* Search Input */}
              <div className="relative w-full md:w-[500px]">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search campaigns by name or author"
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-white rounded-lg w-full p-4 h-auto shadow-md">
              <TableComponent
                data={filteredCampaigns}
                columns={campaignColumns}
                showPagination={true}
                isLoading={status === "loading"}
              />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Promotion;
