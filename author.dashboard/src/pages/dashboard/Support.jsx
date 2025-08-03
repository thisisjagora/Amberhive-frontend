import React, { useEffect, useState } from "react";
import { FaCheck, FaCloudUploadAlt, FaSearch } from "react-icons/fa";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Layout from "@/components/shared/Layout";
import SupportHeader from "@/components/headers/SupportHeader";
import { useDispatch, useSelector } from "react-redux";
import CreateTicket from "@/components/CreateTicket";
import TableComponent from "@/components/TableComponent";
import { fetchMyTickets } from "@/redux/slices/ticketSlice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/utils/format";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const Support = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "support";
  const { myTickets, statusMyTickets } = useSelector((state) => state.tickets);

  useEffect(() => {
    dispatch(fetchMyTickets());
  }, [dispatch]);

  const columns = [
    {
      id: "ticket_id",
      header: () => (
        <span className="font-semibold text-gray-700">Ticket ID</span>
      ),
      accessorKey: "ticket_id",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-gray-800 py-2 block">
          {row.original.support_id}
        </span>
      ),
    },
    {
      id: "subject",
      header: () => (
        <span className="font-semibold text-gray-700">Subject</span>
      ),
      accessorKey: "subject",
      cell: ({ row }) => (
        <span className="text-sm text-gray-800 py-2 block">
          {row.original.subject}
        </span>
      ),
    },
    {
      id: "description",
      header: () => (
        <span className="font-semibold text-gray-700">Description</span>
      ),
      accessorKey: "description",
      cell: ({ row }) => (
        <span className="text-sm text-gray-800 py-2 break-words whitespace-normal w-72 block">
          {row.original.description}
        </span>
      ),
    },

    {
      id: "category",
      header: () => (
        <span className="font-semibold text-gray-700">Category</span>
      ),
      accessorKey: "categories.name", // optional if you're using a custom cell
      cell: ({ row }) => (
        <span className="text-sm text-gray-800 py-2 block">
          {row.original.categories?.name || "—"}
        </span>
      ),
    },
    {
      id: "created_at",
      header: () => (
        <span className="font-semibold text-gray-700">Date Created</span>
      ),
      accessorKey: "created_at",
      cell: ({ row }) => (
        <span className="text-sm text-gray-800 py-2 block">
          {formatDate(row.original.created_at)}
        </span>
      ),
    },

    {
      id: "status",
      header: () => <span className="font-semibold text-gray-700">Status</span>,
      accessorKey: "status",
      cell: ({ row }) => {
        const status = (row.original.status || "").toLowerCase();

        const statusMap = {
          open: {
            label: "Open",
            className: "bg-green-100 text-green-800",
          },
          in_progress: {
            label: "In Progress",
            className: "bg-yellow-100 text-yellow-800",
          },
          closed: {
            label: "Closed",
            className: "bg-red-100 text-red-800",
          },
        };

        const badge = statusMap[status] || {
          label: status,
          className: "bg-gray-100 text-gray-800",
        };

        return <Badge className={badge.className}>{badge.label}</Badge>;
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const id = row.original.id;

        return (
          <div className="flex items-center gap-3 py-2">
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={() =>
                navigate(`/ticket/${id}`, { state: { from: "tickets-tab" } })
              }
            >
              View Ticket
            </Button>
          </div>
        );
      },
      size: 120,
    },
  ];

  return (
    <Layout header={<SupportHeader />}>
      <div className=" px-4 py-2">
        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            navigate(`/dashboard/support?tab=${value.toLowerCase()}`);
          }}
        >
          <div className="w-full overflow-auto py-2">
            <div className=" md:w-full w-[1000px] border-b-3 border-gray-200">
              <TabsList className="flex items-center gap-6 w-max bg-transparent p-0">
                {["support", "tickets"].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="text-base font-medium cursor-pointer text-gray-600 data-[state=active]:shadow-none data-[state=active]:text-base data-[state=active]:font-[600] data-[state=active]:text-yellow-600 data-[state=active]:border-b-3 data-[state=active]:border-yellow-500 p-2 rounded-none transition-colors border-0 pb-[30px] focus:outline-none justify-start"
                  >
                    {tab === "tickets" ? "Tickets" : "Support"}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>
          <div>
            <TabsContent value="support" className="mt-6">
              <div className="flex flex-col  ml-2 py-6">
                <div className="w-full  px-2">
                  {/* Search */}
                  <div className="relative w-full md:w-80 mb-2">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input placeholder="Search" className="pl-10 w-full" />
                  </div>

                  {/* FAQ Accordion */}
                  <Accordion type="single" collapsible className="space-y-2">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-base flex items-center justify-between">
                        How do I reset my password?
                      </AccordionTrigger>
                      <AccordionContent>
                        To reset your password, click “Forgot Password” at
                        login, enter your email, and follow the instructions
                        sent to your inbox.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-base">
                        How can I update my billing information?
                      </AccordionTrigger>
                      <AccordionContent>
                        Go to “Payment Settings” in your account to add or
                        modify your payment method.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger className="text-base">
                        How do I contact customer support?
                      </AccordionTrigger>
                      <AccordionContent>
                        Use our Contact Us page or email support@company.com.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                      <AccordionTrigger className="text-base">
                        What is your refund policy?
                      </AccordionTrigger>
                      <AccordionContent>
                        We offer a 30-day refund on all purchases. Contact
                        support to request one.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5">
                      <AccordionTrigger className="text-base">
                        How do I update my email address?
                      </AccordionTrigger>
                      <AccordionContent>
                        In Account Settings, update your email and confirm via
                        the link we send.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tickets" className="mt-6">
              <div>
                <div className="flex flex-col md:flex-row gap-4  my-4 items-start md:items-center justify-start md:justify-between bg-white">
                  <div className="flex flex-col-reverse md:flex-row items-start md:items-center gap-2 w-[400px] max-w-full">
                    <div className="relative md:w-[400px]">
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

                    {/* <Button
                      variant="outline"
                      className="flex text-base items-center gap-1"
                    >
                     
                      Filter
                    </Button> */}
                  </div>

                  <CreateTicket />
                </div>

                <div>
                  <div className="bg-white border-[1px] rounded-lg w-full p-4 h-auto shadow-md">
                    <div className="relative overflow-x-auto rounded-t-lg">
                      <TableComponent
                        data={myTickets}
                        columns={columns}
                        showPagination={false}
                        isLoading={statusMyTickets === "loading"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Support;
