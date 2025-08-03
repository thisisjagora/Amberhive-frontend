import { fetchFavorites, toggleFavorite } from "@/store/slice/favoritesSlice";
import React, { useEffect, useState } from "react";
import { BsBoxSeam } from "react-icons/bs";
import { FaHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";

const Favourites = () => {
  const dispatch = useDispatch();
  const [likedBooks, setLikedBooks] = useState({});
  const { favorites, status, error } = useSelector((state) => state.favorites);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  const toggleLike = (book) => {
    if (!book?.id) return;

    dispatch(toggleFavorite(book.id)).then(() => {
      dispatch(fetchFavorites()); // Refresh after toggle
    });

    setLikedBooks((prev) => ({
      ...prev,
      [book.id]: !prev[book.id],
    }));
  };

  return (
    <div className="max-w-[85rem] mx-auto px-4 py-16">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900">Favourites</h1>
        <p className="text-sm text-gray-500">
          Items that are liked but haven’t been purchased
        </p>
      </div>

      {status === "failed" ? (
        <tr>
          <td colSpan="12" className="text-center py-4">
            <div className="flex justify-center items-center">
              Error. {error}.{" "}
              <span className="text-base font-semibold"> Try again later</span>
            </div>
          </td>
        </tr>
      ) : status === "loading" ? (
        <div className="flex justify-center items-center py-10">
          <span className="text-gray-500">Loading...</span>
        </div>
      ) : (
        <div>
          <div>
            {favorites.length === 0 ? (
              <div className="p-4 py-36 bg-white">
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <div className="bg-gray-100 rounded-full p-2 inline-block">
                    <div className="bg-gray-200 rounded-full p-2">
                      <BsBoxSeam className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>

                  <h2 className="text-lg font-semibold">No Favourites Yet</h2>
                  <p className="text-base text-gray-500 max-w-[18rem]">
                    When you eventually like a product, it’ll show up here.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 border-[1px] border-gray-200 p-4">
                {favorites.map((book) => {
                  if (!book || !book.id) return null; // Prevent crashing if book is invalid

                  return (
                    <Link
                      to={`/book/${book.slug}`}
                      state={{ bookId: book.id }}
                      key={book.id}
                    >
                      <div className="group p-3 bg-white shadow-sm hover:shadow-md transition">
                        <div className="flex justify-end my-2">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              toggleLike(book);
                            }}
                            className={`${
                              likedBooks[book.id]
                                ? "text-gray-600"
                                : "text-yellow-500"
                            } hover:text-gray-600`}
                          >
                            <FaHeart className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="flex flex-col items-center">
                          <div className="w-3/4 h-64 flex justify-center items-center bg-gray-100 text-gray-400 text-sm overflow-hidden rounded mb-3">
                            {book.cover_image ? (
                              <img
                                src={`https://test.amber-hive.com/storage/${book?.cover_image}`}
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
                        <p className="text-gray-800 font-semibold text-sm">
                          {book?.currency
                            ? book.currency.toUpperCase() === "NGN"
                              ? "₦"
                              : "$"
                            : ""}
                          {book.price}
                        </p>
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
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Favourites;
