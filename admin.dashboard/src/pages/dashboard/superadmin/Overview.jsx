import React, { useEffect, useMemo } from "react";
import { Activity, ArrowDownRight, ArrowUpRight, BookOpenCheck, CircleDollarSign, Clock3, RefreshCw, UsersRound, WalletCards } from "lucide-react";
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, DoughnutController, Filler, Legend, LinearScale, LineElement, PointElement, Tooltip } from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { fetchSuperAdminDashboard } from "@/redux/slices/dashboardSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNaira } from "@/utils/format";
import SuperAdminLayout from "./DashboardLayout";

ChartJS.register(LineElement, PointElement, BarElement, ArcElement, DoughnutController, LinearScale, CategoryScale, Filler, Tooltip, Legend);

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const palette = { amber: "#F6B51B", blue: "#3974E9", green: "#2E9D73", coral: "#E86F51" };
const toNumber = (value) => Number(String(value ?? 0).replace(/[^0-9.-]/g, "")) || 0;

const Trend = ({ value = 0, trend = "up" }) => {
  const positive = trend === "up" || toNumber(value) === 0;
  const Icon = positive ? ArrowUpRight : ArrowDownRight;
  return <div className="flex items-center gap-1.5 text-xs"><span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-1 font-semibold ${positive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}><Icon className="h-3 w-3" />{Math.abs(toNumber(value))}%</span><span className="text-slate-400">vs last month</span></div>;
};

const MetricCard = ({ title, value, metric, icon: Icon, tone = "amber", badge }) => (
  <article className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition hover:-translate-y-0.5 hover:shadow-md">
    <div className="mb-5 flex items-start justify-between gap-3"><p className="text-sm font-medium leading-5 text-slate-500">{title}</p>{Icon ? <span className={`rounded-xl p-2.5 ${tone === "blue" ? "bg-blue-50 text-blue-600" : tone === "green" ? "bg-emerald-50 text-emerald-600" : tone === "coral" ? "bg-orange-50 text-orange-600" : "bg-amber-50 text-amber-600"}`}><Icon className="h-4 w-4" /></span> : badge ? <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">{badge}</span> : null}</div>
    <p className="mb-3 truncate text-[26px] font-semibold tracking-tight text-slate-900" title={String(value)}>{value}</p>
    {metric ? <Trend value={metric.change_percent} trend={metric.trend} /> : <span className="text-xs text-slate-400">Lifetime performance</span>}
  </article>
);

const Panel = ({ title, subtitle, action, children, className = "" }) => <section className={`rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] ${className}`}><div className="mb-5 flex items-start justify-between gap-4"><div><h2 className="text-base font-semibold text-slate-900">{title}</h2><p className="mt-1 text-xs text-slate-400">{subtitle}</p></div>{action}</div>{children}</section>;

const Overview = () => {
  const dispatch = useDispatch();
  const { superAdminDash: data, statusSuperAdminDash: status, error } = useSelector((state) => state.dashboard);
  useEffect(() => { dispatch(fetchSuperAdminDashboard()); }, [dispatch]);

  const analytics = useMemo(() => {
    const graph = data?.graph || {};
    return {
      buyers: months.map((_, i) => toNumber(graph[i + 1]?.user)),
      authors: months.map((_, i) => toNumber(graph[i + 1]?.author)),
      admins: months.map((_, i) => toNumber(graph[i + 1]?.admin)),
    };
  }, [data]);

  const chartOptions = { responsive: true, maintainAspectRatio: false, interaction: { mode: "index", intersect: false }, plugins: { legend: { position: "top", align: "end", labels: { usePointStyle: true, pointStyle: "circle", boxWidth: 7, boxHeight: 7, padding: 18, color: "#64748B", font: { family: "Gilroy-Semibold", size: 11 } } }, tooltip: { backgroundColor: "#172033", padding: 12, cornerRadius: 10 } }, scales: { x: { grid: { display: false }, border: { display: false }, ticks: { color: "#94A3B8", font: { size: 11 } } }, y: { beginAtZero: true, border: { display: false }, grid: { color: "#EEF1F5" }, ticks: { color: "#94A3B8", precision: 0, font: { size: 11 } } } } };
  const growthData = { labels: months, datasets: [
    { label: "Buyers", data: analytics.buyers, borderColor: palette.amber, backgroundColor: "rgba(246,181,27,.12)", fill: true, tension: .42, pointRadius: 0, pointHoverRadius: 4, borderWidth: 2.5 },
    { label: "Authors", data: analytics.authors, borderColor: palette.blue, backgroundColor: "transparent", tension: .42, pointRadius: 0, pointHoverRadius: 4, borderWidth: 2.5 },
    { label: "Admins", data: analytics.admins, borderColor: palette.green, backgroundColor: "transparent", tension: .42, pointRadius: 0, pointHoverRadius: 4, borderWidth: 2.5 },
  ] };
  const compositionValues = [toNumber(data?.users?.current), toNumber(data?.authors?.current), analytics.admins.reduce((a, b) => a + b, 0)];
  const compositionData = { labels: ["Buyers", "Authors", "Admins"], datasets: [{ data: compositionValues, backgroundColor: [palette.amber, palette.blue, palette.green], borderWidth: 0, hoverOffset: 5 }] };
  const doughnutOptions = { responsive: true, maintainAspectRatio: false, cutout: "72%", plugins: { legend: { display: false }, tooltip: chartOptions.plugins.tooltip } };
  const operationsData = { labels: ["Books reviewed", "Sales", "Pending reviews"], datasets: [{ data: [toNumber(data?.total_books_reviewed?.current), toNumber(data?.total_sales?.current), toNumber(data?.pending_review_requests)], backgroundColor: [palette.blue, palette.amber, palette.coral], borderRadius: 8, borderSkipped: false, barThickness: 22 }] };
  const operationsOptions = { ...chartOptions, indexAxis: "y", plugins: { ...chartOptions.plugins, legend: { display: false } }, scales: { x: chartOptions.scales.y, y: chartOptions.scales.x } };
  const loading = status === "loading" || status === "idle";
  const refresh = () => dispatch(fetchSuperAdminDashboard());
  const today = new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(new Date());

  const cards = [
    ["Monthly Earnings", formatNaira(data?.total_earningsNGN?.current ?? 0), data?.total_earningsNGN, CircleDollarSign, "green"],
    ["Monthly Royalties", formatNaira(data?.total_royaltiesNGN?.current ?? 0), data?.total_royaltiesNGN, WalletCards, "blue"],
    ["Total Revenue to Date (NGN)", formatNaira(data?.total_revenue_to_date?.NGN ?? 0), null, null, null, "To date"],
    ["Royalties Paid to Date (NGN)", formatNaira(data?.total_royalties_paid_to_date?.NGN ?? 0), null, null, null, "To date"],
    ["Books Reviewed This Month", data?.total_books_reviewed?.current ?? 0, data?.total_books_reviewed, BookOpenCheck, "blue"],
    ["Monthly Users", data?.users?.current ?? 0, data?.users, UsersRound, "amber"],
    ["Monthly Authors", data?.authors?.current ?? 0, data?.authors, UsersRound, "green"],
    ["Monthly Sales", data?.total_sales?.current ?? 0, data?.total_sales, Activity, "coral"],
    ["Monthly Payouts", formatNaira(data?.total_payoutsNGN?.current ?? 0), data?.total_payoutsNGN, WalletCards, "coral"],
    ["Pending Review Requests", data?.pending_review_requests ?? 0, { change_percent: 0, trend: "up" }, Clock3, "amber"],
  ];

  return <SuperAdminLayout header={<div className="flex w-full items-center justify-between px-4 py-6"><div><h1 className="text-xl font-semibold text-slate-900">Dashboard overview</h1><p className="mt-1 text-sm text-slate-500">A clear view of platform performance and activity.</p></div><div className="hidden items-center gap-2 md:flex"><span className="mr-2 text-xs text-slate-400">Updated {today}</span><button onClick={refresh} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />Refresh</button></div></div>}>
    <div className="min-h-full bg-[#F7F8FA] px-4 pb-10 pt-8 md:px-6 md:pt-4">
      {error && status === "failed" && <div className="mb-4 flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"><span>Dashboard data could not be refreshed. {error}</span><button onClick={refresh} className="font-semibold">Try again</button></div>}
      {loading ? <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}</div> : <>
        <div className="mb-4 flex items-end justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-amber-600">Performance snapshot</p><h2 className="mt-1 text-lg font-semibold text-slate-900">Key financials</h2></div><span className="hidden text-xs text-slate-400 sm:block">Compared with the previous month</span></div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{cards.slice(0, 2).map(([title, value, metric, icon, tone, badge]) => <MetricCard key={title} title={title} value={value} metric={metric} icon={icon} tone={tone} badge={badge} />)}</div>
        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
          <Panel title="Platform growth" subtitle="Monthly active accounts by user type" className="xl:col-span-2" action={<span className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-[11px] font-medium text-slate-500">Last 12 months</span>}><div className="h-[310px]"><Line data={growthData} options={chartOptions} /></div></Panel>
          <Panel title="Audience composition" subtitle="Current platform account mix"><div className="relative mx-auto h-[205px] max-w-[240px]"><Doughnut data={compositionData} options={doughnutOptions} /><div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><span className="text-2xl font-semibold text-slate-900">{compositionValues.reduce((a, b) => a + b, 0).toLocaleString()}</span><span className="text-[11px] text-slate-400">total accounts</span></div></div><div className="mt-5 space-y-3">{compositionData.labels.map((label, i) => <div key={label} className="flex items-center justify-between text-xs"><span className="flex items-center gap-2 text-slate-500"><i className="h-2 w-2 rounded-full" style={{ backgroundColor: compositionData.datasets[0].backgroundColor[i] }} />{label}</span><strong className="text-slate-800">{compositionValues[i].toLocaleString()}</strong></div>)}</div></Panel>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3"><Panel title="Operational activity" subtitle="Monthly volume across core marketplace workflows"><div className="h-[230px]"><Bar data={operationsData} options={operationsOptions} /></div></Panel><Panel title="Cumulative financials" subtitle="Lifetime NGN revenue and royalties paid" className="xl:col-span-2"><div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{cards.slice(2, 4).map(([title, value, metric, icon, tone, badge]) => <MetricCard key={title} title={title} value={value} metric={metric} icon={icon} tone={tone} badge={badge} />)}</div></Panel></div>
        <div className="mb-4 mt-7"><p className="text-xs font-semibold uppercase tracking-[.16em] text-blue-600">Marketplace health</p><h2 className="mt-1 text-lg font-semibold text-slate-900">Operations & activity</h2></div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.slice(4).map(([title, value, metric, icon, tone, badge]) => <MetricCard key={title} title={title} value={value} metric={metric} icon={icon} tone={tone} badge={badge} />)}</div>
      </>}
    </div>
  </SuperAdminLayout>;
};

export default Overview;
