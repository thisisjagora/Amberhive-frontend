import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchApprovedBooks } from "@/redux/slices/bookApprovalSlice";
import AdminLayout from "./DashboardLayout";
import TableComponent from "@/components/TableComponent";
import TableGrid from "@/components/TableGrid";
import { columns } from "@/components/bookapprovals/columns";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const ApprovedBooks = () => {
  const dispatch = useDispatch();
  const [view, setView] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");

  const {
    approvedBooks,
    statusApprovedBooks,
    paginationApproved: pagination,
  } = useSelector((state) => state.bookApproval);

  // Initial load
  useEffect(() => {
    dispatch(fetchApprovedBooks({ page: 1 }));
  }, [dispatch]);

  const handlePageChange = (newPage) => {
    dispatch(fetchApprovedBooks({ page: newPage + 1 }));
  };

  const isLoading = statusApprovedBooks === "loading";

  const filteredBooks = approvedBooks.filter((book) =>
    book.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const memoizedColumns = useMemo(() => columns(view), [view]);

  return (
    <div className="bg-white font-gilroy">
      <AdminLayout
        header={
          <div className="flex flex-col px-4 mt-20 md:mt-0 py-6 justify-start items-start w-full">
            <div className="flex flex-col items-start gap-2">
              <h2 className="text-xl font-semibold text-gray-800">Approved Books</h2>
              <p className="text-gray-500 text-sm">
                View and manage approved book requests.
              </p>
            </div>
          </div>
        }
      >
        <div className="pb-2 px-4 mt-4 border-t-2">
          <div className="flex flex-col py-4 gap-2">
            <h1 className="text-lg font-semibold text-gray-700">Approved Requests</h1>
            {statusApprovedBooks === "succeeded" && (
              <p className="text-sm text-gray-500">
                Showing {pagination.from}–{pagination.to} of {pagination.total} results
              </p>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4 my-4 items-start md:items-center justify-start md:justify-between bg-white">
            {/* Search */}
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
                    onPageChange: handlePageChange,
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

export default ApprovedBooks;
