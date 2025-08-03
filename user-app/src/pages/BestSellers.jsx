import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, LayoutGrid } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useSearchParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchBestSellers } from "@/store/slice/bookSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { FaHeart } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { fetchGenres } from "@/store/slice/genreSlice";

const BestSellers = () => {
  const [liked, setLiked] = useState(false);
  const [sortOption, setSortOption] = useState("recent");
  const [sortedBooks, setSortedBooks] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromURL = parseInt(searchParams.get("page")) || 1;

  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const dispatch = useDispatch();
  const { bestSellers, statusBestSellers, error, paginationBestSellers } =
    useSelector((state) => state.books);

  const [currentPage, setCurrentPage] = useState(pageFromURL);
  const { genres } = useSelector((state) => state.genre);

  useEffect(() => {
    dispatch(fetchBestSellers(currentPage));
    dispatch(fetchGenres());
  }, [dispatch, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= paginationBestSellers.last_page) {
      setSearchParams({ page: page.toString() });
      setCurrentPage(page);
    }
  };

  const categories =
    genres.map((genre) => {
      const subs = genre.sub_categories?.map((sub) => sub.name) || [];

      return {
        name: genre.name,
        subcategories: subs,
      };
    }) || [];

  const toggleLike = () => {
    setLiked((prev) => !prev);
  };

  useEffect(() => {
    let filtered = bestSellers.filter((book) => {
      const price = parseFloat(book.price);

      const withinMin = minPrice === "" || price >= parseFloat(minPrice);
      const withinMax = maxPrice === "" || price <= parseFloat(maxPrice);
      const matchesPrice = withinMin && withinMax;

      const tags = Array.isArray(book.tags) ? book.tags : [];
      const matchesTags =
        selectedSubcategories.length === 0 ||
        tags.some((tag) => selectedSubcategories.includes(tag));

      return matchesPrice && matchesTags;
    });

    // Apply sorting
    if (sortOption === "price_low") {
      filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortOption === "price_high") {
      filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    setSortedBooks(filtered);
  }, [bestSellers, sortOption, minPrice, maxPrice, selectedSubcategories]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Handler for checkbox changes
  const handleCheckboxChange = (subcatName) => {
    setSelectedSubcategories(
      (prevSelected) =>
        prevSelected.includes(subcatName)
          ? prevSelected.filter((name) => name !== subcatName) // Remove if already selected
          : [...prevSelected, subcatName] // Add if not selected
    );
  };

  return (
    <div className="max-w-[90rem] mx-auto px-4 py-10 flex flex-col md:flex-row gap-6">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 hidden lg:block lg:border-r pr-6 bg-white p-4">
        {/* Price filter section */}
        <div className="mb-6">
          <h2 className="font-semibold text-lg mb-2 text-gray-800">Price</h2>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-1/2"
            />
            <Input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-1/2"
            />
          </div>
        </div>

        {/* Categories filter section */}
        {categories.map((category) => (
          <div key={category.name} className="mb-4">
            <details className="group">
              <summary className="cursor-pointer text-gray-700 font-medium flex justify-between items-center py-1">
                {category.name}
                <span className="text-gray-500 group-open:hidden">
                  <ChevronDown size={18} />
                </span>
                <span className="text-gray-500 hidden group-open:inline">
                  <ChevronUp size={18} />
                </span>
              </summary>

              <ul className="pl-4 mt-2 space-y-2 text-sm text-gray-600">
                {category.subcategories.map((subcat) => (
                  <li key={subcat} className="flex items-center space-x-2">
                    <Checkbox
                      id={`checkbox-${subcat}`}
                      checked={selectedSubcategories.includes(subcat)}
                      onCheckedChange={() => handleCheckboxChange(subcat)}
                      className={`data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500`}
                    />
                    <label
                      htmlFor={`checkbox-${subcat}`}
                      className="cursor-pointer hover:text-yellow-600 transition-colors duration-200"
                    >
                      {subcat}
                    </label>
                  </li>
                ))}
              </ul>
            </details>
          </div>
        ))}
      </aside>

      {/* Main Book Grid */}
      <main className="flex-1">
        <div className="hidden md:flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          {paginationBestSellers && (
            <p className="text-sm text-gray-700">
              Showing <strong>{paginationBestSellers.from}</strong> –{" "}
              <strong>{paginationBestSellers.to}</strong> of{" "}
              <strong>{paginationBestSellers.total}</strong> results
            </p>
          )}

          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Sort Dropdown */}

            <div className="flex items-center gap-2">
              <Label htmlFor="sort" className="text-sm text-gray-700">
                Sort by:
              </Label>
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-[180px]" id="sort">
                  <SelectValue placeholder="Select sort option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recent</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {statusBestSellers === "failed" ? (
          <tr>
            <td colSpan="12" className="text-center py-4">
              <div className="flex justify-center items-center">
                Error. {error}.{" "}
                <span className="text-base font-semibold ">
                  {" "}
                  Try again later
                </span>
              </div>
            </td>
          </tr>
        ) : statusBestSellers === "loading" ? (
          <div className="grid gap-6 border border-gray-200 p-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(4)].map((_, index) => (
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
                      <Skeleton key={i} className="h-4 w-4 mr-1 rounded-full" />
                    ))}
                    <Skeleton className="h-4 w-8 ml-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-gray-200 rounded-md p-2">
            {sortedBooks.length === 0 ? (
              <div className="text-center text-gray-600 py-10">
                <h2 className="text-lg font-semibold mb-2">No books found</h2>
                <p className="text-sm">
                  Try adjusting your filters or search criteria to see more
                  results.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
                {sortedBooks.map((book) => (
                  <Link
                    to={`/book/${book.slug}`}
                    state={{ bookId: book.id }}
                    key={book.id}
                  >
                    <div className="group p-3 bg-white shadow-sm rounded-md hover:shadow-md transition">
                      <div className="flex justify-end my-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleLike(book);
                          }}
                          className={`${
                            liked[book.id] ? "text-yellow-600" : "text-gray-500"
                          } hover:text-yellow-600`}
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
                       <div className="flex items-center gap-6 mt-2">
                        <p className="text-gray-800 font-semibold text-base">
                          {book?.currency?.toUpperCase() === "NGN" ? "₦" : "$"}
                          {book.discount_price &&
                          parseFloat(book.discount_price) <
                            parseFloat(book.price)
                            ? book.discount_price
                            : book.price}
                        </p>

                        {book.discount_price &&
                          parseFloat(book.discount_price) <
                            parseFloat(book.price) && (
                            <p className="text-sm text-red-500 font-semibold line-through">
                              {book?.currency?.toUpperCase() === "NGN"
                                ? "₦"
                                : "$"}
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
                          ({book.reviews_count})
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-6 p-2 text-gray-700 text-sm">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!paginationBestSellers.prev_page_url}
                className={`cursor-pointer ${
                  !paginationBestSellers.prev_page_url
                    ? "text-gray-400"
                    : "hover:underline"
                }`}
              >
                &larr; Prev
              </button>

              <div className="flex gap-2">
                {Array.from(
                  { length: paginationBestSellers.last_page },
                  (_, i) => i + 1
                ).map((page) => (
                  <span
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`cursor-pointer px-2 ${
                      page === currentPage
                        ? "font-bold underline"
                        : "hover:underline"
                    }`}
                  >
                    {page}
                  </span>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!paginationBestSellers.next_page_url}
                className={`cursor-pointer ${
                  !paginationBestSellers.next_page_url
                    ? "text-gray-400"
                    : "hover:underline"
                }`}
              >
                Next &rarr;
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BestSellers;
