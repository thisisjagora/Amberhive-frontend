import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBestSellers } from "@/store/slice/bookSlice";
import { Link } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";

const BestSellers = () => {
  const dispatch = useDispatch();
  const { bestSellers, statusBestSellers } = useSelector(
    (state) => state.books
  );
  const [likedBooks, setLikedBooks] = useState({});

  useEffect(() => {
    dispatch(fetchBestSellers());
  }, [dispatch]);

  const toggleLike = (bookId) => {
    setLikedBooks((prev) => ({
      ...prev,
      [bookId]: !prev[bookId],
    }));
  };

  return (
    <div className="max-w-[85rem] mx-auto px-4 py-16">
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Best Sellers</h2>
        <Link
          to="/best-sellers"
          className="text-sm text-gray-500 hover:text-black"
        >
          See All
        </Link>
      </div>

      {statusBestSellers === "loading" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, idx) => (
            <div
              key={idx}
              className="group p-3 bg-white shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-col items-center">
                <Skeleton className="w-3/4 h-64 mb-3 rounded bg-gray-200" />
              </div>
              <Skeleton className="h-4 w-3/4 mb-2 rounded bg-gray-200" />
              <Skeleton className="h-4 w-1/4 mb-2 rounded bg-gray-200" />
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-4 w-4 rounded-full bg-gray-200"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {statusBestSellers === "succeeded" && bestSellers.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No best sellers found.
        </div>
      )}

      {statusBestSellers === "succeeded" && bestSellers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {bestSellers.slice(0, 5).map((book) => (
            <div
              key={book.id}
              className="group p-3 bg-white shadow-sm rounded-md hover:shadow-md transition"
            >
              <Link to={`/book/${book.slug}`} state={{ bookId: book.id }}>
                <div className="flex flex-col items-center">
                  <div className="w-3/4 h-64 flex justify-center items-center bg-gray-100 text-gray-400 text-sm overflow-hidden rounded mb-3">
                    {book.cover_image ? (
                      <img
                        src={`https://test.amber-hive.com/storage/${book.cover_image}`}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>No Image Available</span>
                    )}
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-gray-800 truncate">
                  {book.title}
                </h3>
                <div className="flex items-center gap-6 mt-2">
                  <p className="text-gray-800 font-semibold text-base">
                    {book?.currency?.toUpperCase() === "NGN" ? "₦" : "$"}
                    {book.discount_price &&
                    parseFloat(book.discount_price) < parseFloat(book.price)
                      ? book.discount_price
                      : book.price}
                  </p>

                  {book.discount_price &&
                    parseFloat(book.discount_price) <
                      parseFloat(book.price) && (
                      <p className="text-sm text-red-500 font-semibold line-through">
                        {book?.currency?.toUpperCase() === "NGN" ? "₦" : "$"}
                        {book.price}
                      </p>
                    )}
                </div>
                <div className="text-sm w-full mt-0.5 flex items-center space-x-0.5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span
                      key={index}
                      className={`text-xl ${
                        index < book.rating
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                  <span className="ml-1 text-gray-600 text-sm">
                    ({book.ratingCount})
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {statusBestSellers === "failed" && (
        <div className="text-center py-10 text-red-500">
          Failed to load best sellers. Please try again later.
        </div>
      )}
    </div>
  );
};

export default BestSellers;
