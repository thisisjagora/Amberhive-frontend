import { MoreVertical, Search, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FaPlus } from "react-icons/fa";
import TableComponent from "../TableComponent";
import {
  addSubscribers,
  getMySubscribers,
  importSubscribers,
} from "@/redux/slices/emailCampaignSlice";
import { useDispatch, useSelector } from "react-redux";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const subscriberColumns = [
  {
    id: "name",
    header: () => (
      <div className="text-left font-semibold text-gray-700 uppercase text-xs tracking-wider px-2 py-1">
        Name of Subscriber
      </div>
    ),
    accessorKey: "name",
    cell: ({ row }) => {
      const { first_name, last_name } = row.original;
      return (
        <div className="font-medium text-sm text-gray-800 px-2 py-1">
          {`${first_name} ${last_name}`}
        </div>
      );
    },
  },
  {
    id: "email",
    header: () => (
      <div className="text-left font-semibold text-gray-700 uppercase text-xs tracking-wider px-2 py-1">
        Email Address
      </div>
    ),
    accessorKey: "email",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground px-2 py-1">
        {row.original.email}
      </div>
    ),
  },
  {
    id: "dateJoined",
    header: () => (
      <div className="text-left font-semibold text-gray-700 uppercase text-xs tracking-wider px-2 py-1">
        Date Joined
      </div>
    ),
    accessorKey: "subscribed_at",
    cell: ({ row }) => {
      const date = new Date(row.original.subscribed_at);
      return (
        <div className="font-medium text-sm text-gray-800 px-2 py-1">
          {date.toLocaleDateString()}
        </div>
      );
    },
  },
];

const ImportedEmailCampaign = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [file, setFile] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const {
    subscribers,
    statusFetchSubscribers,
    statusImport,
    statusAdd,
    error,
  } = useSelector((state) => state.emailCampaign);

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
  });

  useEffect(() => {
    dispatch(getMySubscribers());
  }, [dispatch]);

  const handleImport = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await dispatch(importSubscribers(formData)).unwrap();

      fetch("https://test.amber-hive.com/api/run-queue?token=secret123").catch(
        (err) => console.warn("Queue trigger failed:", err)
      );

      await dispatch(getMySubscribers());
      toast.success(result?.message);
    } catch (error) {
      toast.error(error?.message);
    }

    setFile(null);
    setOpenDialog(false);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    const { firstname, lastname, email } = form;

    // Basic validation
    if (!firstname || !lastname || !email) {
      toast.error("All fields are required.");
      return;
    }

    if (!email.includes("@")) {
      toast.error("Invalid email format.");
      return;
    }

    try {
      // Dispatch and unwrap the result
      const result = await dispatch(addSubscribers(form)).unwrap();

      // Trigger background queue processing
      fetch("https://test.amber-hive.com/api/run-queue?token=secret123").catch(
        (err) => console.warn("Queue trigger failed:", err)
      );

      // Use the message from the result
      toast.success(result?.message || "Subscriber added successfully.");

      // Optionally re-fetch the updated list
      await dispatch(getMySubscribers());

      // Reset form and close dialog
      setForm({ firstname: "", lastname: "", email: "" });
      setAddDialogOpen(false);
    } catch (err) {
      toast.error(err?.message || "Failed to add subscriber.");
    }
  };

  const filteredSubscribers = subscribers?.filter((subscriber) => {
    const fullName =
      `${subscriber.first_name} ${subscriber.last_name}`.toLowerCase();
    const email = subscriber.email?.toLowerCase();
    const search = searchTerm.toLowerCase();

    return fullName.includes(search) || email.includes(search);
  });

  return (
    <div>
      <div className="">
        <div className="flex flex-col mt-2 items-center justify-between mb-4 gap-2">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 w-full">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              {" "}
              {/* increased from md:w-60 */}
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:justify-end md:gap-2 w-full">
              {/* Add Manually */}
              <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center cursor-pointer gap-2 w-full md:w-auto justify-center"
                  >
                    <FaPlus className="h-3 w-3" />
                    Add Subscriber
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md font-gilroy">
                  <DialogHeader>
                    <DialogTitle>Add Subscriber</DialogTitle>
                    <DialogDescription>
                      Enter subscriber details.
                    </DialogDescription>
                  </DialogHeader>

                  <form className="space-y-4" onSubmit={handleAddSubmit}>
                    <Input
                      placeholder="First Name"
                      value={form.firstname}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          firstname: e.target.value,
                        }))
                      }
                      required
                    />
                    <Input
                      placeholder="Last Name"
                      value={form.lastname}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          lastname: e.target.value,
                        }))
                      }
                      required
                    />
                    <Input
                      placeholder="Email"
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, email: e.target.value }))
                      }
                      required
                    />

                    <DialogFooter className="mt-2 flex justify-end gap-2">
                      <Button
                        variant="outline"
                        type="button"
                        className="cursor-pointer"
                        onClick={() => setAddDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={statusAdd === "loading"}
                        className="cursor-pointer"
                      >
                        {statusAdd === "loading"
                          ? "Adding..."
                          : "Add Subscriber"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Import CSV */}
              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                  <Button className="flex items-center cursor-pointer gap-2 w-full md:w-auto justify-center">
                    <FaPlus className="h-3 w-3" />
                    Import Subscriber
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md font-gilroy">
                  <DialogHeader>
                    <DialogTitle>Import Subscribers</DialogTitle>
                    <DialogDescription>
                      Upload a .csv file with your subscriber list.
                    </DialogDescription>
                  </DialogHeader>
                  <Input
                    type="file"
                    accept=".csv"
                    onChange={(e) => {
                      const selected = e.target.files?.[0];
                      if (selected?.type !== "text/csv") {
                        alert("Only CSV files are allowed.");
                        return;
                      }
                      setFile(selected);
                    }}
                  />
                  <DialogFooter className="mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setOpenDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleImport}
                      disabled={!file || statusImport === "loading"}
                    >
                      {statusImport === "loading"
                        ? "Uploading..."
                        : "Import File"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="bg-white border-[1px] rounded-lg w-full p-4 h-auto shadow-md">
            <TableComponent
              data={filteredSubscribers}
              columns={subscriberColumns}
              showPagination={true}
              isLoading={statusFetchSubscribers === "loading"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportedEmailCampaign;
