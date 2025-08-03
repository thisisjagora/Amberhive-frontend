import React, { useEffect, useState } from "react";
import { FaCheck, FaCloudUploadAlt, FaPlus, FaSearch } from "react-icons/fa";
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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FiMoreVertical, FiTrash2 } from "react-icons/fi";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";
import TableComponent from "@/components/TableComponent";
import { fetchMyTickets } from "@/store/slice/ticketSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router";
import CreateTicket from "@/components/CreateTicket";
import { formatDate } from "@/utils/format";

const Support = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "support";
  const [searchTerm, setSearchTerm] = useState("");
  const { myTickets, statusMyTickets } = useSelector((state) => state.tickets);

  useEffect(() => {
    dispatch(fetchMyTickets());
  }, [dispatch]);

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          className="border-gray-300"
          aria-label="Select all tickets"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          className="border-gray-300"
          aria-label={`Select ticket ${row.original.ticket_id}`}
        />
      ),
      size: 40,
    },
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
        const status = row.original.status.toLowerCase();
        const statusClass =
          status === "open"
            ? "text-green-600"
            : status === "closed"
            ? "text-red-500"
            : "text-yellow-500";

        return (
          <span className={`text-sm font-medium ${statusClass}`}>
            {row.original.status}
          </span>
        );
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
      size: 80,
    },
  ];

  const filteredTickets = myTickets.filter((ticket) => {
    const term = searchTerm.toLowerCase();
    return (
      ticket.subject?.toLowerCase().includes(term) ||
      ticket.support_id?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-[80rem] mx-auto px-4 py-10">
      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          navigate(`/support?tab=${value.toLowerCase()}`);
        }}
      >
        <div className="w-full overflow-auto py-2">
          <div className=" md:w-full w-[1000px] border-b-3 border-gray-200">
            <TabsList className="flex items-center gap-6 w-max bg-transparent p-0">
              {["support", "ticket"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="text-base font-medium  text-gray-600 data-[state=active]:shadow-none data-[state=active]:text-base data-[state=active]:font-[600] data-[state=active]:text-yellow-600 data-[state=active]:border-b-3 data-[state=active]:border-yellow-500 p-2 rounded-none transition-colors border-0 pb-[30px] focus:outline-none justify-start"
                >
                  {tab === "ticket" ? `Ticket` : "Support"}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>
        <div>
          <TabsContent value="support" className="mt-6">
            {/* <div className="mb-8">
              <h1 className="text-xl font-bold text-gray-900">Support</h1>
              <p className="text-sm text-gray-500">
                Make your profile updates here
              </p>
            </div> */}
            <div className="flex flex-col  ml-2 py-6">
              <div className="w-full  px-2">
                {/* Search */}
                {/* <div className="relative w-full md:w-80 mb-2">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input placeholder="Search" className="pl-10 w-full" />
                </div> */}

                {/* FAQ Accordion */}
                <Accordion type="single" collapsible className="space-y-2">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-base flex items-center justify-between">
                      Are my carts same as my products?
                    </AccordionTrigger>
                    <AccordionContent>
                      No, your cart contains the products you are interested in
                      purchasing, but they are not the same as your listed
                      products. Your products refer to the items you are
                      selling, while the cart is for buying.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-base">
                      Can I try the platform for free?
                    </AccordionTrigger>
                    <AccordionContent>
                      Yes, you can try us for free for 30 days. If you want,
                      we’ll provide you with a free, personalized 30-minute
                      onboarding call to get you up and running as soon as
                      possible.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-base">
                      Can I change my bank account later?
                    </AccordionTrigger>
                    <AccordionContent>
                      Yes, you can update your bank account details anytime
                      through your account settings under the payment section.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger className="text-base">
                      What is your cancellation policy?
                    </AccordionTrigger>
                    <AccordionContent>
                      You can cancel your subscription at any time from your
                      dashboard. Cancellation takes effect at the end of your
                      current billing cycle.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5">
                    <AccordionTrigger className="text-base">
                      Can I be a buyer and also a seller at the same time?
                    </AccordionTrigger>
                    <AccordionContent>
                      Absolutely! You can seamlessly switch between buying and
                      selling within your account, allowing full flexibility.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-6">
                    <AccordionTrigger className="text-base">
                      What are my refund rights on your platform?
                    </AccordionTrigger>
                    <AccordionContent>
                      We provide refunds based on our refund policy. Typically,
                      refunds are available within 30 days of purchase if the
                      product is unused and meets our eligibility criteria.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-7">
                    <AccordionTrigger className="text-base">
                      How do I change my account email?
                    </AccordionTrigger>
                    <AccordionContent>
                      Go to your account settings, update the email field, and
                      verify the change through a confirmation email sent to the
                      new address.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ticket" className="mt-6">
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
                      placeholder="Search by subject or ticket ID..."
                      className="pl-8 w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  {/* 
                  <Button
                    variant="outline"
                    className="flex text-base items-center gap-1"
                  >
                    <VscListFilter /> 
                    Filter
                  </Button> */}
                </div>

                <CreateTicket />
              </div>

              <div>
                <div className="bg-white border-[1px] rounded-lg w-full p-4 h-auto shadow-md">
                  <div className="relative overflow-x-auto rounded-t-lg">
                    <TableComponent
                      data={filteredTickets}
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
  );
};

export default Support;
