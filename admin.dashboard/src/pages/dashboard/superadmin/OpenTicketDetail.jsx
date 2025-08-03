import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import {
  acceptTicket,
  closeTicket,
  fetchTicketById,
  replyTicket,
} from "@/redux/slices/supportTicketSlice";
import AdminLayout from "./DashboardLayout";
import { fetchAllRoles } from "@/redux/slices/usersSlice";

const categoryColors = {
  1: "bg-yellow-100 text-yellow-800",
  2: "bg-red-100 text-red-800",
  3: "bg-blue-100 text-blue-800",
  4: "bg-purple-100 text-purple-800",
  5: "bg-green-100 text-green-800",
};

const roleColors = {
  author: "bg-yellow-100 text-yellow-800",
  user: "bg-purple-100 text-purple-800",
  admin: "bg-gray-200 text-gray-800",
  "super admin": "bg-blue-100 text-blue-800",
};

const OpenTicketDetail = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [content, setContent] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  useEffect(() => {
    dispatch(fetchTicketById(id));
    dispatch(fetchAllRoles());
  }, [id, dispatch]);

  const { roles } = useSelector((state) => state.users);

  const {
    ticketDetail,
    statusFetchTicketById,
    error,
    statusReplyTicket,
    statusCloseTicket,
  } = useSelector((state) => state.supportTicket);

  const currentUserId = useSelector((state) => state.auth?.user?.id);

  const handleBack = () => {
    if (location.state?.from === "ticket-tab") {
      navigate("/support?tab=openticket");
    } else {
      navigate(-1);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const formData = new FormData();
      formData.append("content", content);

      const response = await dispatch(replyTicket({ id, formData })).unwrap();
      dispatch(fetchTicketById(id));
      toast.success(response.message);
      setContent("");
    } catch (error) {
      let errorMessage = "Failed to send reply. Try again.";
      if (typeof error === "string") {
        errorMessage = error;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    }
  };

  const handleAcceptTicket = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) {
      toast.error("User ID not found in localStorage");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("admin_id", user.id);

      const response = await dispatch(acceptTicket({ id, formData })).unwrap();
      dispatch(fetchTicketById(id));
      toast.success(response?.message);
    } catch (error) {
      toast.error(
        typeof error === "string" ? error : "Failed to accept ticket"
      );
    }
  };

  const handleCloseTicket = async () => {
    try {
      const response = await dispatch(closeTicket(id)).unwrap();
      dispatch(fetchTicketById(id));
      toast.success(response?.message);
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Failed to close ticket");
    }
  };

  return (
    <AdminLayout
      header={
        <div className="flex flex-col px-2 mt-20 md:mt-0 justify-start items-start w-full">
          <h2 className="text-xl font-semibold text-gray-800">
            Open Ticket Details
          </h2>
        </div>
      }
    >
      <div className="md:my-6 my-4 gap-6 md:mt-10">
        <div className="flex justify-start border-b-2 items-center mb-6">
          <Button
            onClick={handleBack}
            variant="outline"
            className="mb-6 text-sm text-gray-600 cursor-pointer hover:text-yellow-500"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {statusFetchTicketById === "loading" ? (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Sidebar (skeleton) */}
            <div className="md:w-1/3 border rounded-lg p-4 bg-white space-y-5">
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Right Ticket View (skeleton) */}
            <div className="md:w-2/3 space-y-8">
              <div className="w-full space-y-6 animate-pulse">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-48 w-64 rounded-md" />
                </div>
                <div className="space-y-6">
                  {[...Array(2)].map((_, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-3 w-1/3" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-11/12" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-24 w-full rounded-md" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Sidebar */}
            <div className="md:w-1/3 border rounded-lg p-4 bg-white space-y-5">
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Right Ticket View */}
            <div className="md:w-2/3 space-y-8">
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                <div className="space-y-4">
                  <h1 className="text-xl font-semibold flex flex-col gap-2">
                    {ticketDetail?.subject}
                    {ticketDetail?.categories?.id && (
                      <Badge
                        className={`text-sm font-semibold ${
                          categoryColors[ticketDetail.categories.id] ||
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {ticketDetail.categories.name}
                      </Badge>
                    )}
                  </h1>
                  <p className="text-base text-muted-foreground">
                    {ticketDetail?.support_id}
                  </p>
                  {ticketDetail?.created_at && (
                    <p className="text-sm text-muted-foreground">
                      Created on{" "}
                      {new Date(ticketDetail.created_at).toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="flex items-start mr-12 gap-2">
                  {ticketDetail?.status && (
                    <Badge
                      variant="outline"
                      className={`text-sm font-semibold capitalize ${
                        ticketDetail.status === "open"
                          ? "bg-green-100 text-green-700"
                          : ticketDetail.status === "in_progress"
                          ? "bg-yellow-100 text-yellow-700"
                          : ticketDetail.status === "resolved"
                          ? "bg-blue-100 text-blue-700"
                          : ticketDetail.status === "closed"
                          ? "bg-gray-200 text-gray-700"
                          : "bg-muted"
                      }`}
                    >
                      {ticketDetail.status}
                    </Badge>
                  )}

                  {ticketDetail?.status === "open" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          className="ml-2 bg-yellow-500 hover:bg-yellow-600 text-white"
                        >
                          Accept Ticket
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Accept this ticket?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            You will be assigned to this support ticket.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleAcceptTicket}>
                            Confirm
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}

                  {["open", "in_progress", "resolved"].includes(
                    ticketDetail?.status
                  ) && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          className="ml-2 bg-red-500 hover:bg-red-600 text-white"
                          disabled={statusCloseTicket === "loading"}
                        >
                          {statusCloseTicket === "loading"
                            ? "Closing..."
                            : "Close Ticket"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Close this ticket?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This will mark the ticket as closed. You won't be
                            able to reopen it later.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            disabled={statusCloseTicket === "loading"}
                          >
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleCloseTicket}
                            disabled={statusCloseTicket === "loading"}
                          >
                            {statusCloseTicket === "loading"
                              ? "Closing..."
                              : "Confirm"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>

              {ticketDetail?.description && (
                <div>
                  <h2 className="font-semibold mb-2">Description</h2>
                  <p className="text-sm whitespace-pre-line text-gray-800">
                    {ticketDetail.description}
                  </p>
                </div>
              )}

              {ticketDetail?.image && (
                <div>
                  <h2 className="font-semibold mb-2">Attached Image</h2>
                  <img
                    src={`https://test.amber-hive.com/storage/${ticketDetail.image}`}
                    alt="Ticket Attachment"
                    className="max-w-xs rounded-md shadow"
                  />
                </div>
              )}

              {ticketDetail?.replies.map((msg, i) => {
                const name = msg.user?.name || "Unknown";
                const initials = name
                  .split(" ")
                  .map((n) => n[0])
                  .join("");

                const isYou = msg.user?.id === currentUserId;

                // Get role name and style
                const userRole = roles.find((r) => r.id === msg.user?.role_id);
                const roleName = userRole?.name?.toLowerCase(); // fallback
                const roleColor = roleColors[roleName] || "";

                return (
                  <div key={i} className="flex gap-4">
                    <Avatar>
                      <AvatarImage src={msg.user?.avatar || ""} />
                      <AvatarFallback className="font-[600]">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold">{name}</span>

                        {/* Role Badge */}
                        <Badge
                          className={`capitalize font-semibold ${roleColor}`}
                        >
                          {roleName}
                        </Badge>

                        {/* You Badge */}
                        {isYou && (
                          <Badge className="bg-blue-100 text-blue-800 font-[600] ml-1">
                            You
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(msg.created_at).toLocaleString()}
                      </div>
                      <div className="text-sm whitespace-pre-line">
                        {msg.content}
                      </div>
                    </div>
                  </div>
                );
              })}

              {ticketDetail?.status === "closed" ? (
                ""
              ) : (
                <form
                  onSubmit={handleSendReply}
                  className="pt-4 border-t space-y-2"
                >
                  <h4 className="text-sm font-medium">Reply</h4>
                  <Textarea
                    placeholder="Type your reply..."
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="md:w-[500px] resize-none"
                  />
                  <div>
                    <Button
                      size="sm"
                      className="mt-2"
                      type="submit"
                      disabled={
                        !content.trim() || statusReplyTicket === "loading"
                      }
                    >
                      {statusReplyTicket === "loading"
                        ? "Sending..."
                        : "Send Reply"}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default OpenTicketDetail;
