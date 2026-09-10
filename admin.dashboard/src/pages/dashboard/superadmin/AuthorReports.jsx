import React, { useEffect, useMemo, useState } from "react";
import { BookOpen, Download, Search, ShoppingBag, TrendingUp, UserRound, UsersRound, X } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useDispatch, useSelector } from "react-redux";
import SuperAdminLayout from "./DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TableComponent from "@/components/TableComponent";
import { fetchAuthorReports } from "@/redux/slices/reportSlice";

const numeric = (value) => Number(String(value ?? 0).replace(/[^0-9.-]/g, "")) || 0;
const count = (value) => numeric(value).toLocaleString();
const valueDisplay = (value) => {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "string" && /[$₦€£]/.test(value)) return value;
  return numeric(value).toLocaleString(undefined, { maximumFractionDigits: 2 });
};

const authorColumns = [
  {
    id: "author",
    header: () => <span className="font-semibold text-slate-600">Author</span>,
    accessorKey: "author_name",
    cell: ({ row }) => {
      const name = row.original.author_name || "Unknown author";
      return <div className="flex min-w-[210px] items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 font-semibold text-amber-700">{name.slice(0, 2).toUpperCase()}</span><div className="min-w-0"><p className="truncate font-semibold text-slate-800" title={name}>{name}</p><p className="mt-0.5 text-xs text-slate-400">Author report</p></div></div>;
    },
  },
  {
    id: "totalBooks",
    header: () => <span className="font-semibold text-slate-600">Books</span>,
    accessorKey: "total_books",
    cell: ({ row }) => <span className="text-sm font-semibold tabular-nums text-slate-700">{count(row.original.total_books)}</span>,
  },
  {
    id: "unitsSold",
    header: () => <span className="font-semibold text-slate-600">Units sold</span>,
    accessorKey: "units_sold",
    cell: ({ row }) => <span className="text-sm font-semibold tabular-nums text-slate-700">{count(row.original.units_sold)}</span>,
  },
  {
    id: "totalRevenue",
    header: () => <span className="font-semibold text-slate-600">Revenue</span>,
    accessorKey: "total_revenue",
    cell: ({ row }) => <span className="whitespace-nowrap text-sm font-semibold tabular-nums text-slate-800">{valueDisplay(row.original.total_revenue)}</span>,
  },
  {
    id: "royalty",
    header: () => <span className="font-semibold text-slate-600">Royalty</span>,
    accessorKey: "royalty",
    cell: ({ row }) => <span className="whitespace-nowrap text-sm tabular-nums text-slate-600">{valueDisplay(row.original.royalty)}</span>,
  },
  {
    id: "topSellingBook",
    header: () => <span className="font-semibold text-slate-600">Top-selling book</span>,
    accessorKey: "top_selling_book",
    cell: ({ row }) => <div className="min-w-[190px]"><p className="max-w-[220px] truncate text-sm font-medium text-slate-700" title={row.original.top_selling_book}>{row.original.top_selling_book || "No sales yet"}</p>{row.original.top_selling_book && <Badge variant="secondary" className="mt-1.5 bg-blue-50 text-[10px] text-blue-600 hover:bg-blue-50">Top title</Badge>}</div>,
  },
  {
    id: "sellingPrice",
    header: () => <span className="font-semibold text-slate-600">Top-book price</span>,
    accessorKey: "selling_price_top_book",
    cell: ({ row }) => <span className="whitespace-nowrap text-sm tabular-nums text-slate-600">{valueDisplay(row.original.selling_price_top_book)}</span>,
  },
];

const AuthorReports = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("units");
  const { authorReports, statusAuthorReports, error } = useSelector((state) => state.report);

  useEffect(() => { dispatch(fetchAuthorReports()); }, [dispatch]);

  const reports = useMemo(() => Array.isArray(authorReports) ? authorReports : [], [authorReports]);
  const filteredReports = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return reports.filter((report) => !term || (report.author_name || "").toLowerCase().includes(term) || (report.top_selling_book || "").toLowerCase().includes(term)).sort((a, b) => {
      if (sortBy === "books") return numeric(b.total_books) - numeric(a.total_books);
      if (sortBy === "revenue") return numeric(b.total_revenue) - numeric(a.total_revenue);
      if (sortBy === "name") return String(a.author_name || "").localeCompare(String(b.author_name || ""));
      return numeric(b.units_sold) - numeric(a.units_sold);
    });
  }, [reports, searchTerm, sortBy]);

  const totals = useMemo(() => reports.reduce((result, report) => ({ books: result.books + numeric(report.total_books), units: result.units + numeric(report.units_sold), revenue: result.revenue + numeric(report.total_revenue) }), { books: 0, units: 0, revenue: 0 }), [reports]);
  const topAuthor = [...reports].sort((a, b) => numeric(b.units_sold) - numeric(a.units_sold))[0];

  const handleDownloadPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(18);
    doc.text("Author Performance Report", 14, 18);
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Generated ${new Date().toLocaleDateString()} • ${filteredReports.length} authors`, 14, 25);
    autoTable(doc, { startY: 31, head: [["Author", "Books", "Units sold", "Revenue", "Royalty", "Top-selling book", "Top-book price"]], body: filteredReports.map((report) => [report.author_name || "—", report.total_books || 0, report.units_sold || 0, report.total_revenue || 0, report.royalty || 0, report.top_selling_book || "—", report.selling_price_top_book || 0]), styles: { fontSize: 8, cellPadding: 3 }, headStyles: { fillColor: [23, 32, 51] }, alternateRowStyles: { fillColor: [248, 250, 252] } });
    doc.save("author-performance-report.pdf");
  };

  const loading = statusAuthorReports === "loading" || statusAuthorReports === "idle";

  return <SuperAdminLayout header={<div className="flex w-full items-center justify-between px-4 py-6"><div><h1 className="text-xl font-semibold text-slate-900">Author reports</h1><p className="mt-1 text-sm text-slate-500">Compare author portfolios, sales, revenue, and royalties.</p></div><Button variant="outline" className="hidden h-10 cursor-pointer rounded-xl border-slate-200 sm:inline-flex" onClick={handleDownloadPDF} disabled={loading || filteredReports.length === 0}><Download className="mr-2 h-4 w-4" />Export PDF</Button></div>}>
    <div className="min-h-full bg-[#F7F8FA] px-4 pb-16 pt-8 md:px-6 md:pt-12">
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{[
        ["Total authors", count(reports.length), UsersRound, "bg-blue-50 text-blue-600", "Authors in this report"],
        ["Published books", count(totals.books), BookOpen, "bg-violet-50 text-violet-600", "Across all authors"],
        ["Units sold", count(totals.units), ShoppingBag, "bg-amber-50 text-amber-600", "Combined sales volume"],
        ["Top author", topAuthor?.author_name || "—", TrendingUp, "bg-emerald-50 text-emerald-600", topAuthor ? `${count(topAuthor.units_sold)} units sold` : "No sales data"],
      ].map(([label, value, icon, tone, note]) => <article key={label} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,.03)]"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 truncate text-2xl font-semibold tracking-tight text-slate-900" title={String(value)}>{value}</p><p className="mt-2 text-xs text-slate-400">{note}</p></div><span className={`shrink-0 rounded-xl p-2.5 ${tone}`}>{React.createElement(icon, { className: "h-4 w-4" })}</span></div></article>)}
      </div>

      <section className="mb-8 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,.03)]">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between"><div><h2 className="font-semibold text-slate-900">Author performance</h2><p className="mt-1 text-xs text-slate-400">Showing {filteredReports.length} of {reports.length} authors</p></div><div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto"><div className="relative min-w-0 sm:w-72"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><Input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search author or top book" className="h-10 rounded-xl border-slate-200 bg-slate-50 pl-9 pr-9 focus:bg-white" />{searchTerm && <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700" aria-label="Clear search"><X className="h-4 w-4" /></button>}</div><Select value={sortBy} onValueChange={setSortBy}><SelectTrigger className="h-10 w-full rounded-xl border-slate-200 sm:w-44"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="units">Most units sold</SelectItem><SelectItem value="revenue">Highest revenue</SelectItem><SelectItem value="books">Most books</SelectItem><SelectItem value="name">Author A–Z</SelectItem></SelectContent></Select><Button variant="outline" className="h-10 rounded-xl sm:hidden" onClick={handleDownloadPDF} disabled={loading || filteredReports.length === 0}><Download className="mr-2 h-4 w-4" />Export PDF</Button></div></div>
        {error && statusAuthorReports === "failed" ? <div className="m-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"><p className="font-semibold">Unable to load author reports</p><p className="mt-1">{error}</p><button onClick={() => dispatch(fetchAuthorReports())} className="mt-3 font-semibold">Try again</button></div> : <div className="px-2 pb-8 pt-2 sm:px-4 sm:pt-4"><TableComponent data={filteredReports} columns={authorColumns} showPagination isLoading={loading} /></div>}
      </section>
    </div>
  </SuperAdminLayout>;
};

export default AuthorReports;
