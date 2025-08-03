import React from "react";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import { LuNotebookText } from "react-icons/lu";
import { Link } from "react-router";

const EmptyBooks = () => {
  return (
    <div className="flex flex-col items-center my-12 justify-center space-y-5">
      <div className="w-16 h-16 flex items-center justify-center">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
            <LuNotebookText className="text-gray-600 w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center ">
        {/* Text content */}
        <h1 className="text-lg font-semibold text-center text-gray-800">
          Oops! Looks like your catalog needs a book.
        </h1>
        <p className="text-base text-center text-gray-400">
          Simply add a book by clicking add ebook.
        </p>
      </div>

    
    </div>
  );
};

export default EmptyBooks;
