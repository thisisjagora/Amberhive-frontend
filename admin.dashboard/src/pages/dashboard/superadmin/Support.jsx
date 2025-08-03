import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import { Input } from "@/components/ui/input";

import SuperAdminLayout from "../superadmin/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TableComponent from "@/components/TableComponent";
import { Button } from "@/components/ui/button";
import { VscListFilter, VscListSelection } from "react-icons/vsc";
import { LayoutGrid, Pencil, Search } from "lucide-react";
import EditCategory from "@/components/forms/EditCategory";
import { fetchCategories } from "@/redux/slices/supportTicketSlice";
import { useDispatch, useSelector } from "react-redux";
import CreateCategory from "@/components/forms/CreateCategory";
import { formatDate } from "@/utils/format";
import { useNavigate, useSearchParams } from "react-router";
import AllTicket from "@/components/ticketSuper/AllTicket";
import MyTicket from "@/components/ticketSuper/MyTicket";
import OpenTicket from "@/components/ticketSuper/OpenTicket";

const Support = () => {
  const [editCategory, setEditCategory] = useState(null);
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "support";
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const {
    categories,

    statusFetchCategories,
    error,
  } = useSelector((state) => state.supportTicket);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const categoryColumns = [
    {
      id: "name",
      header: () => (
        <span className="text-sm font-semibold text-gray-700">Name</span>
      ),
      accessorKey: "name",
      cell: ({ row }) => <span>{row.original.name}</span>,
    },
    {
      id: "description",
      header: () => (
        <span className="text-sm font-semibold text-gray-700">Description</span>
      ),
      accessorKey: "description",
      cell: ({ row }) => (
        <span className="break-words whitespace-normal w-72 block">
          {row.original.description}
        </span>
      ),
    },
    {
      id: "created_at",
      header: () => (
        <span className="text-sm font-semibold text-gray-700">
          Date Created
        </span>
      ),
      accessorKey: "created_at",
      cell: ({ row }) => <span>{formatDate(row.original.created_at)}</span>,
    },
    {
      id: "updated_at",
      header: () => (
        <span className="text-sm font-semibold text-gray-700">
          Date Updated
        </span>
      ),
      accessorKey: "updated_at",
      cell: ({ row }) => <span>{formatDate(row.original.updated_at)}</span>,
    },
    {
      id: "actions",
      header: () => (
        <div className="flex justify-center">
          <h1 className="text-sm font-semibold text-gray-700">Actions</h1>
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center items-center">
          <button
            className="text-gray-500 hover:text-gray-900"
            onClick={() => setEditCategory(row.original)} // Triggers modal
          >
            <Pencil size={16} />
          </button>
        </div>
      ),
      size: 50,
    },
  ];

  const filteredCategories = categories?.filter((cat) =>
    cat.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SuperAdminLayout
      header={
        <div className="flex flex-col px-4 mt-20 md:mt-0 py-6 justify-start items-start w-full">
          <div className="flex flex-col items-start gap-2">
            <h1 className="text-xl font-bold">Support</h1>
            <p className="text-gray-500 text-sm">
              Track, manage and make insights on your dashboard
            </p>
          </div>
        </div>
      }
    >
      <div className="mt-8 mx-4">
        <div className=" w-full">
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              navigate(`/super-admin/support?tab=${value.toLowerCase()}`);
            }}
          >
            <div className="w-full overflow-auto py-2">
              <div className=" md:w-full border-b-3 border-gray-200">
                <TabsList className="flex items-center gap-6 w-max bg-transparent p-0">
                  {[
                    { label: "Support", value: "support" },
                    { label: "Category", value: "category" },
                    { label: "All Ticket", value: "allticket" },
                    { label: "My Ticket", value: "myticket" },
                    { label: "Open Ticket", value: "openticket" },
                  ].map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="text-base font-medium text-gray-600 data-[state=active]:shadow-none data-[state=active]:text-base data-[state=active]:font-[600] data-[state=active]:text-yellow-600 data-[state=active]:border-b-3 data-[state=active]:border-yellow-500 p-2 rounded-none transition-colors border-0 pb-[30px] focus:outline-none justify-start"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </div>
            <div>
              <TabsContent value="support" className="mt-6">
                <div className="w-full  mt-8 px-4">
                  {/* Search */}
                  {/* <div className="relative w-full md:w-80 mb-2">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input placeholder="Search" className="pl-10 w-full" />
                  </div> */}

                  {/* FAQ Accordion */}
                  <Accordion type="single" collapsible className="space-y-2">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-base flex items-center justify-between">
                        How do I approve/reject an author?
                      </AccordionTrigger>
                      <AccordionContent>
                        Yes, you can try us for free for 30 days. If you want,
                        we’ll provide you with a free, personalized 30-minute
                        onboarding call to get you up and running as soon as
                        possible.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-base">
                        How do I manually create a promotion?
                      </AccordionTrigger>
                      <AccordionContent>
                        Go to the Promotions section in your dashboard, click
                        “Create Promotion,” and fill in the necessary details
                        such as title, duration, and applicable authors or
                        content.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                      <AccordionTrigger className="text-base">
                        How do I manage the portal?
                      </AccordionTrigger>
                      <AccordionContent>
                        Access the portal management tools under “Admin
                        Settings.” From there, you can configure users,
                        permissions, and layout options.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                      <AccordionTrigger className="text-base">
                        Is approval/rejection automatic?
                      </AccordionTrigger>
                      <AccordionContent>
                        No, all approvals and rejections must be handled
                        manually by an admin unless automated rules are
                        configured in settings.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                      <AccordionTrigger className="text-base">
                        When should an ebook/pub be downloaded?
                      </AccordionTrigger>
                      <AccordionContent>
                        After the author has been approved and the final version
                        is submitted, ebooks or publications can be downloaded
                        from the user’s dashboard.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-6">
                      <AccordionTrigger className="text-base">
                        How do I change my account email?
                      </AccordionTrigger>
                      <AccordionContent>
                        Go to Account Settings, enter your new email, and
                        confirm the change through the verification link sent to
                        the new address.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </TabsContent>

              <TabsContent value="category" className="mt-6">
                <div>
                  <div className="mt-4">
                    <div className="flex flex-col px-4 mt-6 items-center justify-between mb-4 gap-2">
                      <div className="flex flex-col md:flex-row gap-4 w-full  my-4 justify-start md:justify-between bg-white">
                        {/* Right: Search and Filter */}
                        <div className="flex flex-col-reverse md:flex-row items-start md:items-center gap-2 md:w-[400px] max-w-full">
                          <div className="relative w-full md:w-[400px]">
                            <Search
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                              size={16}
                            />
                            <Input
                              type="text"
                              placeholder="Search categories by name..."
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

                        <div className="">
                          <CreateCategory
                            editCategory={editCategory}
                            onClose={() => setEditCategory(null)}
                          />
                        </div>
                      </div>

                      <div className="bg-white rounded-lg border-[1px] w-full p-4 h-auto shadow-md">
                        <div className="overflow-auto ">
                          <TableComponent
                            data={filteredCategories}
                            columns={categoryColumns}
                            showPagination={true}
                            isLoading={statusFetchCategories === "loading"}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {editCategory && (
                    <EditCategory
                      editData={editCategory}
                      isOpen={!!editCategory}
                      onClose={() => setEditCategory(null)}
                    />
                  )}
                </div>
              </TabsContent>
              <TabsContent value="allticket" className="mt-6">
                <div>
                  <AllTicket />
                </div>
              </TabsContent>
              <TabsContent value="myticket" className="mt-6">
                <div>
                  <MyTicket />
                </div>
              </TabsContent>
              <TabsContent value="openticket" className="mt-6">
                <div>
                  <OpenTicket />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default Support;
