import { Button } from "@/components/ui/button";
import { Link } from "react-router";

import book1 from "@/assets/fea1.png";
import book2 from "@/assets/fea2.png";
import book3 from "@/assets/fea3.png";

const featuredBooks = [
  {
    title: "New Release",
    image: book1,
    bgColor: "bg-[#8D3200]",
    buttonColor: "bg-orange-900 text-white",
    link: "/new-releases",
  },
  {
    title: "Top Rated",
    image: book2,
    bgColor: "bg-[#F6A920]",
    buttonColor: "bg-yellow-700 text-white",
    link: "/books",
  },
  {
    title: "Best Sellers",
    image: book3,
    bgColor: "bg-[#120B09]",
    buttonColor: "bg-gray-800 text-white",
    link: "/best-sellers",
  },
];

export default function FeaturesCard() {
  return (
    <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-6 py-10 px-4 sm:px-6 md:px-10">
      {featuredBooks.map((book, idx) => (
        <div
          key={idx}
          className={`relative rounded-md overflow-hidden px-6 py-6 ${book.bgColor} text-white flex flex-col md:flex-col lg:flex-row items-center gap-4 md:w-full lg:h-[260px]`}
        >
          {/* Text Content */}
          <div className="flex flex-col justify-between flex-1 items-start text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold text-gray-100 leading-snug mb-3">
              {book.title.split(" ").map((word, i) => (
                <span key={i} className="block">
                  {word}
                </span>
              ))}
            </h2>

            <Link to={book.link}>
              <Button
                className={`${book.buttonColor} text-sm cursor-pointer px-5 py-2 rounded-md mt-2`}
              >
                Shop Now
              </Button>
            </Link>
          </div>

          {/* Book Image */}
          <div className="flex-shrink-0 w-full md:w-auto md:h-[150px]">
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

