import React, { useEffect, useState } from "react";
import SuperAdminLayout from "./DashboardLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TbMail } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import { FiUploadCloud } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AiOutlineWarning } from "react-icons/ai";
import TableComponent from "@/components/TableComponent";
import { Badge } from "@/components/ui/badge";
import { Search, Send } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllRoles } from "@/redux/slices/usersSlice";
import {
  createAnnouncement,
  fetchAnnouncements,
  fetchDrafts,
  sendOutAnnouncement,
} from "@/redux/slices/announcementSlice";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const roleColors = {
  author: "bg-yellow-100 text-yellow-800",
  user: "bg-purple-100 text-purple-800",
  admin: "bg-gray-200 text-gray-800",
  "super admin": "bg-blue-100 text-blue-800",
};

const Announcements = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [target_users, setTarget_users] = useState("");
  const [isMainDialogOpen, setMainDialogOpen] = useState(false);
  const [isCancelDialogOpen, setCancelDialogOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchDraftQuery, setSearchDraftQuery] = useState("");
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();
  const { roles } = useSelector((state) => state.users);

  const {
    drafts,
    statusFetchDrafts,
    announcements,
    statusFetchAnnouncements,
    statusCreateAnnouncement,
    error,
  } = useSelector((state) => state.announcement);

  useEffect(() => {
    dispatch(fetchAllRoles());
    dispatch(fetchDrafts());
    dispatch(fetchAnnouncements());
  }, [dispatch]);

  const filteredAnnouncements = announcements?.filter((a) =>
    a?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDraft = drafts?.filter((a) =>
    a?.title?.toLowerCase().includes(searchDraftQuery.toLowerCase())
  );

  const draftColumns = [
    {
      id: "title",
      header: () => (
        <span className="font-medium text-gray-700 px-3">Title</span>
      ),
      accessorKey: "title",
      cell: ({ row }) => (
        <div className="flex items-center gap-3 px-3">
          {row.original.image_path ? (
            <img
              src={`https://test.amber-hive.com/storage/${row.original.image_path}`}
              alt={row.original.title}
              className="w-20 h-24 object-cover rounded-md border border-gray-200"
            />
          ) : (
            <div className="w-20 h-24 flex items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-gray-400 text-xs">
              No Image
            </div>
          )}
          <span className="text-sm font-medium text-gray-800">
            {row.original.title}
          </span>
        </div>
      ),
    },

    {
      id: "target_user_type",
      header: () => (
        <span className="font-medium text-gray-700 px-3">User Type</span>
      ),
      accessorKey: "target_user_type",
      cell: ({ row }) => {
        const roleName =
          roles
            .find((r) => String(r.id) === row.original.target_user_type)
            ?.name?.toLowerCase() || "unknown";

        const colorClass = roleColors[roleName] || "bg-gray-100 text-gray-700";

        return (
          <div className="px-3">
            <Badge className={`capitalize ${colorClass}`}>{roleName}</Badge>
          </div>
        );
      },
    },
    {
      id: "message",
      header: () => (
        <span className="font-medium text-gray-700 px-3">Body</span>
      ),
      accessorKey: "message",
      cell: ({ row }) => {
        const message = row.original.message;
        return (
          <div className="px-3 text-left max-w-xl">
            <span
              className="text-sm text-gray-500 break-words whitespace-normal"
              dangerouslySetInnerHTML={{ __html: message }}
            />
          </div>
        );
      },
    },
    {
      id: "created_at",
      header: () => (
        <span className="font-medium text-gray-700 px-3">Date</span>
      ),
      accessorKey: "created_at",
      cell: ({ row }) => (
        <span className="text-sm text-gray-600 px-3">
          {new Date(row.original.created_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: "status",
      header: () => (
        <span className="font-medium text-gray-700 px-3">Status</span>
      ),
      accessorKey: "draft",
      cell: ({ row }) => (
        <Badge variant="secondary">
          {row.original.draft === "1" ? "Draft" : "Sent"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const { statusSendOutAnnouncement } = useSelector(
          (state) => state.announcement
        );
        const handleConfirmSend = async () => {
          try {
            const result = await dispatch(sendOutAnnouncement(row.original.id));
            dispatch(fetchDrafts());
            if (sendOutAnnouncement.fulfilled.match(result)) {
              const message =
                result.payload?.message || "Announcement sent successfully";
              toast.success(message);
              setOpen(false);
            } else {
              throw new Error(result.payload || "Failed to send announcement");
            }
          } catch (error) {
            toast.error(error.message || "Something went wrong");
            console.error("Send error:", error);
          }
        };

        return (
          <div className="flex items-center gap-3 text-gray-500 px-3">
            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild>
                <button className="hover:text-green-600" title="Send">
                  <Send size={16} />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="flex flex-col font-gilroy items-center justify-center text-center space-y-4 mx-auto p-4">
                <div className="flex justify-center mt-6 items-center w-full">
                  <div className="bg-green-100 rounded-full p-2">
                    <div className="bg-green-200 rounded-full p-3">
                      <Send className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>
                <AlertDialogHeader className="flex flex-col items-center">
                  <AlertDialogTitle className="text-lg font-semibold">
                    Are you sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="mt-2 text-sm text-center text-gray-600 max-w-xs">
                    Do you want to send the announcement titled "
                    {row.original.title}"?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="">
                  <div className="w-full flex justify-center gap-4">
                    <AlertDialogCancel className="px-4 py-2 w-full">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleConfirmSend}
                      className="px-4 py-2 w-full"
                    >
                      {statusSendOutAnnouncement === "loading" ? (
                        <>
                          <span className="loader w-4 h-4 border-2 border-t-transparent rounded-full animate-spin mr-2" />
                          Sending...
                        </>
                      ) : (
                        "Send"
                      )}
                    </AlertDialogAction>
                  </div>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
      size: 80,
    },
  ];

  const announcementColumns = [
    {
      id: "title",
      header: () => (
        <span className="font-medium text-gray-700 px-3">Title</span>
      ),
      accessorKey: "title",
      cell: ({ row }) => (
        <div className="flex items-center gap-3 px-3">
          {row.original.image_path ? (
            <img
              src={`https://test.amber-hive.com/storage/${row.original.image_path}`}
              alt={row.original.title}
              className="w-20 h-24 object-cover rounded-md border border-gray-200"
            />
          ) : (
            <div className="w-20 h-24 flex items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-gray-400 text-xs">
              No Image
            </div>
          )}
          <div className="max-w-[250px]">
            <span className="text-sm font-medium text-gray-800 break-words whitespace-normal">
              {row.original.title}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "target_user_type",
      header: () => (
        <span className="font-medium text-gray-700 px-3">User Type</span>
      ),
      accessorKey: "target_user_type",
      cell: ({ row }) => {
        const roleName =
          roles
            .find((r) => String(r.id) === row.original.target_user_type)
            ?.name?.toLowerCase() || "unknown";
        const colorClass = roleColors[roleName] || "bg-gray-100 text-gray-700";
        return (
          <div className="px-3">
            <Badge className={`capitalize ${colorClass}`}>{roleName}</Badge>
          </div>
        );
      },
    },
    {
      id: "message",
      header: () => (
        <span className="font-medium text-gray-700 px-3">Body</span>
      ),
      accessorKey: "message",
      cell: ({ row }) => {
        const message = row.original.message;
        return (
          <div className="px-3 text-left max-w-xl">
            <span
              className="text-sm text-gray-500 break-words whitespace-normal"
              dangerouslySetInnerHTML={{ __html: message }}
            />
          </div>
        );
      },
    },
    {
      id: "created_at",
      header: () => (
        <span className="font-medium text-gray-700 px-3">Created</span>
      ),
      accessorKey: "created_at",
      cell: ({ row }) => (
        <span className="text-sm text-gray-600 px-3">
          {new Date(row.original.created_at).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: "updated_at",
      header: () => (
        <span className="font-medium text-gray-700 px-3">Updated</span>
      ),
      accessorKey: "updated_at",
      cell: ({ row }) => (
        <span className="text-sm text-gray-600 px-3">
          {new Date(row.original.updated_at).toLocaleDateString()}
        </span>
      ),
    },
  ];

  const handleSubmit = async (draftFlag = false) => {
    if (!title || !target_users || !message) {
      toast.warning("Please fill in all required fields.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("target_users", target_users);
      formData.append("message", message);
      formData.append("draft", draftFlag ? "1" : "0");
      if (image) formData.append("image", image);

      const resultAction = await dispatch(createAnnouncement(formData));
      dispatch(fetchAnnouncements());
      dispatch(fetchDrafts());

      if (createAnnouncement.fulfilled.match(resultAction)) {
        const message =
          resultAction.payload?.message ||
          (draftFlag ? "Saved as draft" : "Announcement sent");

        toast.success(message);
        // reset fields
        setTitle("");
        setTarget_users("");
        setMessage("");
        setImage(null);

        // close modal
        setMainDialogOpen(false);
      } else {
        toast.error(resultAction.error?.message || "Submission failed");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
      console.error("Submission error:", error);
    }
  };

  return (
    <SuperAdminLayout
      header={
        <div className="flex flex-col px-4 mt-20 md:mt-0 py-6 justify-start items-start w-full">
          <div className="flex flex-col items-start gap-2">
            <h1 className="text-xl font-bold">Announcements</h1>
            <p className="text-gray-500 text-sm">
              Send out messages to your audiences
            </p>
          </div>
        </div>
      }
    >
      <div className="mt-6 mx-4">
        <div className=" w-full">
          {/* Scrollable wrapper */}
          <Tabs defaultValue="All">
            <div className="w-full overflow-auto py-2">
              <div className=" md:w-full w-[1000px] border-b-3 border-gray-200">
                <TabsList className="flex items-center gap-6 w-max bg-transparent p-0">
                  {["All", "Draft"].map((tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className="text-base cursor-pointer font-medium  text-gray-600 data-[state=active]:shadow-none data-[state=active]:text-base data-[state=active]:font-[600] data-[state=active]:text-yellow-600 data-[state=active]:border-b-3 data-[state=active]:border-yellow-500 p-2 rounded-none transition-colors border-0 pb-[30px] focus:outline-none justify-start"
                    >
                      {tab === "Draft" ? `Draft (${drafts.length})` : "All"}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </div>
            <div>
              <TabsContent value="All" className="mt-6">
                {statusFetchAnnouncements === "loading" ? (
                  <div className="bg-white border-[1px] rounded-lg w-full p-4 my-2 h-auto shadow-md space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between space-x-4"
                      >
                        <Skeleton className="h-6 w-[30%]" />
                        <Skeleton className="h-6 w-[20%]" />
                        <Skeleton className="h-6 w-[20%]" />
                        <Skeleton className="h-6 w-[10%]" />
                      </div>
                    ))}
                  </div>
                ) : announcements.length === 0 ? (
                  <div className="p-4 bg-white ">
                    <div className="flex flex-col items-center justify-center text-center mt-20 space-y-4">
                      <div className="bg-gray-100 rounded-full p-2 inline-block">
                        <div className="bg-gray-200 rounded-full p-2">
                          <TbMail className="text-gray-600 text-2xl" />
                        </div>
                      </div>

                      <h2 className="text-lg font-semibold">
                        There is nothing here yet!
                      </h2>
                      <p className="text-base text-gray-500 max-w-md">
                        You can start messaging your audiences to let them know
                        what is happening.
                      </p>
                      <AlertDialog
                        open={isMainDialogOpen}
                        onOpenChange={setMainDialogOpen}
                      >
                        <AlertDialogTrigger asChild>
                          <Button className={` cursor-pointer`}>
                            <FaPlus className="mr-2" /> Create Announcement
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-lg w-full max-h-[90vh] flex flex-col font-gilroy">
                          <AlertDialogHeader className="w-full flex justify-center items-center">
                            <AlertDialogTitle className="text-xl font-bold">
                              Create Announcement
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-sm text-gray-500 text-center">
                              Fill out the form to send an announcement.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <div className="flex-1 overflow-y-auto px-1 space-y-4 pr-3">
                            {/* Title */}
                            <div>
                              <label className="text-sm font-medium text-gray-700">
                                Title*
                              </label>
                              <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="mt-1"
                              />
                            </div>

                            {/* User Type */}
                            <div>
                              <Label className="text-sm font-medium text-gray-700">
                                User Type*
                              </Label>
                              <Select
                                onValueChange={(value) =>
                                  setTarget_users(value)
                                }
                              >
                                <SelectTrigger className="mt-1 w-full">
                                  <SelectValue placeholder="Select user type" />
                                </SelectTrigger>
                                <SelectContent className="font-gilroy">
                                  {roles.map((role) => (
                                    <SelectItem
                                      key={role.id}
                                      value={String(role.id)}
                                    >
                                      {role.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Description with formatting */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">
                                Body*
                              </label>

                              {/* Toolbar */}
                              <div className="flex flex-wrap gap-2 mb-2">
                                {[
                                  { cmd: "bold", label: <b>B</b> },
                                  { cmd: "italic", label: <i>I</i> },
                                  { cmd: "underline", label: <u>U</u> },
                                  { cmd: "strikeThrough", label: <s>S</s> },
                                  { cmd: "insertOrderedList", label: "1." },
                                  { cmd: "insertUnorderedList", label: "•" },
                                  { cmd: "outdent", label: "⬅️" },
                                  { cmd: "indent", label: "➡️" },
                                  { cmd: "justifyLeft", label: "⬅ Align" },
                                  { cmd: "justifyCenter", label: "⬌ Center" },
                                  { cmd: "justifyRight", label: "Align ➡️" },
                                  { cmd: "justifyFull", label: "Justify" },
                                  { cmd: "removeFormat", label: "🚫 Clear" },
                                ].map((btn) => (
                                  <Button
                                    key={btn.cmd}
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      document.execCommand(btn.cmd)
                                    }
                                  >
                                    {btn.label}
                                  </Button>
                                ))}
                              </div>

                              {/* Editable Content */}
                              <div
                                contentEditable
                                style={{ direction: "ltr", textAlign: "left" }}
                                className="min-h-[150px] max-h-[300px] overflow-y-auto p-3 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500 prose whitespace-pre-wrap break-words"
                                onInput={(e) =>
                                  setMessage(e.currentTarget.innerHTML)
                                }
                                // dangerouslySetInnerHTML={{ __html: message }}
                              />
                              <div className="text-xs text-gray-400 text-right">
                                {message?.length}/1000
                              </div>
                            </div>

                            {/* Image Upload */}
                            <div>
                              <label className="text-sm font-medium text-gray-700">
                                Image (Optional)
                              </label>
                              <div className="mt-1 border-2 border-dashed border-gray-300 p-4 text-center rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                                <input
                                  type="file"
                                  accept="image/png, image/jpeg"
                                  onChange={(e) => setImage(e.target.files[0])}
                                  className="hidden"
                                  id="file-upload"
                                />
                                <label
                                  htmlFor="file-upload"
                                  className="cursor-pointer block space-y-8"
                                >
                                  <FiUploadCloud className="mx-auto text-3xl text-gray-400" />
                                  <span className="text-xs text-yellow-500">
                                    {" "}
                                    Click to upload
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    or drag and drop
                                  </span>{" "}
                                  <br />
                                  <span className="text-xs text-gray-400">
                                    JPEG/PNG - Recommended 1600x2400px (Max.
                                    10mb)
                                  </span>
                                </label>
                                {image && (
                                  <p className="mt-2 text-sm text-green-600">
                                    {image.name}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Buttons */}
                          <AlertDialogFooter className="mt-6 gap-2">
                            <div className="w-full flex gap-4 justify-between">
                              {/* Cancel button in the main dialog */}
                              <button
                                type="button"
                                onClick={() => {
                                  setCancelDialogOpen(true); // Open cancel confirmation dialog
                                  //   setMainDialogOpen(false); // Close main dialog
                                }}
                                className="border-[1px] cursor-pointer text-gray-700 px-8 py-2 rounded-md"
                              >
                                Cancel
                              </button>
                              <Button
                                onClick={() => handleSubmit(false)}
                                disabled={
                                  statusCreateAnnouncement === "loading" ||
                                  !title ||
                                  !target_users ||
                                  !message
                                }
                                className="disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed flex items-center gap-2 px-8 py-2"
                              >
                                {statusCreateAnnouncement === "loading" ? (
                                  <>
                                    <span className="loader w-4 h-4 border-2 cursor-pointer border-t-transparent rounded-full animate-spin"></span>
                                    Sending...
                                  </>
                                ) : (
                                  "Send"
                                )}
                              </Button>
                            </div>
                          </AlertDialogFooter>
                          <AlertDialog
                            open={isCancelDialogOpen}
                            onOpenChange={setCancelDialogOpen}
                          >
                            <AlertDialogContent className="font-gilroy">
                              <div className="">
                                <div className="flex justify-center items-center">
                                  <div className=" bg-yellow-100 rounded-full p-2 ">
                                    <div className=" bg-yellow-200 rounded-full p-2 ">
                                      <AiOutlineWarning className="text-yellow-500 text-4xl" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <AlertDialogHeader className="w-full flex justify-center items-center">
                                <AlertDialogTitle>
                                  Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-center max-w-sm">
                                  Do you wish to discontinue with the creation
                                  of an announcement?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="mt-6 gap-2">
                                <div className="w-full flex gap-4 justify-between">
                                  {/* Save as Draft: closes both dialogs */}
                                  <AlertDialogCancel
                                    onClick={() => {
                                      handleSubmit(true);
                                      setCancelDialogOpen(false);
                                      setMainDialogOpen(false);
                                    }}
                                    className="py-4 px-6 text-gray-700 cursor-pointer flex items-center gap-2 disabled:opacity-50"
                                    disabled={
                                      statusCreateAnnouncement === "loading"
                                    }
                                  >
                                    {statusCreateAnnouncement === "loading" ? (
                                      <>
                                        <span className="loader w-4 h-4 border-2 cursor-pointer border-t-transparent rounded-full animate-spin" />
                                        Saving...
                                      </>
                                    ) : (
                                      "Save As Draft"
                                    )}
                                  </AlertDialogCancel>

                                  {/* Discontinue: closes both dialogs */}
                                  <AlertDialogAction
                                    onClick={() => {
                                      setCancelDialogOpen(false);
                                      setMainDialogOpen(false);
                                      // Optionally reset form data here
                                    }}
                                    className="bg-black cursor-pointer text-white"
                                  >
                                    Discontinue
                                  </AlertDialogAction>
                                </div>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between my-4 items-center">
                      {/* Right: Search and Filter */}
                      <div className="relative w-[400px]">
                        <Search
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          size={16}
                        />
                        <Input
                          type="text"
                          placeholder="Search ..."
                          className="pl-8 w-full"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <AlertDialog
                        open={isMainDialogOpen}
                        onOpenChange={setMainDialogOpen}
                      >
                        <AlertDialogTrigger asChild>
                          <Button className={` cursor-pointer`}>
                            <FaPlus className="mr-2" /> Create Announcement
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-lg w-full max-h-[90vh] flex flex-col font-gilroy">
                          <AlertDialogHeader className="w-full flex justify-center items-center">
                            <AlertDialogTitle className="text-xl font-bold">
                              Create Announcement
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-sm text-gray-500 text-center">
                              Fill out the form to send an announcement.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <div className="flex-1 overflow-y-auto px-1 space-y-4 pr-3">
                            {/* Title */}
                            <div>
                              <label className="text-sm font-medium text-gray-700">
                                Title*
                              </label>
                              <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="mt-1"
                              />
                            </div>

                            {/* User Type */}
                            <div>
                              <Label className="text-sm font-medium text-gray-700">
                                User Type*
                              </Label>
                              <Select
                                onValueChange={(value) =>
                                  setTarget_users(value)
                                }
                              >
                                <SelectTrigger className="mt-1 w-full">
                                  <SelectValue placeholder="Select user type" />
                                </SelectTrigger>
                                <SelectContent className="font-gilroy">
                                  {roles.map((role) => (
                                    <SelectItem
                                      key={role.id}
                                      value={String(role.id)}
                                    >
                                      {role.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Description with formatting */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">
                                Body*
                              </label>

                              {/* Toolbar */}
                              <div className="flex flex-wrap gap-2 mb-2">
                                {[
                                  { cmd: "bold", label: <b>B</b> },
                                  { cmd: "italic", label: <i>I</i> },
                                  { cmd: "underline", label: <u>U</u> },
                                  { cmd: "strikeThrough", label: <s>S</s> },
                                  { cmd: "insertOrderedList", label: "1." },
                                  { cmd: "insertUnorderedList", label: "•" },
                                  { cmd: "outdent", label: "⬅️" },
                                  { cmd: "indent", label: "➡️" },
                                  { cmd: "justifyLeft", label: "⬅ Align" },
                                  { cmd: "justifyCenter", label: "⬌ Center" },
                                  { cmd: "justifyRight", label: "Align ➡️" },
                                  { cmd: "justifyFull", label: "Justify" },
                                  { cmd: "removeFormat", label: "🚫 Clear" },
                                ].map((btn) => (
                                  <Button
                                    key={btn.cmd}
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      document.execCommand(btn.cmd)
                                    }
                                  >
                                    {btn.label}
                                  </Button>
                                ))}
                              </div>

                              {/* Editable Content */}
                              <div
                                contentEditable
                                style={{ direction: "ltr", textAlign: "left" }}
                                className="min-h-[150px] max-h-[300px] overflow-y-auto p-3 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500 prose whitespace-pre-wrap break-words"
                                onInput={(e) =>
                                  setMessage(e.currentTarget.innerHTML)
                                }
                                // dangerouslySetInnerHTML={{ __html: message }}
                              />
                              <div className="text-xs text-gray-400 text-right">
                                {message?.length}/1000
                              </div>
                            </div>

                            {/* Image Upload */}
                            <div>
                              <label className="text-sm font-medium text-gray-700">
                                Image (Optional)
                              </label>
                              <div className="mt-1 border-2 border-dashed border-gray-300 p-4 text-center rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                                <input
                                  type="file"
                                  accept="image/png, image/jpeg"
                                  onChange={(e) => setImage(e.target.files[0])}
                                  className="hidden"
                                  id="file-upload"
                                />
                                <label
                                  htmlFor="file-upload"
                                  className="cursor-pointer block space-y-8"
                                >
                                  <FiUploadCloud className="mx-auto text-3xl text-gray-400" />
                                  <span className="text-xs text-yellow-500">
                                    {" "}
                                    Click to upload
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    or drag and drop
                                  </span>{" "}
                                  <br />
                                  <span className="text-xs text-gray-400">
                                    JPEG/PNG - Recommended 1600x2400px (Max.
                                    10mb)
                                  </span>
                                </label>
                                {image && (
                                  <p className="mt-2 text-sm text-green-600">
                                    {image.name}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Buttons */}
                          <AlertDialogFooter className="mt-6 gap-2">
                            <div className="w-full flex gap-4 justify-between">
                              {/* Cancel button in the main dialog */}
                              <button
                                type="button"
                                onClick={() => {
                                  setCancelDialogOpen(true); // Open cancel confirmation dialog
                                  //   setMainDialogOpen(false); // Close main dialog
                                }}
                                className="border-[1px] cursor-pointer text-gray-700 px-8 py-2 rounded-md"
                              >
                                Cancel
                              </button>
                              <Button
                                onClick={() => handleSubmit(false)}
                                disabled={
                                  statusCreateAnnouncement === "loading" ||
                                  !title ||
                                  !target_users ||
                                  !message
                                }
                                className="disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed flex items-center gap-2 px-8 py-2"
                              >
                                {statusCreateAnnouncement === "loading" ? (
                                  <>
                                    <span className="loader w-4 h-4 border-2 cursor-pointer border-t-transparent rounded-full animate-spin"></span>
                                    Sending...
                                  </>
                                ) : (
                                  "Send"
                                )}
                              </Button>
                            </div>
                          </AlertDialogFooter>
                          <AlertDialog
                            open={isCancelDialogOpen}
                            onOpenChange={setCancelDialogOpen}
                          >
                            <AlertDialogContent className="font-gilroy">
                              <div className="">
                                <div className="flex justify-center items-center">
                                  <div className=" bg-yellow-100 rounded-full p-2 ">
                                    <div className=" bg-yellow-200 rounded-full p-2 ">
                                      <AiOutlineWarning className="text-yellow-500 text-4xl" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <AlertDialogHeader className="w-full flex justify-center items-center">
                                <AlertDialogTitle>
                                  Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-center max-w-sm">
                                  Do you wish to discontinue with the creation
                                  of an announcement?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="mt-6 gap-2">
                                <div className="w-full flex gap-4 justify-between">
                                  {/* Save as Draft: closes both dialogs */}
                                  <AlertDialogCancel
                                    onClick={() => {
                                      handleSubmit(true);
                                      setCancelDialogOpen(false);
                                      setMainDialogOpen(false);
                                    }}
                                    className="py-4 px-6 text-gray-700 cursor-pointer flex items-center gap-2 disabled:opacity-50"
                                    disabled={
                                      statusCreateAnnouncement === "loading"
                                    }
                                  >
                                    {statusCreateAnnouncement === "loading" ? (
                                      <>
                                        <span className="loader w-4 h-4 border-2 cursor-pointer border-t-transparent rounded-full animate-spin" />
                                        Saving...
                                      </>
                                    ) : (
                                      "Save As Draft"
                                    )}
                                  </AlertDialogCancel>

                                  {/* Discontinue: closes both dialogs */}
                                  <AlertDialogAction
                                    onClick={() => {
                                      setCancelDialogOpen(false);
                                      setMainDialogOpen(false);
                                      // Optionally reset form data here
                                    }}
                                    className="bg-black cursor-pointer text-white"
                                  >
                                    Discontinue
                                  </AlertDialogAction>
                                </div>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>

                    <div>
                      <div className="bg-white border-[1px] rounded-lg w-full p-4 my-2 h-auto shadow-md">
                        <div className="relative overflow-x-auto rounded-t-lg">
                          <TableComponent
                            data={filteredAnnouncements}
                            columns={announcementColumns}
                            showPagination={true}
                            isLoading={statusFetchAnnouncements === "loading"}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="Draft" className="mt-6">
                {drafts.length === 0 ? (
                  <div className="p-4 bg-white ">
                    <div className="flex flex-col items-center justify-center text-center mt-20 space-y-4">
                      <div className="bg-gray-100 rounded-full p-2 inline-block">
                        <div className="bg-gray-200 rounded-full p-2">
                          <TbMail className="text-gray-600 text-2xl" />
                        </div>
                      </div>

                      <h2 className="text-lg font-semibold">
                        There is nothing here yet!
                      </h2>
                      <p className="text-base text-gray-500 max-w-md">
                        You do not have any draft messages here
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex flex-col md:flex-row gap-4  my-4 items-start md:items-center justify-start md:justify-between bg-white">
                      {/* Right: Search and Filter */}
                      <div className="flex flex-col-reverse md:flex-row items-start md:items-center gap-2 w-[400px] max-w-full">
                        <div className="relative w-[400px]">
                          <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            size={16}
                          />
                          <Input
                            type="text"
                            placeholder="Search ..."
                            className="pl-8 w-full"
                            value={searchDraftQuery}
                            onChange={(e) =>
                              setSearchDraftQuery(e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="bg-white border-[1px] rounded-lg w-full p-4 h-auto shadow-md">
                        <div className="relative overflow-x-auto rounded-t-lg">
                          <TableComponent
                            data={filteredDraft}
                            columns={draftColumns}
                            showPagination={true}
                            isLoading={statusFetchDrafts === "loading"}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default Announcements;
