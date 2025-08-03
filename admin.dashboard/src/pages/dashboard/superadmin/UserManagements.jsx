import React, { useEffect, useState } from "react";
import SuperAdminLayout from "./DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Search } from "lucide-react";
import TableComponent from "@/components/TableComponent";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllAuthors,
  fetchAllRoles,
  fetchAllUsers,
  fetchNewUsers,
} from "@/redux/slices/usersSlice";
import { Link, useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import { unparse } from "papaparse";
import { Badge } from "@/components/ui/badge";

const UserManagements = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();

  const {
    allUsers,
    statusAllUsers,
    authors,
    statusAuthors,
    newUsers,
    statusNewUsers,
  } = useSelector((state) => state.users);

  // Decide default tab based on location.state
  const defaultTab =
    location.state?.tab === "All Author"
      ? "All Author"
      : location.state?.tab === "New Users"
      ? "New Users"
      : "All User";

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchAllRoles());
    dispatch(fetchAllAuthors());
    dispatch(fetchNewUsers());
  }, [dispatch]);

  const userColumns = [
    {
      id: "name",
      header: () => (
        <span className="font-semibold text-gray-700 px-2 py-2">
          Name of User
        </span>
      ),
      accessorKey: "name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3 px-2 py-2">
          <span className="text-sm font-medium text-gray-800">
            {row.original.name}
          </span>
        </div>
      ),
    },
    {
      id: "email",
      header: () => (
        <span className="font-semibold text-gray-700 px-2 py-2">
          Email Address
        </span>
      ),
      accessorKey: "email",
      cell: ({ row }) => (
        <span className="text-sm text-gray-600 px-2 py-2">
          {row.original.email}
        </span>
      ),
    },
    {
      id: "dateCreated",
      header: () => (
        <span className="font-semibold text-gray-700 px-2 py-2">
          Date Created
        </span>
      ),
      accessorKey: "dateCreated",
      cell: ({ row }) => {
        const date = new Date(row.original.created_at);
        const formattedDate = date.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        return (
          <span className="text-sm text-gray-600 px-2 py-2">
            {formattedDate}
          </span>
        );
      },
    },
  ];

  const newUserColumns = [
    {
      id: "name",
      header: () => (
        <span className="font-semibold text-gray-700 px-2 py-2">
          Name of User
        </span>
      ),
      accessorKey: "name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3 px-2 py-2">
          <span className="text-sm font-medium text-gray-800">
            {row.original.name}
          </span>
        </div>
      ),
    },
    {
      id: "email",
      header: () => (
        <span className="font-semibold text-gray-700 px-2 py-2">
          Email Address
        </span>
      ),
      accessorKey: "email",
      cell: ({ row }) => (
        <span className="text-sm text-gray-600 px-2 py-2">
          {row.original.email}
        </span>
      ),
    },
    {
      id: "dateCreated",
      header: () => (
        <span className="font-semibold text-gray-700 px-2 py-2">Joined At</span>
      ),
      accessorKey: "dateCreated",
      cell: ({ row }) => {
        const date = new Date(row.original.created_at);
        const formattedDate = date.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        return (
          <span className="text-sm text-gray-600 px-2 py-2">
            {formattedDate}
          </span>
        );
      },
    },
  ];

  const authorColumns = [
    {
      id: "name",
      header: () => (
        <span className="font-semibold text-gray-700 px-4 py-3">
          Author Name
        </span>
      ),
      accessorKey: "name",
      cell: ({ row }) => (
        <Link
          to={`/super-admin/user-managements/author/${row.original?.author?.id}`}
          state={{
            fromTab: "All Author",
            user_id: row.original?.author?.user_id,
            block: row.original?.block,
          }}
          className="text-sm font-[600] text-yellow-600 px-4 py-3 block hover:underline"
        >
          {row.original.name}
        </Link>
      ),
    },
    {
      id: "email",
      header: () => (
        <span className="font-semibold text-gray-700 px-4 py-3">Email</span>
      ),
      accessorKey: "email",
      cell: ({ row }) => (
        <span className="text-sm text-gray-600 px-4 py-3 block">
          {row.original.email}
        </span>
      ),
    },
    {
      id: "status",
      header: () => (
        <div className="text-center w-full font-semibold text-gray-700 px-4 py-3">
          Status
        </div>
      ),
      accessorKey: "block",
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Badge
            className={`px-2 py-1 text-xs font-[600] ${
              row.original.block === "1"
                ? "bg-red-100 text-red-600 border border-red-300"
                : "bg-green-100 text-green-600 border border-green-300"
            }`}
          >
            {row.original.block === "1" ? "Blocked" : "Active"}
          </Badge>
        </div>
      ),
    },
    {
      id: "created_at",
      header: () => (
        <span className="font-semibold text-gray-700 px-4 py-3">
          Date Created
        </span>
      ),
      accessorKey: "created_at",
      cell: ({ row }) => {
        const date = new Date(row.original.created_at);
        return (
          <span className="text-sm text-gray-600 px-4 py-3 block">
            {date.toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        );
      },
    },
  ];

  const filteredUsers = allUsers?.filter((user) => {
    const search = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search)
    );
  });

  const filteredNewUsers = newUsers?.filter((user) => {
    const search = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search)
    );
  });

  const filteredAuthors = authors?.filter((author) => {
    const search = searchTerm.toLowerCase();
    return (
      author.name?.toLowerCase().includes(search) ||
      author.email?.toLowerCase().includes(search)
    );
  });

  const exportNewUsersToCSV = (data) => {
    if (!data || data.length === 0) {
      alert("No data to export.");
      return;
    }

    const rows = data.map((user) => ({
      Name: user.name,
      Email: user.email,
      "Joined At": new Date(user.created_at).toLocaleDateString(),
    }));

    const csv = unparse(rows);

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "new_users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <SuperAdminLayout
      header={
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="px-4 mt-20 md:mt-0 py-6 flex justify-start items-start w-full">
            <div className="flex flex-col items-start gap-2">
              <h1 className="text-xl font-bold">User Managements</h1>
              <p className="text-gray-500 text-sm">
                View and manage users (Admin, Super Admin, Authors, New Users)
              </p>
            </div>
          </div>
        </div>
      }
    >
      <div className="md:mt-8 mt-16 mx-4">
        <div className="w-full">
          <Tabs defaultValue={defaultTab}>
            <div className="w-full overflow-auto py-2">
              <div className="md:w-full border-b-3 border-gray-200">
                <TabsList className="flex items-center gap-6 w-max bg-transparent p-0">
                  {["All User", "All Author", "New Users"].map((tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className="text-base font-medium cursor-pointer text-gray-600 data-[state=active]:shadow-none data-[state=active]:text-base data-[state=active]:font-[600] data-[state=active]:text-yellow-600 data-[state=active]:border-b-3 data-[state=active]:border-yellow-500 p-2 rounded-none transition-colors border-0 pb-[30px] focus:outline-none justify-start"
                    >
                      {tab === "All User"
                        ? `All User (${allUsers.length})`
                        : tab === "All Author"
                        ? `All Author (${authors?.length})`
                        : `New Users (${newUsers?.length || 0})`}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </div>

            <TabsContent value="All User">
              <div className="my-4">
                {/* Search & CreateUser inside All User */}
                <div className="flex flex-col justify-between md:flex-row gap-4 bg-white">
                  <div className="relative w-full md:w-[400px]">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      size={16}
                    />
                    <Input
                      type="text"
                      placeholder="Search name and email..."
                      className="pl-8 w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* <CreateUser /> */}
                </div>

                <div className="py-2">
                  <div className="bg-white border rounded-lg w-full p-4 shadow-md">
                    <TableComponent
                      data={filteredUsers}
                      columns={userColumns}
                      showPagination
                      isLoading={statusAllUsers === "loading"}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="All Author">
              <div className="my-4">
                <div className="flex flex-col md:flex-row gap-4 bg-white">
                  <div className="relative w-full md:w-[400px]">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      size={16}
                    />
                    <Input
                      type="text"
                      placeholder="Search name and email..."
                      className="pl-8 w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="py-2">
                  <div className="bg-white border rounded-lg w-full p-4 shadow-md">
                    <TableComponent
                      data={filteredAuthors}
                      columns={authorColumns}
                      showPagination
                      isLoading={statusAuthors === "loading"}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="New Users">
              <div className="my-4">
                {/* 📄 Explanation text */}
                <p className="text-lg text-yellow-600 font-[600] mb-2">
                  Latest users who registered within the past week
                </p>

                <div className="flex flex-col md:flex-row justify-between gap-4 bg-white">
                  <div className="relative w-full md:w-[400px]">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      size={16}
                    />
                    <Input
                      type="text"
                      placeholder="Search name and email..."
                      className="pl-8 w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="mr-6">
                    <Button
                      onClick={() => exportNewUsersToCSV(filteredNewUsers)}
                      className="flex items-center cursor-pointer gap-2"
                    >
                      <Download size={16} />
                      Export CSV
                    </Button>
                  </div>
                </div>

                <div className="py-2">
                  <div className="bg-white border rounded-lg w-full p-4 shadow-md">
                    <TableComponent
                      data={filteredNewUsers}
                      columns={newUserColumns}
                      showPagination
                      isLoading={statusNewUsers === "loading"}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default UserManagements;
