import React, { useEffect, useState, useMemo } from "react";
import TableComponent from "@/components/TableComponent";
import TableGrid from "@/components/TableGrid";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { columns } from "@/components/bookapprovals/columns";
import AdminLayout from "./DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { fetchPendingBooks } from "@/redux/slices/bookApprovalSlice";

const PendingApproval = () => {
  const [view, setView] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();
  const { pendingBooks, paginationPending, statusPendingBooks } = useSelector(
    (state) => state.bookApproval
  );

  const isLoading = statusPendingBooks === "loading";

  useEffect(() => {
    dispatch(fetchPendingBooks(1)); // Fetch first page on mount
  }, [dispatch]);

  const handlePageChange = (page) => {
    dispatch(fetchPendingBooks(page)); // Fetch new page
  };

  const memoizedColumns = useMemo(() => columns(view), [view]);

  const filteredBooks = pendingBooks.filter((book) =>
    book.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white font-gilroy">
      <AdminLayout
        header={
          <div className="flex flex-col px-4 mt-20 md:mt-0 py-6 justify-start items-start w-full">
            <div className="flex flex-col items-start gap-2">
              <h2 className="text-xl font-semibold text-gray-800">
                Pending Approvals
              </h2>
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
              Pending Approvals
            </h1>

            {statusPendingBooks === "succeeded" && (
              <p className="text-sm text-gray-500">
                Showing {paginationPending.from}–{paginationPending.to} of{" "}
                {paginationPending.total} results
              </p>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4 my-4 items-start md:items-center justify-start md:justify-between bg-white">
            <div className="flex flex-col-reverse md:flex-row items-start md:items-center gap-2 w-[400px] max-w-full">
              <div className="relative md:w-[400px]">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={16}
                />
                <Input
                  type="text"
                  placeholder="Search books..."
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
                  data={filteredBooks}
                  columns={memoizedColumns}
                  isLoading={isLoading}
                  serverPagination={{
                    currentPage: paginationPending.currentPage,
                    lastPage: paginationPending.lastPage,
                    total: paginationPending.total,
                    from: paginationPending.from,
                    to: paginationPending.to,
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

export default PendingApproval;
