import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import SuperAdminLayout from "./DashboardLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import TableComponent from "@/components/TableComponent";
import {
  blockAuthor,
  fetchAllAuthors,
  fetchAuthorProfile,
} from "@/redux/slices/usersSlice";

import { MdArrowBack, MdErrorOutline } from "react-icons/md";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const currencySymbol = (currency) => {
  switch ((currency || "").toLowerCase()) {
    case "ngn":
      return "₦";
    case "usd":
      return "$";
    default:
      return "";
  }
};

const AuthorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const userId = location.state?.user_id;
  const isBlocked = location.state?.block === "1";

  const { authorProfile, statusAuthorProfile, error } = useSelector(
    (state) => state.users
  );

  const loading = statusAuthorProfile === "loading";
  const failed = statusAuthorProfile === "failed";

  useEffect(() => {
    dispatch(fetchAuthorProfile(id)).unwrap();
  }, [id, dispatch]);

  const handleBack = () => {
    if (location.state?.fromTab === "All Author") {
      navigate("/super-admin/user-managements", {
        replace: true,
        state: { tab: "All Author" },
      });
    } else {
      navigate(-1);
    }
  };

  const [loadingB, setLoadingB] = useState(false);

  const handleBlockAuthor = async () => {
    setLoadingB(true);
    try {
      const res = await dispatch(blockAuthor(userId)).unwrap();

      await dispatch(fetchAuthorProfile(id));
      await dispatch(fetchAllAuthors());

      navigate("/super-admin/user-managements", {
        replace: true,
        state: { tab: "All Author" },
      });

      toast.success(res.message || "Author has been blocked.");
      setBlockDialogOpen(false); // ✅ only close here, on success
    } catch (err) {
      toast.error(err?.message || "Failed to block author. Please try again.");
    } finally {
      setLoadingB(false);
    }
  };

  const skeletonBlock = (
    <div className="space-y-4">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-24 w-full" />
    </div>
  );

  const skeletonTable = (
    <div className="space-y-2">
      <Skeleton className="h-4 w-1/4" />
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );

  const bookColumns = [
    {
      id: "title",
      header: () => (
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
          Title
        </span>
      ),
      accessorKey: "title",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <img
            src={`https://test.amber-hive.com/storage/${row.original.cover}`}
            alt={row.original.title}
            className="w-12 h-12 object-cover rounded shadow"
          />
          <span className="text-sm text-gray-800">{row.original.title}</span>
        </div>
      ),
    },
    {
      id: "published_date",
      header: () => (
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
          Published
        </span>
      ),
      accessorKey: "published_date",
      cell: ({ row }) => (
        <span className="text-sm text-gray-700">
          {row.original.published_date}
        </span>
      ),
    },
    {
      id: "sales_count",
      header: () => (
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
          Sales
        </span>
      ),
      accessorKey: "sales_count",
      cell: ({ row }) => (
        <span className="text-sm text-gray-700">
          {row.original.sales_count}
        </span>
      ),
    },
  ];

  const currency = authorProfile?.stats?.currency;

  const paymentColumns = [
    {
      id: "amount",
      header: () => (
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
          Amount
        </span>
      ),
      accessorKey: "amount",
      cell: ({ row }) => (
        <span className="text-sm text-gray-800">
          {(currency?.toLowerCase() === "ngn" && "₦") ||
            (currency?.toLowerCase() === "usd" && "$") ||
            ""}
          {row.original.amount}
        </span>
      ),
    },
    {
      id: "status",
      header: () => (
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
          Status
        </span>
      ),
      accessorKey: "status",
      cell: ({ row }) => (
        <Badge
          variant={row.original.status === "pending" ? "outline" : "default"}
          className={`text-xs ${
            row.original.status === "pending"
              ? "border-yellow-500 text-yellow-600 bg-yellow-50"
              : "border-green-500 text-green-600 bg-green-50"
          }`}
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "date",
      header: () => (
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
          Date
        </span>
      ),
      accessorKey: "date",
      cell: ({ row }) => (
        <span className="text-sm text-gray-700">{row.original.date}</span>
      ),
    },
  ];

  return (
    <SuperAdminLayout
      header={
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="px-4 mt-20 md:mt-0 py-6 flex flex-col gap-1 w-full">
            <h1 className="text-xl font-bold mt-2">Author Details</h1>
            <p className="text-gray-500 text-sm">
              View author information and related actions
            </p>
          </div>
        </div>
      }
    >
      <div className="px-4 py-6 mt-4 space-y-6">
        <div className="flex justify-start items-center mb-4">
          <Button
            onClick={handleBack}
            variant="outline"
            className="text-sm text-gray-600 cursor-pointer flex items-center gap-1"
          >
            <MdArrowBack className="w-4 h-4" />
            Back
          </Button>
        </div>
        {failed && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-6 flex flex-col gap-4 items-start shadow-sm">
            <div className="flex items-center gap-2">
              <MdErrorOutline className="text-red-500 w-6 h-6" />
              <h2 className="text-lg font-semibold">No author detail yet</h2>
            </div>
            <p className="text-sm text-gray-700">
              {error ||
                "The author details are not available at the moment. Please check back later or try again."}
            </p>
          </div>
        )}

        {!failed && (
          <>
            {!loading && !authorProfile?.author ? (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg p-6 flex flex-col gap-4 items-start shadow-sm">
                <div className="flex items-center gap-2">
                  <MdErrorOutline className="text-yellow-500 w-6 h-6" />
                  <h2 className="text-lg font-semibold">No data yet</h2>
                </div>
                <p className="text-sm text-gray-700">
                  This user has not set up their author profile yet. Please
                  check back later.
                </p>
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="text-sm text-gray-600 cursor-pointer flex items-center gap-1"
                >
                  <MdArrowBack className="w-4 h-4" />
                  Go Back
                </Button>
              </div>
            ) : (
              <>
                {/* Author Info */}
                <div className="bg-white shadow rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-2">
                    Author Information
                  </h2>
                  {loading ? (
                    skeletonBlock
                  ) : (
                    <div className="grid gap-2 text-sm text-gray-700">
                      <p>
                        Name:{" "}
                        <span className="font-medium">
                          {authorProfile?.author?.name || "N/A"}
                        </span>
                      </p>
                      <p>
                        Email:{" "}
                        <span className="font-medium">
                          {authorProfile?.author?.email || "N/A"}
                        </span>
                      </p>
                      <p>
                        Joined:{" "}
                        <span>{authorProfile?.author?.joined_at || "N/A"}</span>
                      </p>
                      <p>Bio:</p>
                      <p className="text-gray-600 italic">
                        {authorProfile?.author?.bio || "No biography provided."}
                      </p>
                      {/* 🚨 Block Author Button */}

                      {/* <div className="mt-4">
                        <Button
                          variant="destructive"
                          className={`cursor-pointer`}
                          onClick={() => setBlockDialogOpen(true)}
                        >
                          Block Author
                        </Button>
                      </div> */}

                      <div className="mt-4">
                        <AlertDialog
                          open={blockDialogOpen}
                          onOpenChange={(o) =>
                            !loadingB && setBlockDialogOpen(o)
                          }
                        >
                          <AlertDialogTrigger asChild>
                            <Button
                              onClick={() => setBlockDialogOpen(true)}
                              className={`cursor-pointer ${
                                isBlocked
                                  ? "bg-green-600 hover:bg-green-700 text-white"
                                  : "bg-red-600 hover:bg-red-700 text-white"
                              }`}
                            >
                              {isBlocked ? "Unblock Author" : "Block Author"}
                            </Button>
                          </AlertDialogTrigger>

                          <AlertDialogContent className={`font-gilroy`}>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {isBlocked ? "Unblock Author" : "Block Author"}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to{" "}
                                {isBlocked ? "unblock" : "block"} this author?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel disabled={loadingB}>
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleBlockAuthor}
                                disabled={loadingB}
                                className={`cursor-pointer ${
                                  isBlocked
                                    ? "bg-green-600 hover:bg-green-700 text-white"
                                    : "bg-red-600 hover:bg-red-700 text-white"
                                }`}
                              >
                                {loadingB
                                  ? `${
                                      isBlocked
                                        ? "Unblocking..."
                                        : "Blocking..."
                                    }`
                                  : `Confirm ${
                                      isBlocked ? "Unblock" : "Block"
                                    }`}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="bg-white shadow rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-4">Statistics</h2>
                  {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full rounded-lg" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4 text-center shadow-sm">
                        <p className="text-sm text-gray-500">Total Books</p>
                        <p className="text-lg font-semibold">
                          {authorProfile?.stats?.total_books ?? 0}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 text-center shadow-sm">
                        <p className="text-sm text-gray-500">Total Sales</p>
                        <p className="text-lg font-semibold">
                          {authorProfile?.stats?.total_sales ?? 0}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 text-center shadow-sm">
                        <p className="text-sm text-gray-500">Total Earnings</p>
                        <p className="text-lg font-semibold">
                          {currencySymbol(authorProfile?.stats?.currency)}{" "}
                          {authorProfile?.stats?.total_earnings ?? "0.00"}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 text-center shadow-sm">
                        <p className="text-sm text-gray-500">
                          Pending Earnings
                        </p>
                        <p className="text-lg font-semibold">
                          {currencySymbol(authorProfile?.stats?.currency)}{" "}
                          {authorProfile?.stats?.pending_earnings ?? "0.00"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Books */}
                <div className="bg-white shadow rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-4">
                    Books by this Author
                  </h2>
                  {loading ? (
                    skeletonTable
                  ) : (
                    <TableComponent
                      data={authorProfile?.books || []}
                      columns={bookColumns}
                      showPagination
                    />
                  )}
                </div>

                {/* Payments */}
                <div className="bg-white shadow rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-4">Payments</h2>
                  {loading ? (
                    skeletonTable
                  ) : (
                    <TableComponent
                      data={authorProfile?.payments || []}
                      columns={paymentColumns}
                      showPagination
                    />
                  )}
                </div>
              </>
            )}
          </>
        )}

        {/* {blockDialogOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
              <h3 className="text-lg font-semibold mb-4">Block Author</h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to block this author? This action cannot
                be undone.
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  className={`cursor-pointer`}
                  onClick={() => setBlockDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant="destructive" className={`cursor-pointer`} onClick={handleBlockAuthor}>
                  Confirm {isBlocked ? "Unblock" : "Block"}
                </Button>
              </div>
            </div>
          </div>
        )} */}
      </div>
    </SuperAdminLayout>
  );
};

export default AuthorDetail;
