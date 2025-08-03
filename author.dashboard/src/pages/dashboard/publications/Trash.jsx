import Layout from "@/components/shared/Layout";
import TableComponent from "@/components/TableComponent";
import { columns } from "@/components/trashBook/columns";
import { Input } from "@/components/ui/input";
import { fetchTrashedBooks } from "@/redux/slices/bookSlice";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { TbMailCancel } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";

const Trash = () => {
  const [view, setView] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const { trashedBooks, statusTrashedBooks, error } = useSelector(
    (state) => state.books
  );

  useEffect(() => {
    dispatch(fetchTrashedBooks());
  }, [dispatch]);

  const filteredTrashed = trashedBooks.filter((item) =>
    item?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <Layout
      header={
        <div className="flex flex-col mt-20 px-4 md:mt-0 gap-8 md:gap-0 justify-start items-start w-full">
          <h2 className="text-xl font-semibold text-gray-800">Trash</h2>
          <p className="text-sm text-gray-500">
            Items you’ve moved to trash appear here.
          </p>
        </div>
      }
    >
      <div className="px-4">
        {statusTrashedBooks === "loading" ? (
          <div className="p-4 bg-white">
            <div className="flex flex-col items-center justify-center text-center mt-20 space-y-4">
              <div className="h-6 w-6 bg-gray-300 rounded-full animate-spin border-t-2 border-gray-500" />
              <p className="text-sm text-gray-500">Loading drafts...</p>
            </div>
          </div>
        ) : trashedBooks.length === 0 ? (
          <div className="p-4 bg-white">
            <div className="flex flex-col items-center justify-center text-center mt-20 space-y-4">
              <div className="bg-gray-200 rounded-full p-3 inline-block">
                <div className="bg-gray-400 rounded-full p-2">
                  <TbMailCancel className="text-gray-700 text-2xl" />
                </div>
              </div>

              <h2 className="text-lg font-semibold">
                You do not have any Draft!
              </h2>
              <p className="text-base text-gray-500 max-w-md">
                Your Draft is free from cobwebs.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-start md:justify-between bg-white">
              {/* Left: View toggles */}

              {/* Right: Search and Filter */}
              <div className="flex flex-col-reverse md:flex-row items-start md:items-center gap-2 w-[400px] max-w-full">
                <div className="relative flex-1 w-full">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={16}
                  />
                  <Input
                    type="text"
                    placeholder="Search books..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-full"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-lg w-full p-4 h-auto border-[1px] mt-12 shadow">
                <div className="relative overflow-x-auto rounded-t-lg">
                  <TableComponent
                    columns={columns(view)}
                    data={filteredTrashed}
                    isLoading={statusTrashedBooks === "loading"}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Trash;
