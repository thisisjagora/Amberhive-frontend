import React, { useEffect, useState } from "react";
import Layout from "@/components/shared/Layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PromotionHeader from "@/components/headers/PromotionHeader";

import { MoreVertical, Search, SendHorizonal, Trash2, X } from "lucide-react";
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
import { TbMailCancel } from "react-icons/tb";

import BookLaunch from "@/components/promotion/BookLaunch";
import { FaPlus } from "react-icons/fa";
import { FiUserPlus } from "react-icons/fi";
import ImportedEmailCampaign from "@/components/promotion/ImportedEmailCampaign";
import { useDispatch, useSelector } from "react-redux";
import {
  getCampaignDrafts,
  getCampaignStats,
  getNewsletterSubscribers,
  sendCampaign,
} from "@/redux/slices/emailCampaignSlice";
import { formatDate } from "@/utils/format";
import { Skeleton } from "@/components/ui/skeleton";
import DiscountPromotion from "@/components/promotion/DiscountPromotion";
import NewRelease from "@/components/promotion/NewRelease";
import NewsLetterSubscribers from "@/components/promotion/NewsLetterSubscribers";

import { draftColumns } from "@/components/promotion/column";

const campaignColumns = [
  {
    id: "campaignName",
    header: "Campaign Name",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        {row.original.cover_image ? (
          <img
            src={`https://test.amber-hive.com/storage/${row.original.cover_image}`}
            alt={row.original.name}
            className="w-14 h-20 object-cover rounded"
          />
        ) : (
          <div className="w-14 h-20 flex items-center justify-center bg-gray-200 rounded text-gray-500 text-xs">
            No Image
          </div>
        )}
        <span className="font-[500]">{row.original.name}</span>
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
    id: "opened",
    header: "Opened",
    accessorKey: "mailchimp_stats.opens",
    cell: ({ row }) => <span>{row.original.mailchimp_stats.opens}</span>,
  },
  {
    id: "clicked",
    header: "Clicked",
    accessorKey: "mailchimp_stats.clicks",
    cell: ({ row }) => <span>{row.original.mailchimp_stats.clicks}</span>,
  },
  {
    id: "dateCreated",
    header: "Sent At",
    accessorKey: "sent_at",
    cell: ({ row }) => <span>{formatDate(row.original.sent_at)}</span>,
  },
];

const Promotion = () => {
  const [authorId, setAuthorId] = useState("");
  const dispatch = useDispatch();

  const {
    campaignStats,
    statusCampaignStats,
    newsletterSubscribers,
    campaignDrafts,
    statusFetchCampaignDrafts,
    error,
  } = useSelector((state) => state.emailCampaign);

  useEffect(() => {
    // Fetch user from localStorage and parse it
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setAuthorId(parsedUser.author_id);
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }
  }, []);

  useEffect(() => {
    if (authorId) {
      dispatch(getCampaignStats(authorId));
      dispatch(getNewsletterSubscribers(authorId));
      dispatch(getCampaignDrafts());
    }
  }, [authorId, dispatch]);

  return (
    <Layout header={<PromotionHeader />}>
      <div className="flex flex-col mt-8 px-2 gap-6">
        {/* Tabs Section */}
        <Tabs defaultValue="overview" className="flex gap-6">
          {/* Tabs Navigation on Left */}
          <div className="w-full overflow-auto py-2">
            <div className="border-b-3 w-full border-gray-200 rounded-none bg-gray-50">
              <TabsList className="flex w-[700px] gap-6 border-b-0 ml-16 border-gray-200 rounded-none bg-transparent">
                <TabsTrigger
                  value="overview"
                  className="text-base font-[500] text-gray-600 data-[state=active]:shadow-none data-[state=active]:text-base data-[state=active]:font-[600] data-[state=active]:text-yellow-600 data-[state=active]:border-b-3 data-[state=active]:border-yellow-500 p-2 rounded-none transition-colors border-0 pb-[30px] focus:outline-none justify-start"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="newsletters"
                  className="text-base font-[500] text-gray-600 data-[state=active]:shadow-none data-[state=active]:text-base data-[state=active]:font-[600] data-[state=active]:text-yellow-600 data-[state=active]:border-b-3 data-[state=active]:border-yellow-500 p-2 rounded-none transition-colors pb-[30px] border-0 focus:outline-none justify-start"
                >
                  NewsLetter Subscribers ({newsletterSubscribers.length})
                </TabsTrigger>

                <TabsTrigger
                  value="imported"
                  className="text-base font-[500] text-gray-600 data-[state=active]:shadow-none data-[state=active]:text-base data-[state=active]:font-[600] data-[state=active]:text-yellow-600 data-[state=active]:border-b-3 data-[state=active]:border-yellow-500 p-2 rounded-none transition-colors border-0 pb-[30px] focus:outline-none justify-start"
                >
                  Imported Subscribers
                </TabsTrigger>
                <TabsTrigger
                  value="emails"
                  className="text-base font-[500] text-gray-600 data-[state=active]:shadow-none data-[state=active]:text-base data-[state=active]:font-[600] data-[state=active]:text-yellow-600 data-[state=active]:border-b-3 data-[state=active]:border-yellow-500 p-2 rounded-none transition-colors border-0 pb-[30px] focus:outline-none justify-start"
                >
                  Emails Campaigns
                </TabsTrigger>
                <TabsTrigger
                  value="drafts"
                  className="text-base font-[500] text-gray-600 data-[state=active]:shadow-none data-[state=active]:text-base data-[state=active]:font-[600] data-[state=active]:text-yellow-600 data-[state=active]:border-b-3 data-[state=active]:border-yellow-500 p-2 rounded-none transition-colors border-0 pb-[30px] focus:outline-none justify-start"
                >
                  Drafts ({campaignDrafts.length})
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* Tab Content Section */}
          <div className="flex-1">
            <TabsContent value="overview">
              <div className="">
                {/* Cards Section */}
                {statusCampaignStats === "loading" ? (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-y-auto">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="space-y-2 p-4 border rounded shadow-sm bg-white"
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
                      title="Campaigns Sent"
                      amount={campaignStats?.data?.total?.recipients || 0}
                      changeText="0%"
                      changeType="positive"
                      strokeColor="#16a34a"
                    />
                    <StatCard
                      title="Click Rate"
                      amount={campaignStats?.data?.total?.clicks || 0}
                      changeText="0%"
                      changeType="positive"
                      strokeColor="#16a34a"
                    />
                    <StatCard
                      title="Open Rate"
                      amount={campaignStats?.data?.total?.opens || 0}
                      changeText="0%"
                      changeType="positive"
                      strokeColor="#16a34a"
                    />
                    <StatCard
                      title="Unsubscribe Rate"
                      amount={campaignStats?.data?.total?.unsubscribes || 0}
                      changeText="0%"
                      changeType="neutral"
                      strokeColor="#16a34a"
                    />
                  </div>
                )}

                <div className="flex flex-col mt-6 items-center justify-between mb-4 gap-2">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-start gap-2 w-full">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-start gap-2 w-full">
                      {/* All Button (clears filters) */}
                      <Button
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        All <X className="w-3 h-3" />
                      </Button>

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
                    <div className="relative w-full md:w-96">
                      <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search"
                        // value={searchTerm}
                        // onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg w-full p-4 h-auto shadow-md">
                    <TableComponent
                      data={campaignStats?.data?.table?.[0]?.campaigns || []}
                      columns={campaignColumns}
                      showPagination={false}
                      isLoading={statusCampaignStats === "loading"}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="newsletters">
              <div>
                <NewsLetterSubscribers data={newsletterSubscribers} />
              </div>
            </TabsContent>

            <TabsContent value="imported">
              <div>
                <ImportedEmailCampaign />
              </div>
            </TabsContent>

            <TabsContent value="emails">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {/* Book Launch */}
                <BookLaunch />

                {/* Discount & Promotion */}
                <DiscountPromotion />

                {/* New Release Update */}
                <NewRelease />
              </div>
            </TabsContent>

            <TabsContent value="drafts">
              <div className="p-4 bg-white ">
                {campaignDrafts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center mt-20 space-y-4">
                    <div className="bg-gray-100 rounded-full p-2 inline-block">
                      <div className="bg-gray-200 rounded-full p-2">
                        <TbMailCancel className="text-gray-600 text-2xl" />
                      </div>
                    </div>

                    <h2 className="text-lg font-semibold">
                      You do not have any Draft!
                    </h2>
                    <p className="text-base text-gray-500 max-w-md">
                      Your Draft is free from cobwebs.
                    </p>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg w-full p-4 h-auto border-[1px] mt-2 shadow">
                    <div className="relative overflow-x-auto rounded-t-lg">
                      <TableComponent
                        data={campaignDrafts}
                        columns={draftColumns}
                        showPagination={true}
                        isLoading={statusFetchCampaignDrafts === "loading"}
                      />
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Promotion;
