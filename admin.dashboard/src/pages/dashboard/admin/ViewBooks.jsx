import { Link, useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, X } from "lucide-react";
import { getStatusBadge } from "@/utils/StatusBadge";
import { book } from "@/utils/data";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { BsCheckCircle, BsExclamationCircle } from "react-icons/bs";
import AdminLayout from "./DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  approveBook,
  fetchBookById,
  fetchFeaturedBooks,
  rejectBook,
  toggleFeatureBook,
} from "@/redux/slices/bookApprovalSlice";
import { FaSpinner } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";
import ReaderEpub from "@/components/ReaderEpub";
import { formatDate } from "@/utils/format";

const ViewBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isRejecting, setIsRejecting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [commentError, setCommentError] = useState(false);
  const [comment, setComment] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const maxLength = 1000;

  const dispatch = useDispatch();
  const { bookDetail, statusBookDetail, error, statusToggleFeature } =
    useSelector((state) => state.bookApproval);
  const book = bookDetail?.book;

  // console.log(book)

  const isEpub = book?.toLowerCase().endsWith(".epub");

  useEffect(() => {
    if (id) {
      dispatch(fetchBookById(id));
    }
  }, [dispatch, id]);

  const handleAddFeaturedBook = async () => {
    if (!bookDetail?.id) return;

    try {
      const id = bookDetail.id;

      // unwrap returns the resolved payload
      const response = await dispatch(toggleFeatureBook(id)).unwrap();

      dispatch(fetchFeaturedBooks());
      setIsDialogOpen(false);
      // Use the actual message from the backend response
      toast.success(response.message);
    } catch (err) {
      // Display the actual error message from the rejected payload
      toast.error(err?.message || err || "An error occurred");
    }
  };

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const res = await dispatch(approveBook(id)).unwrap();
      toast.success(res.message);
      setShowApproveDialog(false);
      navigate(-1); // navigate back
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Failed to approve book.");
      console.error(err);
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!comment.trim()) {
      setCommentError("Comment is required."); // set a message instead of `true`
      toast.error("Comment required. Please provide a reason for rejection.");
      return;
    }

    setIsRejecting(true);
    try {
      const res = await dispatch(
        rejectBook({ id, rejection_reason: comment })
      ).unwrap(); // send the comment itself, not the error

      toast.success(res.message);
      setShowRejectDialog(false);
      navigate(-1);
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Failed to reject book.");
      console.error(err);
    } finally {
      setIsRejecting(false);
    }
  };

  const renderRow = (label, value, hint) => (
    <div className="space-y-1">
      <p className="text-xs font-semibold text-gray-500 uppercase">{label}</p>
      <p className="text-sm text-black">{value}</p>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );

  return (
    <AdminLayout
      header={
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      }
    >
      {statusBookDetail === "loading" && (
        <div className="flex md:flex-row md:mt-8 flex-col gap-12 animate-pulse">
          {/* Skeleton Left: Image */}
          <div className="md:w-1/3 p-2 flex flex-col items-center">
            <Skeleton className="w-52 h-72 rounded-md" />
            <Skeleton className="w-32 h-4 mt-2" />
          </div>

          {/* Skeleton Right: Text blocks */}
          <div className="md:w-2/3 p-2 px-4 md:px-12 space-y-6">
            <Skeleton className="w-24 h-5" />
            <Skeleton className="w-3/4 h-6" />
            <Skeleton className="w-1/2 h-5" />
            <div className="flex gap-2 flex-wrap">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="w-16 h-6 rounded-full" />
              ))}
            </div>
            <Skeleton className="w-full h-20" />
            <Skeleton className="w-1/3 h-5" />
            <Skeleton className="w-1/4 h-5" />
            <Skeleton className="w-1/5 h-5" />
            <Skeleton className="w-32 h-5" />
            <Skeleton className="w-1/3 h-5" />

            {/* Comment box */}
            <div className="space-y-2">
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-full h-24" />
            </div>

            {/* Buttons */}
            <div className="flex md:flex-row flex-col gap-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      )}

      {statusBookDetail === "succeeded" && bookDetail && (
        <div className="flex md:flex-row md:mt-8 flex-col gap-12">
          {/* Left: Book Image */}

          <div className="md:w-1/3 p-2 flex flex-col items-center">
            {bookDetail?.cover_image ? (
              <>
                <img
                  src={`https://test.amber-hive.com/storage/${bookDetail.cover_image}`}
                  alt={bookDetail?.title}
                  className="w-52 h-auto rounded-md border shadow-md"
                />
                <p className="text-center text-sm mt-2 text-muted-foreground">
                  Cover image in eBook
                </p>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="mt-4 w-36">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Read Book
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent
                    className="relative flex flex-col overflow-hidden"
                    style={{
                      //
                      position: "fixed",
                      width: "98vw", // Nearly full viewport width
                      maxWidth: "none", // Remove any maximum width restriction
                      height: "95vh", // Nearly full viewport height
                      margin: 0,
                      padding: 0,
                      borderRadius: "0.5rem",
                    }}
                  >
                    {/* Close Button */}
                    <AlertDialogCancel
                      className="absolute right-4 top-4 p-1 rounded-md hover:bg-muted"
                      aria-label="Close"
                    >
                      <X className="h-5 w-5" />
                    </AlertDialogCancel>

                    <AlertDialogHeader className="pb-2 p-6">
                      <AlertDialogTitle>{bookDetail.title}</AlertDialogTitle>
                      <AlertDialogDescription></AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="flex-1 mt-4 overflow-hidden rounded border">
                      {statusBookDetail === "succeeded" ? (
                        isEpub && book ? (
                          <ReaderEpub url={book} />
                        ) : (
                          <div className="h-full flex items-center justify-center text-center px-4">
                            <p className="text-gray-600 text-lg font-medium">
                              This book is not in EPUB format and cannot be
                              viewed in the reader.
                            </p>
                          </div>
                        )
                      ) : (
                        <p className="text-center text-muted-foreground mt-4">
                          Loading book...
                        </p>
                      )}
                    </div>
                  </AlertDialogContent>
                </AlertDialog>

                {/* Add Featured Book Button */}
                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="secondary"
                      className="mt-2 w-36 border cursor-pointer border-yellow-500 text-yellow-600"
                    >
                      Add Featured Book
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent className="max-w-sm">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Do you want to mark this book as featured?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex justify-end gap-2">
                      <Button variant="outline" asChild>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                      </Button>
                      <Button
                        className="cursor-pointer"
                        onClick={handleAddFeaturedBook}
                        disabled={statusToggleFeature === "loading"}
                      >
                        {statusToggleFeature === "loading"
                          ? "Submitting..."
                          : "Confirm"}
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : (
              <div className="w-52 h-72 flex items-center justify-center border rounded-md shadow-md">
                <p className="text-center text-sm text-muted-foreground italic">
                  No cover image available
                </p>
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="md:w-2/3 p-2 px-4 md:px-12">
            <div className="space-y-8 pb-6 text-base text-gray-200">
              {bookDetail?.approval_status !== "approved" && (
                <p className="text-sm font-medium">
                  {getStatusBadge(bookDetail?.approval_status)}
                </p>
              )}

              {renderRow(
                "Book Title",
                <p className="text-base font-medium text-gray-800">
                  {bookDetail?.title}
                </p>
              )}

              {renderRow(
                "Subtitle",
                <p className="text-base italic text-gray-600">
                  {bookDetail?.subtitle || "-"}
                </p>
              )}

              {renderRow(
                "Tags",
                <div className="flex gap-2 flex-wrap">
                  {(typeof bookDetail?.tags === "string"
                    ? JSON.parse(bookDetail.tags)
                    : bookDetail?.tags || []
                  ).map((tag, i) => (
                    <span
                      key={i}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {renderRow(
                "Book Description",
                <div
                  className="text-sm text-gray-700 prose"
                  dangerouslySetInnerHTML={{
                    __html:
                      bookDetail?.description || "No description available.",
                  }}
                />
              )}

              {renderRow("Language", <p>{bookDetail?.language || "-"}</p>)}

              {renderRow(
                "Copyright Ownership",
                <p>{bookDetail?.copyright || "-"}</p>
              )}

              {renderRow(
                "Price",
                <p className="text-green-700 font-medium">
                  {bookDetail?.currency?.toUpperCase() === "NGN" ? "₦" : "$"}
                  {bookDetail?.price}
                </p>
              )}

              {renderRow(
                "Discount",
                <p className="text-red-500">{bookDetail?.discount || 0}%</p>
              )}

              {renderRow(
                "Discount Price",
                <p className="text-green-600 font-semibold">
                  {bookDetail?.currency?.toUpperCase() === "NGN" ? "₦" : "$"}
                  {bookDetail?.discount_price || 0}
                </p>
              )}

              {renderRow(
                "Currency",
                <p>{bookDetail?.currency?.toUpperCase()}</p>
              )}

              {renderRow(
                "Duration",
                <p className="text-sm">{bookDetail?.duration}</p>
              )}

              {bookDetail?.approval_status !== "approved" &&
                renderRow(
                  "Rejection Reason",
                  <p className="text-sm text-red-600">
                    {bookDetail?.rejection_reason || "No reason provided"}
                  </p>
                )}

              {/* Comment Box */}
              {bookDetail?.approval_status !== "approved" && (
                <div className="mt-4 space-y-2 text-gray-900">
                  <Label htmlFor="comment" className="text-sm font-medium">
                    Comment
                  </Label>

                  <Textarea
                    id="comment"
                    rows={4}
                    maxLength={maxLength}
                    value={comment}
                    onChange={(e) => {
                      const val = e.target.value;
                      setComment(val);

                      // Clear error when value becomes valid
                      if (commentError && val.trim()) {
                        setCommentError(""); // Clear error message
                      }
                    }}
                    placeholder="Write here"
                    className={`min-h-[100px] ${
                      commentError ? "border-red-500 ring-1 ring-red-500" : ""
                    }`}
                  />

                  {/* Character Count */}
                  <p className="text-base text-left">
                    {comment.length}/{maxLength}
                  </p>

                  {/* Error Message */}
                  {commentError && (
                    <p className="text-sm text-red-500 font-medium">
                      {commentError}
                    </p>
                  )}
                </div>
              )}

              {/* Buttons */}
              {bookDetail?.approval_status !== "approved" && (
                <div className="flex md:flex-row flex-col gap-3 mt-4">
                  <AlertDialog
                    open={showRejectDialog}
                    onOpenChange={setShowRejectDialog}
                  >
                    <AlertDialogTrigger>
                      <Button
                        className="bg-[#FF5C02] w-full hover:bg-[#FF5C02] text-white disabled:opacity-50"
                        onClick={() => setShowRejectDialog(true)}
                        disabled={isRejecting || isApproving}
                      >
                        {isRejecting ? "Rejecting..." : "Reject"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="font-gilroy">
                      <div className="flex justify-center items-center mt-2 ">
                        <div className="p-2 bg-red-100 rounded-full">
                          <div className="p-2 bg-red-200 rounded-full">
                            <BsExclamationCircle className="text-red-500 text-lg" />
                          </div>
                        </div>
                      </div>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex justify-center items-center">
                          <h1>Confirm Rejection</h1>
                        </AlertDialogTitle>
                        <AlertDialogDescription className="flex justify-center items-center">
                          <p className="text-center">
                            Please confirm if you want to continue rejection of
                            the book
                            <span className="font-semibold">
                              {" "}
                              {bookDetail?.title}
                            </span>
                            .
                          </p>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <div className="w-full flex gap-12 justify-center items-center">
                          <AlertDialogCancel
                            onClick={() => setShowRejectDialog(false)}
                            className="px-4 py-5"
                          >
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleReject}
                            className="px-4 py-5 bg-[#FF5C02] hover:bg-[#FF5C02] text-white"
                          >
                            Reject
                          </AlertDialogAction>
                        </div>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog
                    open={showApproveDialog}
                    onOpenChange={setShowApproveDialog}
                  >
                    <AlertDialogTrigger>
                      <Button
                        className="bg-[#1FC16B] w-full hover:bg-[#1FC16B] text-white disabled:opacity-50"
                        onClick={() => setShowApproveDialog(true)}
                        disabled={isRejecting || isApproving}
                      >
                        {isApproving ? "Approving..." : "Approve"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="font-gilroy">
                      <div className="flex justify-center items-center mt-2">
                        <div className="p-2 bg-green-100 rounded-full">
                          <div className="p-2 bg-green-200 rounded-full">
                            <BsCheckCircle className="text-green-600 text-lg" />
                          </div>
                        </div>
                      </div>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex justify-center items-center">
                          <h1>Confirm Approval</h1>
                        </AlertDialogTitle>
                        <AlertDialogDescription className="flex justify-center items-center">
                          <p className="text-center">
                            Please confirm if you want to approve the book
                            <span className="font-semibold">
                              {" "}
                              {bookDetail?.title}
                            </span>
                            .
                          </p>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <div className="w-full flex gap-12 justify-center items-center">
                          <AlertDialogCancel
                            onClick={() => setShowApproveDialog(false)}
                            className="px-4 py-5"
                          >
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleApprove}
                            className="px-4 py-5 bg-[#1FC16B] hover:bg-[#1FC16B] text-white"
                          >
                            Approve
                          </AlertDialogAction>
                        </div>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {statusBookDetail === "failed" && (
        <p className="text-center text-red-500 py-10">
          Failed to load book details.
        </p>
      )}
    </AdminLayout>
  );
};

export default ViewBook;
