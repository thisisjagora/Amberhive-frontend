import React, { useEffect } from "react";

import StatCard from "@/components/dashboard/StatCard";

import SuperAdminLayout from "./DashboardLayout";

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { fetchSuperAdminDashboard } from "@/redux/slices/dashboardSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNaira } from "@/utils/format";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend
);

const labels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// const options = {
//   responsive: true,
//   maintainAspectRatio: false,
//   plugins: {
//     legend: {
//       position: "top",
//       align: "end",
//       labels: {
//         usePointStyle: true,
//         pointStyle: "circle",
//         boxWidth: 8,
//         boxHeight: 8,
//         padding: 20,
//         font: {
//           family: "Gilroy-Semibold",
//         },
//       },
//     },
//     tooltip: {
//       mode: "index",
//       intersect: false,
//     },
//   },
//   interaction: {
//     mode: "nearest",
//     axis: "x",
//     intersect: false,
//   },
//   scales: {
//     y: {
//       beginAtZero: true,
//       min: 0,
//       max: 50,
//       ticks: {
//         stepSize: 10,
//         font: {
//           family: "Gilroy-Semibold",
//           size: 14,
//         },
//       },
//       title: {
//         display: true,
//         text: "Active users",
//         font: {
//           family: "Gilroy-Semibold",
//           size: 14,
//         },
//       },
//       grid: {
//         display: false,
//       },
//     },
//     x: {
//       title: {
//         display: true,
//         text: "Month",
//       },
//       ticks: {
//         font: {
//           family: "Gilroy-Semibold",
//           size: 14,
//         },
//       },
//       grid: {
//         display: false,
//       },
//     },
//   },
// };

const StatCardSkeleton = () => (
  <div className="bg-white border p-4 rounded-lg shadow-sm flex flex-col gap-2">
    <Skeleton className="w-24 h-4" />
    <Skeleton className="w-16 h-6" />
    <Skeleton className="w-12 h-4" />
  </div>
);

const Overview = () => {
  const dispatch = useDispatch();
  const { superAdminDash, statusSuperAdminDash, error } = useSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    dispatch(fetchSuperAdminDashboard());
  }, [dispatch]);

  // console.log(superAdminDash);

  const graphData = superAdminDash?.graph || {};

  const buyersData = [];
  const authorsData = [];
  const adminsData = [];

  for (let i = 1; i <= 12; i++) {
    const monthData = graphData[i] || { user: 0, author: 0, admin: 0 };
    buyersData.push(monthData.user);
    authorsData.push(monthData.author);
    adminsData.push(monthData.admin);
  }
  const allValues = [...buyersData, ...authorsData, ...adminsData];
  const highestValue = Math.max(...allValues);

  const roundedMax = Math.ceil(highestValue / 10) * 10;

  const chartData = {
    labels,
    datasets: [
      {
        label: "Authors",
        data: authorsData,
        fill: true,
        borderColor: "#f59e0b", // amber-500
        backgroundColor: "rgba(245, 158, 11, 0.03)",
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: "Buyers",
        data: buyersData,
        fill: true,
        borderColor: "#facc15", // yellow-400
        backgroundColor: "rgba(250, 204, 21, 0.03)",
        tension: 0.4,
        pointRadius: 0,
      },
      {
        label: "Admins",
        data: adminsData,
        fill: true,
        borderColor: "#92400e",
        backgroundColor: "rgba(146, 64, 14, 0.01)",
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 8,
          boxHeight: 8,
          padding: 20,
          font: {
            family: "Gilroy-Semibold",
          },
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: roundedMax, // ⬅️ dynamic max here
        ticks: {
          stepSize: 10,
          font: {
            family: "Gilroy-Semibold",
            size: 14,
          },
        },
        title: {
          display: true,
          text: "Active users",
          font: {
            family: "Gilroy-Semibold",
            size: 14,
          },
        },
        grid: {
          display: false,
        },
      },
      x: {
        title: {
          display: true,
          text: "Month",
        },
        ticks: {
          font: {
            family: "Gilroy-Semibold",
            size: 14,
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <SuperAdminLayout
      header={
        <div className="flex flex-col px-4 mt-20 md:mt-0 py-6 justify-start items-start w-full">
          <div className="flex flex-col items-start gap-2">
            <h1 className="text-xl font-bold">Hi, Super Admin</h1>
            <p className="text-gray-500 text-sm">
              Track, manage and make insights on your dashboard
            </p>
          </div>
        </div>
      }
    >
      <div className="px-4 md:mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:mt-4 mt-12">
          {statusSuperAdminDash === "loading" ? (
            Array.from({ length: 8 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))
          ) : (
            <>
              <StatCard
                title="Total Earnings (USD)"
                amount={`$${
                  superAdminDash?.total_earningsUSD?.current || "0.00"
                }`}
                changeText={`${
                  superAdminDash?.total_earningsUSD?.change_percent || 0
                }%`}
                changeType={
                  superAdminDash?.total_earningsUSD?.trend === "up"
                    ? "positive"
                    : "negative"
                }
                strokeColor="#0ea5e9"
              />

              <StatCard
                title="Total Earnings (NGN)"
                amount={formatNaira(
                  superAdminDash?.total_earningsNGN?.current || "0.00"
                )}
                changeText={`${
                  superAdminDash?.total_earningsNGN?.change_percent || 0
                }%`}
                changeType={
                  superAdminDash?.total_earningsNGN?.trend === "up"
                    ? "positive"
                    : "negative"
                }
                strokeColor="#0ea5e9"
              />

              <StatCard
                title="Total Royalties (USD)"
                amount={`$${
                  superAdminDash?.total_royaltiesUSD?.current || "0.00"
                }`}
                changeText={`${
                  superAdminDash?.total_royaltiesUSD?.change_percent || 0
                }%`}
                changeType={
                  superAdminDash?.total_royaltiesUSD?.trend === "up"
                    ? "positive"
                    : "negative"
                }
                strokeColor="#4f46e5"
              />

              <StatCard
                title="Total Royalties (NGN)"
                amount={formatNaira(
                  superAdminDash?.total_royaltiesNGN?.current || "0.00"
                )}
                changeText={`${
                  superAdminDash?.total_royaltiesNGN?.change_percent || 0
                }%`}
                changeType={
                  superAdminDash?.total_royaltiesNGN?.trend === "up"
                    ? "positive"
                    : "negative"
                }
                strokeColor="#4f46e5"
              />

              <StatCard
                title="Total Books Reviewed"
                amount={superAdminDash?.total_books_reviewed?.current || "0"}
                changeText={`${
                  superAdminDash?.total_books_reviewed?.change_percent || 0
                }%`}
                changeType={
                  superAdminDash?.total_books_reviewed?.trend === "up"
                    ? "positive"
                    : "negative"
                }
                strokeColor="#16a34a"
              />

              <StatCard
                title="Total Users"
                amount={superAdminDash?.users?.current || "0"}
                changeText={`${superAdminDash?.users?.change_percent || 0}%`}
                changeType={
                  superAdminDash?.users?.trend === "up"
                    ? "positive"
                    : "negative"
                }
                strokeColor="#16a34a"
              />

              <StatCard
                title="Total Authors"
                amount={superAdminDash?.authors?.current || "0"}
                changeText={`${superAdminDash?.authors?.change_percent || 0}%`}
                changeType={
                  superAdminDash?.authors?.trend === "up"
                    ? "positive"
                    : "negative"
                }
                strokeColor="#0ea5e9"
              />

              <StatCard
                title="Total Sales"
                amount={superAdminDash?.total_sales?.current || "0"}
                changeText={`${
                  superAdminDash?.total_sales?.change_percent || 0
                }%`}
                changeType={
                  superAdminDash?.total_sales?.trend === "up"
                    ? "positive"
                    : "negative"
                }
                strokeColor="#dc2626"
              />

              <StatCard
                title="Total Payouts (USD)"
                amount={`$${
                  superAdminDash?.total_payoutsUSD?.current || "0.00"
                }`}
                changeText={`${
                  superAdminDash?.total_payoutsUSD?.change_percent || 0
                }%`}
                changeType={
                  superAdminDash?.total_payoutsUSD?.trend === "up"
                    ? "positive"
                    : "negative"
                }
                strokeColor="#f97316"
              />

              <StatCard
                title="Total Payouts (NGN)"
                amount={formatNaira(
                  superAdminDash?.total_payoutsNGN?.current || "0.00"
                )}
                changeText={`${
                  superAdminDash?.total_payoutsNGN?.change_percent || 0
                }%`}
                changeType={
                  superAdminDash?.total_payoutsNGN?.trend === "up"
                    ? "positive"
                    : "negative"
                }
                strokeColor="#f97316"
              />

              <StatCard
                title="Pending Review Requests"
                amount={superAdminDash?.pending_review_requests || "0"}
                changeText="0%"
                changeType="positive"
                strokeColor="#16a34a"
              />
            </>
          )}
        </div>

        <div className="bg-white rounded-lg border-[1px] p-2 my-2 mt-4 shadow-sm">
          <div className="w-full h-[300px]">
            {statusSuperAdminDash === "loading" ? (
              <Skeleton className="w-full h-full" />
            ) : (
              <Line data={chartData} options={options} />
            )}
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default Overview;
