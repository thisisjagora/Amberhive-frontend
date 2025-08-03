import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import SuperAdminLayout from "./DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/utils/format";
import {
  fetchPendingRoyaltyNaira,
  fetchPendingRoyaltyUSD,
} from "@/redux/slices/royaltySlice";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const flattenRoyaltyData = (data) =>
  Object.entries(data).map(([authorName, royalties]) => ({
    name: authorName,
    items: royalties,
  }));

const Payout = () => {
  const dispatch = useDispatch();
  const { pendingNaira, pendingUSD, statusNaira, statusUSD } = useSelector(
    (state) => state.royalty
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedAuthors, setExpandedAuthors] = useState({});

  useEffect(() => {
    dispatch(fetchPendingRoyaltyNaira());
    dispatch(fetchPendingRoyaltyUSD());
  }, [dispatch]);

  const toggleAuthor = (name) => {
    setExpandedAuthors((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const renderTable = (data, loading) => {
    if (loading) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, idx) => (
            <Skeleton key={idx} className="h-12 w-full" />
          ))}
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <div className="bg-white border rounded-md shadow-sm">
          <p className="text-sm text-gray-500 text-center py-4">
            No results found.
          </p>
        </div>
      );
    }

    return (
      <div className="bg-white border rounded-md shadow-sm">
        <div className="divide-y">
          {data.map((author) => (
            <div key={author.name} className="py-4 px-4">
              <button
                onClick={() => toggleAuthor(author.name)}
                className="w-full text-left cursor-pointer text-base font-medium text-yellow-700 hover:underline"
              >
                {author.name} ({author.items.length})
              </button>

              {expandedAuthors[author.name] && (
                <div className="mt-3">
                  <div className="grid grid-cols-4 gap-2 text-sm font-semibold text-gray-600 border-b py-1 px-2">
                    <div>Amount</div>
                    <div>Royalty %</div>
                    <div>Date</div>
                    <div>Status</div>
                  </div>

                  {author.items.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-4 gap-2 text-sm text-gray-700 py-2 px-2 border-b hover:bg-gray-50"
                    >
                      <div>
                        {item.currency === "ngn" ? "₦" : "$"}
                        {Number(item.amount).toLocaleString()}
                      </div>
                      <div>{item.royalty_percentage}%</div>
                      <div>{formatDate(item.created_at)}</div>
                      <div>
                        <Badge
                          className={`capitalize ${
                            item.status === "pending"
                              ? "bg-yellow-100 text-yellow-800 font-[600]"
                              : "bg-gray-100 text-gray-800 font-[600]"
                          }`}
                        >
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const groupedNaira = flattenRoyaltyData(pendingNaira).filter((author) =>
    author.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const groupedUSD = flattenRoyaltyData(pendingUSD).filter((author) =>
    author.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SuperAdminLayout
      header={
        <div className="px-4 mt-20 md:mt-0 py-6">
          <h1 className="text-xl font-bold">Payouts</h1>
          <p className="text-gray-500 text-sm">Review all pending payouts</p>
        </div>
      }
    >
      <div className="mt-8 px-4 space-y-4">
        <Tabs defaultValue="naira">
          {/* Tabs */}
          <div className="w-full overflow-auto py-2">
            <div className=" md:w-full border-b-3 border-gray-200">
              <TabsList className="flex items-center gap-6 w-max bg-transparent p-0">
                {[
                  { label: "Pending Naira", value: "naira" },
                  { label: "Pending USD", value: "usd" },
                ].map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="text-base font-medium text-gray-600 
                      data-[state=active]:shadow-none 
                      data-[state=active]:text-base 
                      data-[state=active]:font-[600] 
                      data-[state=active]:text-yellow-600 
                      data-[state=active]:border-b-3 
                      data-[state=active]:border-yellow-500 
                      p-2 rounded-none transition-colors border-0 
                      pb-[30px] focus:outline-none justify-start"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>
          {/* Search */}
          <div className="relative max-w-md mt-4">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <Input
              placeholder="Search author name..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Tables */}
          <TabsContent value="naira" className="mt-6">
            {renderTable(groupedNaira, statusNaira === "loading")}
          </TabsContent>

          <TabsContent value="usd" className="mt-6">
            {renderTable(groupedUSD, statusUSD === "loading")}
          </TabsContent>
        </Tabs>
      </div>
    </SuperAdminLayout>
  );
};

export default Payout;
