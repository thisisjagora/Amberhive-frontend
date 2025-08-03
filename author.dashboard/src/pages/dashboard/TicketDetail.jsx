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
import { fetchTicketById, replyTicket } from "@/redux/slices/ticketSlice";
import Layout from "@/components/shared/Layout";

const categoryColors = {
  1: "bg-yellow-100 text-yellow-800",
  2: "bg-red-100 text-red-800",
  3: "bg-blue-100 text-blue-800",
  4: "bg-purple-100 text-purple-800",
  5: "bg-green-100 text-green-800",
};

export function TicketDetail() {
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTicketById(id));
  }, [id, dispatch]);

  const { ticketDetail, statusTicketDetail, error, statusReplyTicket } =
    useSelector((state) => state.tickets);

  const currentUserId = useSelector((state) => state.auth?.user?.id);

  const [content, setContent] = useState("");

  const handleBack = () => {
    if (location.state?.from === "tickets-tab") {
      navigate("/dashboard/support?tab=tickets");
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

      // Assuming `id` is your ticket ID
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

  return (
    <Layout
      header={
        <div className="flex flex-col px-2 mt-20 md:mt-0  justify-start items-start w-full">
          <h2 className="text-xl font-semibold text-gray-800">Ticket Detail</h2>
        </div>
      }
    >
      <div className=" p-6 gap-6 mt-2">
        <div className="flex justify-start border-b-2  items-center mb-6">
          <Button
            onClick={handleBack}
            variant="outline"
            className="mb-6 text-sm text-gray-600 cursor-pointer hover:text-yellow-500"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
        {/* Left Sidebar */}

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3 border rounded-lg p-4 bg-white space-y-5">
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* <div className="border rounded-md overflow-hidden">
          <div className="grid grid-cols-2 text-xs p-3 font-medium border-b bg-muted/40">
            <span>Ticket ID</span>
            <span>Title</span>
          </div>
          {tickets.map((ticket, i) => (
            <div
              key={i}
              className={`grid grid-cols-2 items-center px-3 py-2 text-sm ${
                i === 0 ? "bg-muted" : "hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center gap-2">
                <Checkbox checked={i === 0} />
                <span>{ticket.id}</span>
              </div>
              <span>{ticket.title}</span>
            </div>
          ))}
        </div> */}

            {/* <div className="flex justify-between text-sm text-muted-foreground px-1 pt-2">
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange("prev")}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange("next")}
            >
              Next
            </Button>
          </div>
        </div> */}
          </div>

          {/* Right Ticket View */}
          <div className="md:w-2/3 space-y-8">
            {statusTicketDetail === "loading" ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-20 w-full rounded-md" />
                <Skeleton className="h-48 w-full rounded-md" />
                {[...Array(3)].map((_, idx) => (
                  <div key={idx} className="flex gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/4" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="space-y-4">
                    <h1 className="text-xl font-semibold flex flex-col md:flex-row md:items-center gap-2">
                      {ticketDetail?.subject}
                      {ticketDetail?.categories?.id && (
                        <Badge
                          className={`text-xs ${
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
                      <p className="text-sm  mt-2">
                        Created on{" "}
                        {new Date(ticketDetail.created_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                    <div>
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
                </div>
                </div>

                {/* Description */}
                <div>
                  <h2 className="font-semibold mb-2">Description</h2>
                  <p className="text-sm whitespace-pre-line text-gray-800">
                    {ticketDetail?.description}
                  </p>
                </div>

                {/* Image (if exists) */}
                {ticketDetail?.image && (
                  <div>
                    <h2 className="font-semibold mb-2">Attached Image</h2>
                    <img
                      src={`https://test.amber-hive.com/storage/${ticketDetail?.image}`}
                      alt="Ticket Attachment"
                      className="max-w-xs rounded-md shadow"
                    />
                  </div>
                )}

                {/* Replies */}
                {ticketDetail?.replies?.length > 0 && (
                  <div className="space-y-6">
                    {ticketDetail.replies.map((msg, i) => {
                      const name = msg.user?.name || "Unknown";
                      const initials = name
                        .split(" ")
                        .map((n) => n[0])
                        .join("");
                      const isYou = msg.user?.id === currentUserId;
                      const isSupportAgent = msg.user?.role_id === 2;

                      return (
                        <div key={i} className="flex gap-4">
                          <Avatar>
                            <AvatarImage src={msg.user?.avatar || ""} />
                            <AvatarFallback>{initials}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-medium">{name}</span>
                              {isSupportAgent && (
                                <Badge
                                  variant="outline"
                                  className="text-green-600"
                                >
                                  Support Agent
                                </Badge>
                              )}
                              {isYou && (
                                <span className="text-muted-foreground ml-1">
                                  (You)
                                </span>
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
                  </div>
                )}

                {/* Reply Form */}

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
                    <div className="flex">
                      <Button
                        size="sm"
                        className="mt-2 cursor-pointer"
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
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
