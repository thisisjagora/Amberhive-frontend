import { useLocation, Link } from "react-router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchBooks } from "@/store/slice/bookSlice";
import { fetchGenres } from "@/store/slice/genreSlice";
import { FaHeart } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function SearchedBook() {
  const dispatch = useDispatch();

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOption, setSortOption] = useState("recent");
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [likedBooks, setLikedBooks] = useState({});
  const [sortedBooks, setSortedBooks] = useState([]);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);

  const { genres } = useSelector((state) => state.genre);
  const { statusSearch } = useSelector((state) => state.books);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchKeyword = queryParams.get("search");

  useEffect(() => {
    if (!searchKeyword) {
      setError("No search keyword provided.");
      return;
    }

    dispatch(searchBooks({ search: searchKeyword }))
      .unwrap()
      .then((data) => {
        if (data?.data?.length > 0) {
          setBooks(data.data);
          setError(null);
        } else {
          setBooks([]);
          setError("No books found.");
        }
      })
      .catch((err) => {
        setBooks([]);
        setError(err || "Search failed.");
      });
  }, [dispatch, searchKeyword]);

  useEffect(() => {
    dispatch(fetchGenres());
  }, [dispatch]);

  useEffect(() => {
    let filtered = books.filter((book) => {
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

    if (sortOption === "price_low") {
      filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortOption === "price_high") {
      filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else {
      filtered.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    }

    setSortedBooks(filtered);
  }, [books, minPrice, maxPrice, sortOption, selectedSubcategories]);

  const toggleLike = (book) => {
    setLikedBooks((prev) => ({
      ...prev,
      [book.id]: !prev[book.id],
    }));
  };

  const handleCheckboxChange = (subcat) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subcat)
        ? prev.filter((s) => s !== subcat)
        : [...prev, subcat]
    );
  };

  const categories =
    genres.map((genre) => ({
      name: genre.name,
      subcategories: genre.sub_categories?.map((sub) => sub.name) || [],
    })) || [];

  return (
    <div className="max-w-[90rem] mx-auto px-4 py-10 flex flex-col lg:flex-row gap-6">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 hidden lg:block lg:border-r pr-6 bg-white p-4">
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
                      className="data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
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

      {/* Main */}
      <main className="flex-1">
        <div className="hidden md:flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <p className="text-sm text-gray-600">
            Showing {sortedBooks?.length || 0} result(s) for "{searchKeyword}"
          </p>

          <div className="flex flex-col md:flex-row items-center gap-4">
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

        {statusSearch === "failed" ? (
          <div className="text-center py-4 text-red-600">
            Error: {error || "Something went wrong. Try again later."}
          </div>
        ) : statusSearch === "loading" ? (
          <div className="grid gap-6 border border-gray-200 p-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {sortedBooks.length === 0 ? (
              <div className="text-center text-gray-600 py-10">
                <h2 className="text-lg font-semibold mb-2">No books found</h2>
                <p className="text-sm">
                  Try adjusting your filters or search criteria to see more
                  results.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 border-[1px] border-gray-200 p-4">
                {sortedBooks.map((book) => (
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
                              ? "text-yellow-600"
                              : "text-gray-500"
                          } hover:text-yellow-600`}
                        >
                          <FaHeart className="w-5 h-5" />
                        </button>
                      </div>

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
                      <p className="text-gray-800 font-semibold text-sm">
                        {book?.currency?.toUpperCase() === "NGN" ? "₦" : "$"}
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
                          ({book.reviews_count})
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
