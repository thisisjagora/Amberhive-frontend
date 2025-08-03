import React, { useEffect, useState, useMemo } from "react";
import TableComponent from "@/components/TableComponent";
import TableGrid from "@/components/TableGrid";
import { Input } from "@/components/ui/input";
import { columns } from "@/components/bookapprovals/columns";
import AdminLayout from "./DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBooks } from "@/redux/slices/bookApprovalSlice";
import { Search } from "lucide-react";

const AllBook = () => {
  const [view, setView] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();
  const { allBooks, statusAllBooks, pagination } = useSelector(
    (state) => state.bookApproval
  );

  useEffect(() => {
    dispatch(fetchAllBooks());
  }, [dispatch]);

  const memoizedColumns = useMemo(() => columns(view), [view]);

  const isLoading = statusAllBooks === "loading";

  const showEmpty = allBooks.length === 0 && statusAllBooks === "succeeded";

  const filteredBooks = allBooks.filter((book) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      book.title && book.title.toLowerCase().includes(lowerSearch)
      // (book.status && book.status.toLowerCase().includes(lowerSearch))
    );
  });

  return (
    <div className="bg-white font-gilroy">
      <AdminLayout
        header={
          <div className="flex flex-col px-4 mt-20 md:mt-0 py-6 justify-start items-start w-full">
            <div className="flex flex-col items-start gap-2">
              <h2 className="text-xl font-semibold text-gray-800">All Books</h2>
              <p className="text-gray-500 text-sm">
                Manage requests for approvals and rejection of publications
              </p>
            </div>
          </div>
        }
      >
        <div className="pb-2 px-4 mt-4 border-t-2">
          <div className="flex flex-col py-4 gap-2">
            <h1 className="text-lg font-semibold text-gray-700">
              All Requests
            </h1>

            {statusAllBooks === "succeeded" && (
              <p className="text-sm text-gray-500">
                Showing {pagination.from}–{pagination.to} of {pagination.total}{" "}
                results
              </p>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4 my-4 items-start md:items-center justify-start md:justify-between bg-white">
            {/* View toggles */}

            {/* Search and Filter */}
            <div className="flex flex-col-reverse md:flex-row items-start md:items-center gap-2 w-[400px] max-w-full">
              <div className="relative md:w-[400px]">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={16}
                />
                <Input
                  type="text"
                  placeholder="Search by title..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* <Button
                  variant="outline"
                  className="flex text-base items-center gap-1"
                >
                  <VscListFilter />
                  Filter
                </Button> */}
            </div>
          </div>

          <div className="bg-white rounded-lg w-full h-auto">
            {view === "list" ? (
              <div className="relative overflow-x-auto rounded-md border-[1px] p-4">
                <TableComponent
                  columns={memoizedColumns}
                  data={filteredBooks}
                  isLoading={isLoading}
                  serverPagination={{
                    currentPage: pagination.currentPage,
                    lastPage: pagination.lastPage,
                    total: pagination.total,
                    from: pagination.from,
                    to: pagination.to,
                    onPageChange: (page) => dispatch(fetchAllBooks(page + 1)),
                  }}
                />
              </div>
            ) : (
              <TableGrid books={filteredBooks} viewMode={view} />
            )}
          </div>
        </div>
      </AdminLayout>
    </div>
  );
};

export default AllBook;
