import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import Layout from "@/components/shared/Layout";
import { BiMessageRoundedDots } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { fetchBookById } from "@/redux/slices/bookSlice";
import { formatDate } from "@/utils/format";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const getStatusBadge = (status) => {
  const statusMap = {
    approved: "text-green-600 bg-green-100",
    draft: "text-gray-500 bg-gray-100",
    pending: "text-yellow-600 bg-yellow-100",
    declined: "text-red-500 bg-red-100",
    published: "text-green-600 bg-green-100",
  };

  return (
    <Badge
      className={`w-fit font-semibold ${
        statusMap[status] || "bg-gray-200 text-gray-600"
      }`}
    >
      {status}
    </Badge>
  );
};

const ViewBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { bookDetail, statusBookDetail, error } = useSelector(
    (state) => state.books
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchBookById(id));
    }
  }, [dispatch, id]);

  // ✅ Safely normalize tags
  const tags = useMemo(() => {
    const raw = bookDetail?.tags;

    if (Array.isArray(raw)) return raw;
    if (typeof raw === "string") {
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return [raw]; // fallback: single tag from string
      }
    }

    return [];
  }, [bookDetail?.tags]);

  const header = (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
    </div>
  );

  return (
    <Layout header={header}>
      {statusBookDetail === "loading" ? (
        <div className="flex items-start gap-8">
          {/* Skeleton for image */}
          <div className="w-4/12 flex justify-center">
            <Skeleton className="w-full max-w-xs h-[350px] rounded-lg" />
          </div>

          {/* Skeleton for book details */}
          <div className="w-8/12 space-y-4">
            <Skeleton className="h-8 w-3/4" /> {/* Title */}
            <Skeleton className="h-6 w-1/4" /> {/* Price */}
            <Skeleton className="h-4 w-1/2" /> {/* Status */}
            <Skeleton className="h-20 w-full" /> {/* Description */}
            {/* Meta skeletons */}
            <div className="space-y-4 mt-6 text-sm">
              {Array.from({ length: 5 }).map((_, i) => (
                <div className="grid grid-cols-2 gap-2" key={i}>
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
            {/* Download button skeleton */}
            <Skeleton className="h-10 w-32 mt-4" />
          </div>
        </div>
      ) : statusBookDetail === "failed" ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <p className="text-red-500 text-sm">
            {error || "Failed to load book"}
          </p>
        </div>
      ) : (
        <>
          {/* Main Book View */}
          <div className="flex items-start gap-8">
            {/* Image */}
            <div className="flex justify-center w-4/12">
              <img
                src={`https://test.amber-hive.com/storage/${bookDetail?.cover_image}`}
                alt={bookDetail?.title}
                className="w-full max-w-xs rounded-lg shadow-md object-cover"
              />
            </div>

            {/* Book Info */}

            <div className="w-8/12 space-y-4">
              <div className="flex items-center gap-4">
                <h2 className="text-3xl font-bold">{bookDetail?.title}</h2>
                <p className="text-xl font-semibold text-red-600">
                  {bookDetail?.discount_price || bookDetail?.price ? (
                    <>
                      {bookDetail?.currency?.toLowerCase() === "ngn"
                        ? "₦"
                        : bookDetail?.currency?.toLowerCase() === "usd"
                        ? "$"
                        : ""}
                      {bookDetail?.discount_price || bookDetail?.price}
                    </>
                  ) : (
                    <span className="text-gray-500 italic text-base">N/A</span>
                  )}
                </p>
              </div>

              {bookDetail?.discount && bookDetail?.price ? (
                <p className="text-sm ">
                  <span className="line-through">
                    {bookDetail?.currency?.toLowerCase() === "ngn"
                      ? "₦"
                      : bookDetail?.currency?.toLowerCase() === "usd"
                      ? "$"
                      : ""}
                    {bookDetail?.price}
                  </span>{" "}
                  <span className="text-green-600 font-medium">
                    -{bookDetail.discount}% Off
                  </span>
                </p>
              ) : (
                <p className="text-sm italic text-gray-400">
                  No discount available
                </p>
              )}

              {bookDetail?.subtitle && (
                <p className="text-gray-500 italic">{bookDetail.subtitle}</p>
              )}

              {getStatusBadge(bookDetail?.status)}

              <div
                className="text-gray-700 whitespace-pre-wrap prose"
                dangerouslySetInnerHTML={{
                  __html: bookDetail?.description || "",
                }}
              />

              {/* Meta Details */}
              <div className="space-y-4 mt-6 text-sm">
                {[
                  {
                    label: "Date Created",
                    value: formatDate(bookDetail?.created_at),
                  },
                  { label: "Duration", value: bookDetail?.duration },
                  {
                    label: "Approval Status",
                    value: bookDetail?.approval_status,
                  },
                  { label: "Copyright", value: bookDetail?.copyright },
                  { label: "Language", value: bookDetail?.language },
                  { label: "License", value: bookDetail?.license },
                  { label: "ISBN", value: bookDetail?.isbn },
                  { label: "Protection", value: bookDetail?.protection },
                  {
                    label: "Published At",
                    value: bookDetail?.published_at
                      ? formatDate(bookDetail.published_at)
                      : null,
                  },
                  {
                    label: "Rejected At",
                    value: bookDetail?.rejected_at
                      ? formatDate(bookDetail.rejected_at)
                      : null,
                  },
                  { label: "Rejected By", value: bookDetail?.rejected_by },
                  {
                    label: "Rejection Reason",
                    value: bookDetail?.rejection_reason,
                  },
                ]
                  .filter((item) => item.value) // ✅ Only keep fields with non-empty values
                  .map((item, idx) => (
                    <div key={idx} className="grid grid-cols-2">
                      <p className="font-bold text-xs text-black uppercase">
                        {item.label}
                      </p>
                      <p className="text-black">{item.value}</p>
                    </div>
                  ))}

                {/* Tags */}
                {tags.filter(Boolean).length > 0 && (
                  <div className="grid grid-cols-2">
                    <p className="font-bold text-xs text-black uppercase">
                      Tags
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {tags.filter(Boolean).map((tag, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="capitalize"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="my-8" />

          {/* Reviews */}

          <div className="space-y-4 my-8">
            <h3 className="text-base font-semibold">
              Reviews ({bookDetail?.reviews?.length || 0})
            </h3>

            {bookDetail?.reviews?.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-gray-500 py-12">
                <div className="flex items-center justify-center bg-gray-100 p-2 rounded-full">
                  <div className="flex items-center justify-center bg-gray-200 p-2 rounded-full">
                    <BiMessageRoundedDots className="text-gray-600 text-xl" />
                  </div>
                </div>
                <p className="mt-2 text-sm">No reviews yet</p>
              </div>
            ) : (
              <div className="space-y-4 max-w-2xl">
                {bookDetail?.reviews?.map((review) => (
                  <div key={review.id} className=" p-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-semibold">
                        {review?.user?.name || "Anonymous"}
                      </p>
                      <span className="text-sm text-gray-500">
                        {formatDate(review?.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">
                      {review?.comment}
                    </p>
                    <div className="text-yellow-500 text-base">
                      {"★".repeat(review.rating)}{" "}
                      {"☆".repeat(5 - review.rating)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </Layout>
  );
};

export default ViewBook;
