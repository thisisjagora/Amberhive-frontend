import React, { useEffect, useState } from "react";
import SuperAdminLayout from "./DashboardLayout";
import { BookOpen, CircleDollarSign, LibraryBig, Search, ShoppingBag, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import TableComponent from "@/components/TableComponent";
import { Badge } from "@/components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { fetchBookReports } from "@/redux/slices/reportSlice";
import { formatDate } from "@/utils/format";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formatMoney = (amount, currency) => new Intl.NumberFormat(
  currency?.toLowerCase() === "ngn" ? "en-NG" : "en-US",
  { style: "currency", currency: currency?.toLowerCase() === "ngn" ? "NGN" : "USD", maximumFractionDigits: 2 }
).format(Number(amount) || 0);

const bookColumns = [
  {
    id: "name",
    header: () => (
      <span className="font-semibold text-gray-700">Name of Book</span>
    ),
    accessorKey: "name",
    cell: ({ row }) => {
      const { cover_image, title } = row.original;
      return (
        <div className="flex min-w-[230px] items-center gap-3">
          {cover_image ? (
            <img
              src={`https://test.amber-hive.com/storage/${cover_image}`}
              alt={title}
              className="h-14 w-10 rounded-md object-cover shadow-sm ring-1 ring-slate-200"
            />
          ) : (
            <div className="flex h-14 w-10 items-center justify-center rounded-md bg-slate-100 text-slate-400"><BookOpen className="h-4 w-4" /></div>
          )}
          <div><p className="max-w-[190px] truncate font-semibold text-slate-800" title={title}>{title || "Untitled book"}</p><p className="mt-1 text-xs text-slate-400">{row.original?.id ? `ID #${row.original.id}` : "Book report"}</p></div>
        </div>
      );
    },
  },
  {
    id: "author",
    header: () => (
      <span className="font-semibold text-gray-700 px-2">Author</span>
    ),
    accessorKey: "author",
    cell: ({ row }) => (
      <span className="block max-w-[150px] truncate px-2 text-sm font-medium text-slate-600">{row.original?.author?.user?.name || "—"}</span>
    ),
  },
  {
    id: "category",
    header: () => (
      <span className="font-semibold text-gray-700 px-2">Category</span>
    ),
    accessorKey: "categories",
    cell: ({ row }) => {
      const categories = row.original.categories;
      const firstCategory = categories?.[0]?.name || "—";
      return <Badge variant="secondary" className="bg-slate-100 font-medium text-slate-600 hover:bg-slate-100">{firstCategory}</Badge>;
    },
  },
  {
    id: "unitsSold",
    header: () => (
      <span className="font-semibold text-gray-700 px-2">Units Sold</span>
    ),
    accessorKey: "unitsSold",
    cell: ({ row }) => (
      <span className="px-2 text-sm font-semibold tabular-nums text-slate-700">{Number(row.original.units_sold || 0).toLocaleString()}</span>
    ),
  },
{
  id: "sellingPrice",
  header: () => (
    <span className="font-semibold text-gray-700 px-2">Selling Price</span>
  ),
  accessorKey: "selling_price",
  cell: ({ row }) => {
    const price = row.original.price || 0;
    return <span className="px-2 text-sm tabular-nums text-slate-600">{formatMoney(price, row.original.currency)}</span>;
  },
},

  {
    id: "totalRevenue",
    accessorKey: "total_revenue",
    header: () => (
      <span className="font-semibold text-gray-700 px-2">Total Revenue</span>
    ),
    cell: ({ row }) => {
      const totalRevenue = row.original.total_revenue || 0;
      return <span className="px-2 text-sm font-semibold tabular-nums text-slate-800">{formatMoney(totalRevenue, row.original.currency)}</span>;
    },
  },

  {
    id: "dateAdded",
    header: () => (
      <span className="font-semibold text-gray-700 px-2">Date Published</span>
    ),
    accessorKey: "dateAdded",
    cell: ({ row }) => (
      <span className="whitespace-nowrap px-2 text-sm text-slate-500">
        {formatDate(row.original.published_at)}
      </span>
    ),
  },
  {
    id: "status",
    header: () => (
      <span className="font-semibold text-gray-700 px-2">Status</span>
    ),
    accessorKey: "status",
    cell: ({ row }) => {
      const isPublished = row.original.status;

      return (
        <Badge
          className={`rounded-full border-0 px-2.5 py-1 text-xs font-semibold ${
            isPublished
              ? "bg-emerald-50 text-emerald-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {isPublished ? "Published" : "Unpublished"}
        </Badge>
      );
    },
  },
];

const BookReports = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { bookReports, statusBookReports, error } = useSelector(
    (state) => state.report
  );

  useEffect(() => {
    dispatch(fetchBookReports());
  }, [dispatch]);

  // ✅ Filter the data based on the search term
  const reports = Array.isArray(bookReports) ? bookReports : [];
  const filteredReports = reports.filter((report) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = (
      (report?.author?.user?.name || "").toLowerCase().includes(term) ||
      (report?.title || "").toLowerCase().includes(term) ||
      (report?.categories?.[0]?.name || "").toLowerCase().includes(term)
    );
    const matchesStatus = statusFilter === "all" || (statusFilter === "published" ? Boolean(report.status) : !report.status);
    return matchesSearch && matchesStatus;
  });

  const totalUnits = reports.reduce((sum, report) => sum + Number(report.units_sold || 0), 0);
  const published = reports.filter((report) => Boolean(report.status)).length;
  const ngnRevenue = reports.filter((report) => report.currency?.toLowerCase() === "ngn").reduce((sum, report) => sum + Number(report.total_revenue || 0), 0);

  return (
    <SuperAdminLayout
      header={
        <div className="flex w-full flex-col items-start px-4 py-6 md:mt-0"><h1 className="text-xl font-semibold text-slate-900">Book reports</h1><p className="mt-1 text-sm text-slate-500">Monitor publishing status, units sold, and revenue by title.</p></div>
      }
    >
      <div className="min-h-full bg-[#F7F8FA] px-4 pb-16 pt-8 md:px-6 md:pt-12">
        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Total books", reports.length.toLocaleString(), LibraryBig, "bg-blue-50 text-blue-600"],
            ["Published", published.toLocaleString(), BookOpen, "bg-emerald-50 text-emerald-600"],
            ["Units sold", totalUnits.toLocaleString(), ShoppingBag, "bg-amber-50 text-amber-600"],
            ["NGN revenue", formatMoney(ngnRevenue, "ngn"), CircleDollarSign, "bg-violet-50 text-violet-600"],
          ].map(([label, value, icon, tone]) => <div key={label} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,.03)]"><div className="flex items-start justify-between"><div><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{value}</p></div><span className={`rounded-xl p-2.5 ${tone}`}>{React.createElement(icon, { className: "h-4 w-4" })}</span></div></div>)}
        </div>

        <section className="mb-8 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,.03)]">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div><h2 className="font-semibold text-slate-900">All book reports</h2><p className="mt-1 text-xs text-slate-400">Showing {filteredReports.length} of {reports.length} books</p></div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <div className="relative min-w-0 sm:w-72"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><Input type="text" placeholder="Search title, author or category" className="h-10 rounded-xl border-slate-200 bg-slate-50 pl-9 pr-9 focus:bg-white" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />{searchTerm && <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700" aria-label="Clear search"><X className="h-4 w-4" /></button>}</div>
              <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="h-10 w-full rounded-xl border-slate-200 bg-white sm:w-36"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="published">Published</SelectItem><SelectItem value="unpublished">Unpublished</SelectItem></SelectContent></Select>
            </div>
          </div>
          {error && statusBookReports === "failed" ? <div className="m-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">Unable to load book reports: {error}</div> : <div className="px-2 pb-6 pt-2 sm:px-4 sm:pb-8 sm:pt-4"><TableComponent data={filteredReports} columns={bookColumns} showPagination isLoading={statusBookReports === "loading"} onRowClick={(book) => navigate(`/super-admin/reports/book-reports/${book.id}?year=2026`)} /></div>}
        </section>
      </div>
    </SuperAdminLayout>
  );
};

export default BookReports;
