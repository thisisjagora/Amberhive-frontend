import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Card, CardContent } from "../ui/card";
import { CellAction } from "./cellAction";
import { Badge } from "../ui/badge";

const getStatusBadge = (status) => {
  const statusMap = {
    Active: "text-green-600 bg-green-100",
    Blocked: "text-gray-500 bg-gray-100",
    Inactive: "text-red-500 bg-red-100",
  };

  const badgeClass = statusMap[status] || "bg-gray-200 text-gray-600"; // Default fallback
  console.log("Status: ", status, "Badge class: ", badgeClass); // Debugging log

  return (
    <Badge className={`w-fit font-semibold ${badgeClass}`}>{status}</Badge>
  );
};

const TableGrid = ({ books, viewMode }) => {
  const table = useReactTable({
    data: books,
    columns: [
      {
        header: "Book",
        accessorKey: "name",
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => getStatusBadge(row.original.status), // Proper status badge rendering
      },
      {
        header: "Actions",
        accessorKey: "actions",
        cell: ({ row }) => (
          <CellAction data={row.original} viewMode={viewMode} />
        ),
      },
    ],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 12 } },
  });

  return (
    <div className="flex flex-col gap-6 px-4 max-w-screen-xl mx-auto">
      {/* Grid display */}
      <div className="overflow-y-auto pr-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center items-start">
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <Card
                key={row.id}
                className="w-full shadow-none py-1 rounded-md"
              >
                <CardContent className="p-4 flex flex-col items-center">
                  <div className="w-full flex justify-end mb-2">
                    {flexRender(
                      row.getVisibleCells()[2].column.columnDef.cell,
                      row.getVisibleCells()[2].getContext()
                    )}
                  </div>
                  <div className="w-22 overflow-hidden flex justify-center items-center">
                    {row.original.image ? (
                      <img
                        src={row.original.image}
                        alt={row.original.name}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        No Image
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold mt-3 text-center">
                    {row.original.name}
                  </h3>
                  <h3 className="text-sm font-medium mt-3 text-center">
                    {row.original.email}
                  </h3>
                  <div className="mt-2">
                    {getStatusBadge(row.original.status)}
                  </div>

                  <div className="flex justify-between items-center text-gray-700 mt-8 gap-2 w-full">
                    <div className="flex flex-col items-start">
                      <h1 className="text-xs">Amount Spent</h1>
                      <p className="text-sm font-semibold">
                        {row.original.amountSpent}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <h1 className="text-xs">Orders</h1>
                      <p className="text-sm font-semibold">
                        {row.original.totalOrders}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div>No books available</div>
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4 p-2 text-gray-700 text-sm">
        <span
          className={`cursor-pointer ${
            !table.getCanPreviousPage() ? "text-gray-400" : "hover:underline"
          }`}
          onClick={() => table.previousPage()}
        >
          &larr; Prev
        </span>

        <div className="flex gap-2">
          {Array.from(
            { length: table.getPageCount() },
            (_, index) => index + 1
          ).map((page) => (
            <span
              key={page}
              className={`cursor-pointer px-2 ${
                table.getState().pagination.pageIndex + 1 === page
                  ? "font-bold underline"
                  : "hover:underline"
              }`}
              onClick={() => table.setPageIndex(page - 1)}
            >
              {page}
            </span>
          ))}
        </div>

        <span
          className={`cursor-pointer ${
            !table.getCanNextPage() ? "text-gray-400" : "hover:underline"
          }`}
          onClick={() => table.nextPage()}
        >
          Next &rarr;
        </span>
      </div>
    </div>
  );
};

export default TableGrid;
