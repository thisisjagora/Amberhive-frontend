import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Check, Copy, Loader2, ShoppingCart } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/format";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBestSellers,
  fetchBookById,
  fetchBooks,
  fetchFeaturedBooks,
} from "@/store/slice/bookSlice";
import { fetchFavorites, toggleFavorite } from "@/store/slice/favoritesSlice";
import { addToCart, fetchCarts } from "@/store/slice/cartSlice";
import { FaHeart, FaStar, FaUserCircle } from "react-icons/fa";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { submitReview } from "@/store/slice/reviewSlice";
import { Skeleton } from "@/components/ui/skeleton";

export default function BookDetails() {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [addedToFavorites, setAddedToFavorites] = useState(false);

  const { slug } = useParams();
  const dispatch = useDispatch();

  const {
    books,
    bestSellers,
    newReleases,
    featuredBooks,
    bookDetail,
    statusBookDetail,
    error,
  } = useSelector((state) => state.books);

  useEffect(() => {
    // If books aren't loaded, fetch them
    if (statusBookDetail === "idle" || books.length === 0) {
      dispatch(fetchBooks());
      dispatch(fetchBestSellers());
      dispatch(fetchBestSellers());
      dispatch(fetchFeaturedBooks());
    }
  }, [dispatch, statusBookDetail, books.length]);

  useEffect(() => {
    if (slug) {
      const allBooks = [
        ...books,
        ...bestSellers,
        ...newReleases,
        ...featuredBooks,
      ];
      const foundBook = allBooks.find((book) => book.slug === slug);

      if (foundBook) {
        dispatch(fetchBookById(foundBook.id));
      }
    }
  }, [books, slug, dispatch, navigate]);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUser(parsed);
      } catch (err) {
        console.error("Invalid user data in localStorage:", err);
      }
    }
  }, []);

  const statusSubmitRe = useSelector((state) => state.reviews);

  const { statusAddToCart } = useSelector((state) => state.carts);
  const { statusFavorite } = useSelector((state) => state.favorites);

  const userAlreadyReviewed = bookDetail?.book?.reviews?.some(
    (review) => review.user_id === user?.id
  );

  const handleAddToCart = async () => {
    if (!user) {
      toast.warning("You have to login first.");
      navigate("/sign-in");
      return;
    }

    const res = await dispatch(
      addToCart({ book_id: bookDetail.book.id, quantity })
    );

    if (addToCart.fulfilled.match(res)) {
      toast.success(res.payload?.message || "Book added to cart");
      dispatch(fetchCarts());
      setAddedToCart(true); // ✅ update success state
    } else if (addToCart.rejected.match(res)) {
      const errorMessage = res.payload?.message || "Failed to add to cart";
      toast.error(errorMessage);
    } else {
      toast.error("Something unexpected happened.");
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      toast.warning("You have to login first.");
      navigate("/sign-in");
      return;
    }

    try {
      const resultAction = await dispatch(toggleFavorite(bookDetail.book.id));

      if (toggleFavorite.fulfilled.match(resultAction)) {
        dispatch(fetchFavorites());
        toast.success(resultAction.payload?.message || "Added to favorites!");

        // Ensure it's marked as added only if it was not already in the list
        setAddedToFavorites(true); // You can enhance this logic further if needed
      } else {
        toast.error(resultAction.payload || "Failed to add to favorites");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      toast.warning("You have to login first.");
      navigate("/sign-in");
      return;
    }

    if (!rating || !comment.trim()) {
      toast.warning("Please provide both rating and comment.");
      return;
    }

    const formData = new FormData();
    formData.append("rating", rating);
    formData.append("comment", comment);

    try {
      const id = bookDetail?.book?.id;
      const resultAction = await dispatch(submitReview({ id, formData }));

      if (submitReview.fulfilled.match(resultAction)) {
        const message = resultAction.payload?.message;
        toast.success(message);

        dispatch(fetchBookById(id));
        setRating("");
        setComment("");
      } else {
        const errorPayload = resultAction.payload;
        toast.error(errorPayload?.error || errorPayload?.message);
      }
    } catch (error) {
      console.error("Review submission error:", error);
      toast.error(error?.response?.data?.message);
    }
  };

  const tabLabels = {
    description: "Description",
    about: "About Author",
    reviews: "Reviews",
  };

  return (
    <div className="p-6 max-w-7xl mt-12 mx-auto">
      {/* Back Button */}
      <div className="flex justify-start border-b-2  items-center mb-6">
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="mb-6 text-sm cursor-pointer text-gray-600 hover:text-yellow-500"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {statusBookDetail === "failed" ? (
        <tr>
          <td colSpan="12" className="text-center py-4">
            <div className="flex justify-center items-center">
              Error. {error}.{" "}
              <span className="text-base font-semibold "> Try again later</span>
            </div>
          </td>
        </tr>
      ) : statusBookDetail === "loading" ? (
        <div className="flex flex-col border-b-2 md:flex-row gap-8 animate-pulse">
          {/* Image Left */}
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-[280px] h-[460px] bg-gray-100 shadow-2xl rounded-md" />
          </div>

          {/* Details Right */}
          <div className="md:w-1/2 space-y-4 pb-6">
            <Skeleton className="h-8 w-3/4" /> {/* Title */}
            <Skeleton className="h-4 w-1/3" /> {/* Author */}
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-4 rounded-full" />
              ))}
              <Skeleton className="h-4 w-10 ml-2" /> {/* reviews count */}
            </div>
            <Skeleton className="h-6 w-20" /> {/* Price */}
            {/* Description */}
            <div className="flex flex-col border-b-[2px] py-2 justify-start items-start">
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 mt-4 w-full">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-10 w-40" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col border-b-2 md:flex-row gap-8">
            {/* Image Left */}
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-[280px] h-[460px] bg-white shadow-2xl rounded-md transform -rotate-[1.5deg] hover:rotate-0 transition-transform duration-300">
                {bookDetail?.book.cover_image ? (
                  <img
                    src={`https://test.amber-hive.com/storage/${bookDetail.book.cover_image}`}
                    alt={bookDetail.book.title}
                    className="w-full h-full object-cover rounded-md shadow-inner"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 text-sm rounded-md">
                    No Cover Image
                  </div>
                )}
                <div className="absolute top-0 left-0 h-full w-3 bg-gradient-to-r from-black/10 to-transparent rounded-l-md" />
              </div>
            </div>

            {/* Details Right */}
            <div className="md:w-1/2 space-y-4 pb-6">
              <h1 className="text-3xl font-bold text-gray-800">
                {bookDetail?.book?.title}
              </h1>
              <p className="text-gray-500 text-sm">
                by (author) {bookDetail?.book?.author?.user?.name}
              </p>

              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={
                      i < bookDetail?.book?.rating
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }
                  >
                    ★
                  </span>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {bookDetail?.book?.reviews_count} reviews
                </span>
              </div>
              <div className="flex items-center gap-6 mt-2">
                <p className="text-lg font-semibold text-gray-800">
                  {bookDetail?.book?.currency === "ngn"
                    ? "₦"
                    : bookDetail?.book?.currency
                    ? "$"
                    : ""}
                  {bookDetail?.book?.discount_price || bookDetail?.book?.price}
                </p>

                {bookDetail?.book?.discount_price && (
                  <p className="text-sm text-red-500 line-through">
                    {bookDetail?.book?.currency === "ngn"
                      ? "₦"
                      : bookDetail?.book?.currency
                      ? "$"
                      : ""}
                    {bookDetail?.book?.price}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="flex flex-col border-b-[2px] py-2 justify-start items-start">
                <div
                  className={`text-gray-600 mt-4 overflow-hidden transition-all duration-500 ease-in-out ${
                    isExpanded ? "max-h-[1000px]" : "max-h-[6rem]"
                  }`}
                >
                  <div
                    className="whitespace-pre-line prose"
                    dangerouslySetInnerHTML={{
                      __html:
                        bookDetail?.book?.description ||
                        "No description available.",
                    }}
                  />
                </div>

                {bookDetail?.book?.description && (
                  <p
                    className="text-yellow-500 ml-1 mt-2 cursor-pointer"
                    onClick={() => setIsExpanded((prev) => !prev)}
                  >
                    {isExpanded ? "Read less" : "Read more"}
                  </p>
                )}
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex flex-col sm:flex-row flex-wrap gap-4 mt-4 w-full">
                  <Button
                    onClick={handleAddToCart}
                    disabled={statusAddToCart === "loading" || addedToCart}
                    className="w-full cursor-pointer sm:w-auto"
                  >
                    {statusAddToCart === "loading" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Adding...
                      </>
                    ) : addedToCart ? (
                      <>
                        <Check className="w-4 h-4 mr-2 text-green-600" />
                        Added
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleToggleFavorite}
                    disabled={statusFavorite === "loading" || addedToFavorites}
                    className="flex items-center cursor-pointer w-full sm:w-auto"
                  >
                    {statusFavorite === "loading" ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : addedToFavorites ? (
                      <>
                        <Check className="w-4 h-4 mr-1 text-green-600" />
                        <span>Favorites</span>
                      </>
                    ) : (
                      <>
                        <FaHeart className="w-4 h-4 mr-1 text-yellow-600" />
                        <span>Add to Favorites</span>
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={async () => {
                      const url = `${window.location.origin}/book/${bookDetail?.book?.slug}`;
                      const title = bookDetail?.book?.title;
                      const author = bookDetail?.book?.author?.user?.name;
                      const cover = bookDetail?.book?.cover_image
                        ? `https://test.amber-hive.com/storage/${bookDetail.book.cover_image}`
                        : "";

                      // Build HTML with metadata
                      const html = `
      <div>
        <strong>${title}</strong><br/>
        <em>by ${author}</em><br/>
        ${
          cover
            ? `<img src="${cover}" alt="${title}" width="120" style="margin-top:8px" />`
            : ""
        }
        <p><a href="${url}">${url}</a></p>
      </div>
    `;

                      try {
                        await navigator.clipboard.write([
                          new ClipboardItem({
                            "text/html": new Blob([html], {
                              type: "text/html",
                            }),
                            "text/plain": new Blob([url], {
                              type: "text/plain",
                            }), // fallback
                          }),
                        ]);
                        toast.success(
                          "Book link (with metadata) copied to clipboard!"
                        );
                      } catch (err) {
                        console.error("Clipboard write failed", err);
                        toast.error("Could not copy link. Please try again.");
                      }
                    }}
                    className="flex items-center cursor-pointer w-full sm:w-auto"
                  >
                    <Copy className="w-4 h-4 mr-1 text-blue-600" />
                    <span>Copy Book Link</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="py-12">
            <Tabs defaultValue="description" className="w-full mt-8">
              <div className=" w-full">
                {/* Scrollable wrapper */}
                <div className="w-full overflow-auto py-2">
                  <div className="w-full border-b-3 border-gray-200">
                    <TabsList className="flex items-center gap-6 bg-transparent p-0 ">
                      {["description", "about", "reviews"].map((tab) => (
                        <TabsTrigger
                          key={tab}
                          value={tab}
                          className="text-base font-medium cursor-pointer text-gray-600 data-[state=active]:shadow-none data-[state=active]:text-base data-[state=active]:font-[600] data-[state=active]:text-[#F6A920] data-[state=active]:border-b-3 data-[state=active]:border-[#F6A920] p-2 rounded-none transition-colors border-0 pb-[30px] focus:outline-none justify-start"
                        >
                          {tabLabels[tab]}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>
                </div>
              </div>

              <TabsContent value="description">
                <div className="space-y-6 mt-4">
                  {bookDetail?.book?.title && (
                    <div className="flex justify-between items-start gap-6">
                      <p className="font-semibold text-gray-900 min-w-[130px]">
                        Original Title
                      </p>
                      <p className="text-left flex-1">
                        {bookDetail?.book?.title}
                      </p>
                    </div>
                  )}

                  {bookDetail?.book?.language && (
                    <div className="flex justify-between items-start gap-6">
                      <p className="font-semibold text-gray-900 min-w-[130px]">
                        Language
                      </p>
                      <p className="text-left flex-1">
                        {bookDetail?.book?.language}
                      </p>
                    </div>
                  )}

                  {bookDetail?.book?.page_count && (
                    <div className="flex justify-between items-start gap-6">
                      <p className="font-semibold text-gray-900 min-w-[130px]">
                        Pages
                      </p>
                      <p className="text-left flex-1">
                        {bookDetail?.book?.page_count}
                      </p>
                    </div>
                  )}

                  {bookDetail?.book?.published_at && (
                    <div className="flex justify-between items-start gap-6">
                      <p className="font-semibold text-gray-900 min-w-[130px]">
                        Date Published
                      </p>
                      <p className="text-left flex-1">
                        {formatDate(bookDetail?.book?.published_at)}
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent
                value="about"
                className="transition-all duration-500 ease-in-out"
              >
                <div className="mt-4 text-sm text-gray-700 space-y-6">
                  <div className="flex justify-between text-base items-start gap-6">
                    <p className="font-semibold text-gray-900 min-w-[130px]">
                      Name of Author
                    </p>
                    <p className="text-left flex-1">
                      {bookDetail?.book?.author?.user?.name}
                    </p>
                  </div>

                  <div className="flex justify-between text-base items-start gap-6">
                    <p className="font-semibold text-gray-900 min-w-[130px]">
                      Biography
                    </p>
                    <p className="text-left flex-1">
                      {bookDetail?.book?.author?.bio}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Review List
                  </h3>
                  <p className="text-sm text-gray-500">
                    See all reviews on the book
                  </p>

                  {bookDetail?.book?.reviews?.map((review) => (
                    <div key={review.id} className="flex gap-4">
                      {/* Profile avatar */}
                      <div className="flex-shrink-0">
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                            review?.user?.name
                          )}&background=random`}
                          alt={review?.user?.name}
                          className="w-10 h-10 rounded-full"
                        />
                      </div>

                      {/* Review content */}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{review?.user?.name}</p>
                          <span className="text-sm text-gray-400">
                            {new Date(review.created_at).toDateString()}
                          </span>
                        </div>

                        {/* Rating Stars */}
                        <div className="flex items-center gap-1 text-yellow-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                          ))}
                        </div>

                        <p className="text-gray-800">{review.comment}</p>

                       
                      </div>
                    </div>
                  ))}

                  {/* Message Input Box */}
                  <div className="flex items-start gap-6 pt-6 border-t border-gray-200">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
                      {user?.name ? (
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.name
                          )}&background=random`}
                          alt={user.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <FaUserCircle className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    {/* Review Content */}
                    <div className="flex flex-col max-w-md w-full">
                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3">
                        <Label className="text-base font-semibold text-gray-700">
                          Rating
                        </Label>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              size={24}
                              onClick={() => setRating(star)}
                              className={`cursor-pointer transition-colors duration-200 ${
                                star <= rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              aria-label={`${star} Star${star > 1 ? "s" : ""}`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Comment Textarea */}
                      <div>
                        <Label htmlFor="comment" className="mb-1 block">
                          Comment
                        </Label>
                        <Textarea
                          id="comment"
                          placeholder="Write your review here..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          maxLength={1000}
                          rows={5}
                          className="resize-none mb-2 border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-md w-full max-w-xs"
                        />
                      </div>
                      <div className="text-xs text-gray-400 text-right mb-4 max-w-xs">
                        {comment.length} / 1000 characters
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={
                          statusSubmitRe === "loading" || userAlreadyReviewed
                        }
                        className={`px-5 py-2 rounded-md font-medium w-full cursor-pointer max-w-xs ${
                          statusSubmitRe === "loading" || userAlreadyReviewed
                            ? "bg-orange-300 cursor-not-allowed text-gray-700"
                            : "bg-orange-500 hover:bg-orange-600 text-white"
                        }`}
                        onClick={handleSubmitReview}
                      >
                        {userAlreadyReviewed ? (
                          "You have already reviewed"
                        ) : statusSubmitRe === "loading" ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="animate-spin w-4 h-4" />
                            Submitting...
                          </span>
                        ) : (
                          "Submit Review"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </div>
  );
}
