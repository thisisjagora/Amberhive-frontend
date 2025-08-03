import React, { useEffect, useState } from "react";
import SuperAdminLayout from "./DashboardLayout";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import TableComponent from "@/components/TableComponent";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthorReports } from "@/redux/slices/reportSlice";
import { FiDownload } from "react-icons/fi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const authorColumns = [
  {
    id: "name",
    header: () => (
      <span className="font-semibold text-gray-700">Name of User</span>
    ),
    accessorKey: "name",
    cell: ({ row }) => {
      const { author_name } = row.original;
      return (
        <div className="flex items-center gap-2">
          {/* <img
            src={image}
            alt={name}
            className="w-14 h-14 rounded-full object-cover ring-1 ring-gray-200"
          /> */}
          <span className="text-sm font-medium text-gray-800 break-words">
            {author_name}
          </span>
        </div>
      );
    },
  },
  {
    id: "totalBooks",
    header: () => (
      <span className="font-semibold text-gray-700 px-2">Total Books</span>
    ),
    accessorKey: "totalBooks",
    cell: ({ row }) => (
      <div className="text-center">
        <span className="text-sm px-2">{row.original.total_books}</span>
      </div>
    ),
  },
  {
    id: "unitsSold",
    header: () => (
      <div className="flex justify-center">
        <span className="font-semibold text-gray-700 px-2">Units Sold</span>
      </div>
    ),
    accessorKey: "unitsSold",
    cell: ({ row }) => (
      <div className="text-center">
        <span className="text-sm px-2">{row.original.units_sold}</span>
      </div>
    ),
  },
  {
    id: "totalRevenue",
    header: () => (
      <div className="flex justify-center">
        <span className="font-semibold text-gray-700 px-2">Total Revenue</span>
      </div>
    ),
    accessorKey: "totalRevenue",
    cell: ({ row }) => (
      <div className="text-center">
        <span className="text-sm px-2">{row.original.total_revenue}</span>
      </div>
    ),
  },
  {
    id: "sellingPrice",
    header: () => (
      <div className="flex justify-center">
        <span className="font-semibold text-gray-700 px-2">Selling Price</span>
      </div>
    ),
    accessorKey: "sellingPrice",
    cell: ({ row }) => (
      <div className="text-center">
        <span className="text-sm px-2">
          {row.original.selling_price_top_book}
        </span>
      </div>
    ),
  },

  {
    id: "topSellingBook",
    header: () => (
      <div className="flex justify-center">
        <span className="font-semibold text-gray-700 px-2">
          Top-Selling Book
        </span>
      </div>
    ),
    accessorKey: "topSellingBook",
    cell: ({ row }) => (
      <div className="text-center">
        <span className="text-sm px-2">{row.original.top_selling_book}</span>
      </div>
    ),
  },
  {
    id: "royalty",
    header: () => (
      <div className="flex justify-center">
        <span className="font-semibold text-gray-700 px-2">Royalty</span>
      </div>
    ),
    accessorKey: "royalty",
    cell: ({ row }) => (
      <div className="flex justify-center">
        <span className="text-sm py-2 px-2">{row.original.royalty}</span>
      </div>
    ),
  },
];

const AuthorReports = () => {
  const [view, setView] = useState("list");
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const { authorReports, statusAuthorReports, error } = useSelector(
    (state) => state.report
  );

  useEffect(() => {
    dispatch(fetchAuthorReports());
  }, []);

  // ✅ Filter the data based on the search term
  const filteredReports = authorReports?.filter((report) => {
    const term = searchTerm.toLowerCase();
    return (
      (report?.author_name || "").toLowerCase().includes(term) ||
      (report?.top_selling_book || "").toLowerCase().includes(term)
    );
  });

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Author Report", 14, 22);

    const tableData = filteredReports?.map((report) => [
      report.author_name,
      report.total_books,
      report.units_sold,
      report.total_revenue,
      report.selling_price_top_book,
      report.top_selling_book,
      report.royalty,
    ]);

    autoTable(doc, {
      startY: 30,
      head: [
        [
          "Name of User",
          "Total Books",
          "Units Sold",
          "Total Revenue",
          "Selling Price",
          "Top-Selling Book",
          "Royalty",
        ],
      ],
      body: tableData,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [246, 169, 32] },
    });

    doc.save("author-report.pdf");
  };

  return (
    <SuperAdminLayout
      header={
        <div className="w-full flex justify-between items-center ">
          <div className="flex flex-col px-4 mt-20 md:mt-0 py-6 justify-start items-start w-full">
            <div className="flex flex-col items-start gap-2">
              <h1 className="text-xl font-bold">Author Reports</h1>
              <p className="text-gray-500 text-sm">
                Insights into book sales, ratings, and trends by author.
              </p>
            </div>
          </div>
          <div className="flex gap-2 px-4">
            <Button variant="outline" className="cursor-pointer" onClick={handleDownloadPDF}>
              <FiDownload className="mr-2" />
              Download Report
            </Button>
          </div>
        </div>
      }
    >
      <div className="px-4 md:mt-8">
        <div>
          <div className="flex flex-col md:flex-row gap-4  my-4 items-start md:items-center justify-start md:justify-between bg-white">
            {/* Right: Search and Filter */}
            <div className="flex flex-col-reverse md:flex-row items-start md:items-center gap-2 w-[400px] max-w-full">
              <div className="relative w-[400px]">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={16}
                />
                <Input
                  type="text"
                  placeholder="Search ..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} // <-- Controlled input
                />
              </div>
            </div>
          </div>

          <div>
            <div className="py-2">
              <div className="bg-white border-[1px] rounded-lg w-full p-4 h-auto shadow-md">
                <div className="relative overflow-x-auto rounded-t-lg">
                  <TableComponent
                    data={filteredReports}
                    columns={authorColumns}
                    showPagination={true}
                    isLoading={statusAuthorReports === "loading"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default AuthorReports;
