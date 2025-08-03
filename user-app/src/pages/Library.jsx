import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { HiDotsHorizontal } from "react-icons/hi";
import { BsBook } from "react-icons/bs";
import { GiBookshelf } from "react-icons/gi";
import { FaHeart, FaPen } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyLibrary } from "@/store/slice/bookSlice";
import { fetchFavorites } from "@/store/slice/favoritesSlice";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Link } from "react-router";
import { FiBookOpen, FiHeart } from "react-icons/fi";
import { Skeleton } from "@/components/ui/skeleton";

const Library = () => {
  const [viewMode, setViewMode] = useState("grid");

  const dispatch = useDispatch();
  const { myLibrary, statusMyLibrary, error } = useSelector(
    (state) => state.books
  );
  const { favorites } = useSelector((state) => state.favorites);

  useEffect(() => {
    dispatch(fetchMyLibrary());
    dispatch(fetchFavorites());
  }, [dispatch]);

  // console.log(myLibrary);

  return (
    <div className="max-w-[80rem] mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900">My Library</h1>
        <p className="text-sm text-gray-500">
          Have a great reading experience.
        </p>
      </div>
      <div>
        <div className="">
          <Tabs defaultValue="My Reads">
            <div className=" w-full">
              {/* Scrollable wrapper */}
              <div className="w-full overflow-auto py-2">
                <div className=" w-ful border-b-3 border-gray-200">
                  <TabsList className="flex items-center gap-6 w-max bg-transparent p-0">
                    {["My Reads", "Favourites"].map((tab) => (
                      <TabsTrigger
                        key={tab}
                        value={tab}
                        className="text-base font-medium text-gray-600 data-[state=active]:shadow-none data-[state=active]:text-base data-[state=active]:font-[600] data-[state=active]:text-yellow-600 data-[state=active]:border-b-3 data-[state=active]:border-yellow-500 p-2 rounded-none transition-colors border-0 pb-[30px] focus:outline-none justify-start"
                      >
                        {tab === "My Reads"
                          ? "My Reads"
                          : tab === "Archived Books"
                          ? "Archived Books"
                          : "Favourites"}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
              </div>
            </div>

            {/* My Reads */}
            <TabsContent value="My Reads" className="">
              {statusMyLibrary === "loading" ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 border-[1px] border-gray-200 p-4">
                  {[...Array(5)].map((_, index) => (
                    <div
                      key={index}
                      className="group p-3 bg-white shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex justify-end my-2">
                        <Skeleton className="h-5 w-5 rounded-full" />
                      </div>

                      <div className="flex flex-col items-center">
                        <Skeleton className="w-3/4 h-64 rounded mb-3" />
                      </div>

                      <div className="space-y-2">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-4 w-16" />
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Skeleton
                              key={i}
                              className="h-4 w-4 mr-1 rounded-full"
                            />
                          ))}
                          <Skeleton className="h-4 w-8 ml-1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : myLibrary.length === 0 ? (
                <div>
                  <div className="p-4 py-24 bg-white ">
                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                      <div className="bg-gray-100 rounded-full p-2 inline-block">
                        <div className="bg-gray-200 rounded-full p-2">
                          <BsBook className="w-8 h-8 text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold">
                          There is nothing to see here
                        </h2>
                        <p>You have not started reading yet</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mx-12 py-4">
                  <div className="grid mt-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
                    {myLibrary.map((book) => (
                      <div
                        key={book.id}
                        className=" group p-3  bg-white shadow-sm rounded-md border-[1px] hover:shadow-md transition"
                      >
                        <div className="flex justify-end my-2">
                          <Popover>
                            <PopoverTrigger asChild>
                              <button className="text-gray-500 cursor-pointer hover:text-gray-700 focus:outline-none">
                                <HiDotsHorizontal className="w-5 h-5" />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-40 p-2 font-gilroy text-sm">
                              <div className="flex flex-col space-y-1">
                                <Link
                                  to={`/read-book/${book.id}`}
                                  className="flex items-center gap-2 text-left px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
                                >
                                  <FiBookOpen className="text-gray-600" />
                                  Read
                                </Link>
                                <Link
                                  to={`/book/${book.slug}`}
                                  state={{ bookId: book.id }}
                                  className="flex items-center gap-2 text-left px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
                                >
                                  <FaPen className="text-gray-600" />
                                  Review book
                                </Link>
                                <Link
                                  to="/favourites"
                                  className="flex items-center gap-2 text-left px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
                                >
                                  <FiHeart className="text-gray-600" />
                                  Favourite
                                </Link>
                                {/* <Link
                                  to="/library" // replace with actual route or handle differently if needed
                                  className="flex items-center gap-2 text-left px-2 py-1 rounded hover:bg-red-100 text-red-600 hover:text-red-700 cursor-pointer"
                                >
                                  <FiTrash2 className="text-red-600" />
                                  Delete
                                </Link> */}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div className="flex flex-col items-center">
                          <div className="w-3/4 h-64 flex justify-center items-center bg-white overflow-hidden rounded mb-3">
                            <img
                              src={`https://test.amber-hive.com/storage/${book?.cover_image}`}
                              alt={book.title}
                              className="w-full h-full object-cover"
                            />
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
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Archived Books */}
            <TabsContent value="Archived Books">
              <div>
                <div className="p-4 py-24 bg-white ">
                  <div className="flex flex-col items-center justify-center text-center space-y-4">
                    <div className="bg-gray-100 rounded-full p-2 inline-block">
                      <div className="bg-gray-200 rounded-full p-2">
                        <GiBookshelf className="w-8 h-8 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">
                        There is nothing to see here
                      </h2>
                      <p>No Archives yet</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Favourites */}
            <TabsContent value="Favourites">
              {favorites.length === 0 ? (
                <div className="p-4 py-24 bg-white ">
                  <div className="flex flex-col items-center justify-center text-center space-y-4">
                    <div className="bg-gray-100 rounded-full p-2 inline-block">
                      <div className="bg-gray-200 rounded-full p-2">
                        <BsBook className="w-8 h-8 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">
                        There is nothing to see here
                      </h2>
                      <p>You do not have any notification yet!</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mx-12 py-10">
                  {/* View Toggle */}
                  <div className="flex justify-end my-2 gap-2"></div>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
                    {favorites.map((book) => (
                      <div
                        key={book.id}
                        className=" group p-3  bg-white shadow-sm rounded-md border-[1px] hover:shadow-md transition"
                      >
                        <div className="flex justify-end my-2">
                          <button className="text-gray-500">
                            <FaHeart className="w-5 h-5 text-[#FF4C38]" />
                          </button>
                        </div>

                        <div className="flex flex-col items-center">
                          <div className="w-3/4 h-64 flex justify-center items-center bg-white overflow-hidden rounded mb-3">
                            <img
                              src={`https://test.amber-hive.com/storage/${book?.cover_image}`}
                              alt={book.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        <h3 className="text-sm font-semibold text-gray-800 truncate">
                          {book.title}
                        </h3>
                        <p className="text-gray-800 font-semibold text-sm">
                          ${book.price}
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
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Library;
