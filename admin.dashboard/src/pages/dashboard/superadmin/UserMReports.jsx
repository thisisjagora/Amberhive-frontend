import React, { useEffect, useState } from "react";
import SuperAdminLayout from "./DashboardLayout";
import { Button } from "@/components/ui/button";
import { VscListFilter, VscListSelection } from "react-icons/vsc";
import { LayoutGrid, MoreVertical, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import TableComponent from "@/components/TableComponent";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "@/redux/slices/usersSlice";

const roleColors = {
  author: "bg-yellow-100 text-yellow-800",
  user: "bg-purple-100 text-purple-800",
  admin: "bg-gray-200 text-gray-800",
  "super admin": "bg-blue-100 text-blue-800",
};

const UserMReports = () => {
  const [view, setView] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const { allUsers, statusAllUsers, error, roles } = useSelector(
    (state) => state.users
  );

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const userMColumns = [
    {
      id: "name",
      header: () => (
        <span className="font-semibold text-gray-700 py-2">Name of Users</span>
      ),
      accessorKey: "name",
      cell: ({ row }) => {
        const { name } = row.original;
        return (
          <div className="flex items-center gap-3 py-2">
            <h1 className="text-sm font-medium text-gray-800 break-words">
              {name}
            </h1>
          </div>
        );
      },
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
        <span className="text-sm px-2 py-2 text-gray-700">
          {row.original.email}
        </span>
      ),
    },

    {
      id: "registrationDate",
      header: () => (
        <div className="flex justify-center">
          <span className="font-semibold text-gray-700 px-2 py-2">
            Registration Date
          </span>
        </div>
      ),
      accessorKey: "registrationDate",
      cell: ({ row }) => {
        const date = new Date(row.original.created_at);
        const formattedDate = date.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

        return (
          <div className="flex justify-center">
            <span className="text-sm text-gray-600 px-2 py-2">
              {formattedDate}
            </span>
          </div>
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

  return (
    <SuperAdminLayout
      header={
        <div className="w-full flex justify-between items-center ">
          <div className="flex flex-col px-4 mt-20 md:mt-0 py-6 justify-start items-start w-full">
            <div className="flex flex-col items-start gap-2">
              <h1 className="text-xl font-bold">User Management Reports</h1>
              <p className="text-gray-500 text-sm">
                Get reports of all users, their roles, and interactions across
                the platform.
              </p>
            </div>
          </div>
          {/* <div className="flex gap-2 px-4">
            <Button variant="outline">
              <FiDownload />
              Download Report
            </Button>
            <Button>
              Export <FiChevronDown />
            </Button>
          </div> */}
        </div>
      }
    >
      <div className="px-4 md:mt-8">
        <div>
          <div className="flex flex-col md:flex-row gap-4  my-4 items-start md:items-center justify-start md:justify-between bg-white">
            {/* Left: View toggles */}
            {/* <div className="flex items-center justify-start">
              <Button
                variant="outline"
                className={`flex items-center gap-1 text-base rounded-r-none ${
                  view === "list"
                    ? "text-yellow-600 font-semibold text-base bg-gray-50 hover:text-yellow-600"
                    : ""
                }`}
                onClick={() => setView("list")}
              >
                <VscListSelection />
                List
              </Button>
              <Button
                variant="outline"
                className={`flex items-center gap-1 text-base rounded-l-none border-l ${
                  view === "grid"
                    ? "text-yellow-600 font-bold bg-gray-50 hover:text-yellow-600"
                    : ""
                }`}
                onClick={() => setView("grid")}
              >
                <LayoutGrid size={20} />
                Tiles
              </Button>
            </div> */}

            {/* Right: Search and Filter */}
            <div className="flex flex-col-reverse md:flex-row items-start md:items-center gap-2 w-[400px] max-w-full">
              <div className="relative w-full md:w-[400px]">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={16}
                />
                <Input
                  type="text"
                  placeholder="Search by name, email, or role..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <div className="py-2">
              <div className="bg-white border-[1px] rounded-lg w-full p-4 h-auto shadow-md">
                <div className="relative overflow-x-auto rounded-t-lg">
                  <TableComponent
                    data={filteredUsers}
                    columns={userMColumns}
                    showPagination={true}
                    isLoading={statusAllUsers === "loading"}
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

export default UserMReports;
