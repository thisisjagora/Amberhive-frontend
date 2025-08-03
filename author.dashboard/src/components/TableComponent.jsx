import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton"; // ✅ Make sure this is imported

const TableComponent = ({ data, columns, isLoading, showPagination = true }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="w-full ">
      <div className="w-full overflow-x-auto">
        <Table className="min-w-[1000px] table-auto">
          <TableHeader className="whitespace-nowrap">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              // 🔄 Show Skeleton Loaders
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((_, colIdx) => (
                    <TableCell key={colIdx}>
                      <Skeleton className="h-6 w-full rounded-md" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-5"
                >
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {showPagination && !isLoading && (
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
      )}
    </div>
  );
};

export default TableComponent;
