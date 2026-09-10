import React, { useEffect, useMemo } from "react";
import { ArrowLeft, BookOpen, CalendarDays, CircleDollarSign, RefreshCw, ShoppingBag, TrendingUp, UserRound } from "lucide-react";
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { fetchBookReportDetail } from "@/redux/slices/reportSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SuperAdminLayout from "./DashboardLayout";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const num = (value) => Number(String(value ?? 0).replace(/[^0-9.-]/g, "")) || 0;
const money = (value, currency = "ngn") => new Intl.NumberFormat(currency.toLowerCase() === "usd" ? "en-US" : "en-NG", { style: "currency", currency: currency.toLowerCase() === "usd" ? "USD" : "NGN", maximumFractionDigits: 2 }).format(num(value));
const first = (...values) => values.find((value) => value !== undefined && value !== null && value !== "");

const BookReportDetail = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const year = searchParams.get("year") || "2026";
  const { bookReportDetail: response, statusBookReportDetail: status, error } = useSelector((state) => state.report);

  useEffect(() => { dispatch(fetchBookReportDetail({ bookId, year })); }, [bookId, year, dispatch]);

  const view = useMemo(() => {
    const root = response || {};
    const book = root.book || root.book_details || root.details || root;
    const summary = root.summary || root.stats || root.totals || root;
    const currency = first(book.currency, summary.currency, root.currency, "ngn");
    const seriesSource = first(root.monthly_sales, root.sales_by_month, root.monthly_report, root.graph, summary.monthly_sales, []);
    const series = monthNames.map((label, index) => {
      const entry = Array.isArray(seriesSource)
        ? seriesSource.find((item) => num(first(item.month_number, item.month, item.month_index)) === index + 1) || seriesSource[index]
        : seriesSource?.[index + 1] || seriesSource?.[label] || seriesSource?.[label.toLowerCase()];
      return { label, units: num(first(entry?.units_sold, entry?.sales, entry?.units, entry?.count, 0)), revenue: num(first(entry?.revenue, entry?.total_revenue, entry?.amount, 0)) };
    });
    const rows = first(root.sales, root.orders, root.transactions, root.recent_sales, root.records, []);
    return {
      book,
      summary,
      currency,
      series,
      rows: Array.isArray(rows) ? rows : [],
      title: first(book.title, book.name, "Book report"),
      author: first(book.author?.user?.name, book.author?.name, book.author_name, root.author, "Unknown author"),
      cover: first(book.cover_image, book.cover, book.image),
      units: num(first(summary.units_sold, summary.total_units_sold, root.units_sold, series.reduce((sum, item) => sum + item.units, 0))),
      revenue: num(first(summary.total_revenue, summary.revenue, root.total_revenue, series.reduce((sum, item) => sum + item.revenue, 0))),
      price: num(first(book.price, book.selling_price, summary.selling_price)),
      status: first(book.status, root.status),
    };
  }, [response]);

  const chartData = { labels: monthNames, datasets: [{ label: "Units sold", data: view.series.map((item) => item.units), backgroundColor: "#F6B51B", borderRadius: 7, borderSkipped: false, barThickness: 20 }] };
  const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { backgroundColor: "#172033", padding: 12, cornerRadius: 10 } }, scales: { x: { grid: { display: false }, border: { display: false }, ticks: { color: "#94A3B8" } }, y: { beginAtZero: true, border: { display: false }, grid: { color: "#EEF1F5" }, ticks: { color: "#94A3B8", precision: 0 } } } };
  const loading = status === "loading" || status === "idle";
  const coverUrl = view.cover ? (String(view.cover).startsWith("http") ? view.cover : `https://test.amber-hive.com/storage/${view.cover}`) : null;

  return <SuperAdminLayout header={<div className="flex w-full items-center justify-between px-4 py-6"><div><h1 className="text-xl font-semibold text-slate-900">Book performance</h1><p className="mt-1 text-sm text-slate-500">Detailed sales and revenue report for {year}.</p></div><Select value={year} onValueChange={(value) => setSearchParams({ year: value })}><SelectTrigger className="w-28 rounded-xl"><CalendarDays className="h-4 w-4" /><SelectValue /></SelectTrigger><SelectContent>{[2026, 2025, 2024, 2023].map((item) => <SelectItem key={item} value={String(item)}>{item}</SelectItem>)}</SelectContent></Select></div>}>
    <main className="min-h-full bg-[#F7F8FA] px-4 pb-16 pt-8 md:px-6 md:pt-12">
      <button onClick={() => navigate(-1)} className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"><ArrowLeft className="h-4 w-4" />Back to book reports</button>
      {loading ? <div className="space-y-5"><Skeleton className="h-44 rounded-2xl" /><div className="grid gap-4 sm:grid-cols-3">{[1, 2, 3].map((item) => <Skeleton key={item} className="h-32 rounded-2xl" />)}</div><Skeleton className="h-80 rounded-2xl" /></div> : status === "failed" ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700"><h2 className="font-semibold">Unable to load this report</h2><p className="mt-1 text-sm">{error}</p><button onClick={() => dispatch(fetchBookReportDetail({ bookId, year }))} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold"><RefreshCw className="h-4 w-4" />Try again</button></div> : <>
        <section className="mb-5 flex flex-col gap-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
          {coverUrl ? <img src={coverUrl} alt={view.title} className="h-32 w-24 rounded-xl object-cover shadow-md" /> : <div className="flex h-32 w-24 items-center justify-center rounded-xl bg-slate-100 text-slate-400"><BookOpen className="h-7 w-7" /></div>}
          <div className="min-w-0 flex-1"><div className="mb-2 flex flex-wrap items-center gap-2"><Badge className={view.status ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}>{view.status ? "Published" : "Unpublished"}</Badge><span className="text-xs text-slate-400">Report year {year}</span></div><h2 className="truncate text-2xl font-semibold text-slate-900">{view.title}</h2><p className="mt-2 flex items-center gap-2 text-sm text-slate-500"><UserRound className="h-4 w-4" />{view.author}</p></div>
        </section>
        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">{[
          ["Units sold", view.units.toLocaleString(), ShoppingBag, "bg-amber-50 text-amber-600"],
          ["Total revenue", money(view.revenue, view.currency), TrendingUp, "bg-emerald-50 text-emerald-600"],
          ["Selling price", money(view.price, view.currency), CircleDollarSign, "bg-blue-50 text-blue-600"],
        ].map(([label, value, icon, tone]) => <article key={label} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-sm text-slate-500">{label}</p><p className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">{value}</p></div><span className={`rounded-xl p-2.5 ${tone}`}>{React.createElement(icon, { className: "h-4 w-4" })}</span></div></article>)}
        </div>
        <section className="mb-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"><div className="mb-5"><h2 className="font-semibold text-slate-900">Monthly sales</h2><p className="mt-1 text-xs text-slate-400">Units sold from January to December {year}</p></div><div className="h-72"><Bar data={chartData} options={chartOptions} /></div></section>
        {view.rows.length > 0 && <section className="mb-8 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"><div className="border-b border-slate-100 p-5"><h2 className="font-semibold text-slate-900">Sales activity</h2><p className="mt-1 text-xs text-slate-400">Individual records returned for this report</p></div><div className="overflow-x-auto p-4"><table className="w-full min-w-[620px] text-left text-sm"><thead><tr className="border-b text-xs uppercase tracking-wide text-slate-400"><th className="px-3 py-3">Date</th><th className="px-3 py-3">Reference</th><th className="px-3 py-3">Units</th><th className="px-3 py-3">Amount</th><th className="px-3 py-3">Status</th></tr></thead><tbody>{view.rows.map((row, index) => <tr key={first(row.id, row.reference, index)} className="border-b border-slate-100 last:border-0"><td className="whitespace-nowrap px-3 py-4 text-slate-500">{first(row.date, row.created_at, row.sale_date, "—")}</td><td className="px-3 py-4 font-medium text-slate-700">{first(row.reference, row.order_id, row.transaction_id, "—")}</td><td className="px-3 py-4 text-slate-600">{first(row.units, row.quantity, row.units_sold, 1)}</td><td className="px-3 py-4 font-semibold text-slate-800">{money(first(row.amount, row.revenue, row.total, 0), first(row.currency, view.currency))}</td><td className="px-3 py-4"><Badge variant="secondary" className="capitalize">{first(row.status, "completed")}</Badge></td></tr>)}</tbody></table></div></section>}
      </>}
    </main>
  </SuperAdminLayout>;
};

export default BookReportDetail;
