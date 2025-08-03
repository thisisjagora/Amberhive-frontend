import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search } from "lucide-react";

import AdminLayout from "./DashboardLayout";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TableComponent from "@/components/TableComponent";
import CreateGenre from "@/components/forms/CreateGenre";
import CreateSubGenre from "@/components/forms/CreateSubGenre";

import { fetchGenres, fetchSubGenres } from "@/redux/slices/genreSlice";
import { formatDate } from "@/utils/format";

const Genre = () => {
  const dispatch = useDispatch();
  const { genres, statusFetchGenres, subGenres, statusFetchSubGenres } =
    useSelector((state) => state.genre);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchGenres());
    dispatch(fetchSubGenres());
  }, [dispatch]);

  const genreColumns = [
    {
      id: "name",
      header: () => (
        <span className="text-sm font-semibold text-gray-700">Name</span>
      ),
      accessorKey: "name",
      cell: ({ row }) => <span>{row.original.name}</span>,
    },
    {
      id: "description",
      header: () => (
        <span className="text-sm font-semibold text-gray-700">Description</span>
      ),
      accessorKey: "description",
      cell: ({ row }) => (
        <span className="break-words whitespace-normal w-72 block">
          {row.original.description}
        </span>
      ),
    },
    {
      id: "created_at",
      header: () => (
        <span className="text-sm font-semibold text-gray-700">
          Date Created
        </span>
      ),
      accessorKey: "created_at",
      cell: ({ row }) => <span>{formatDate(row.original.created_at)}</span>,
    },
  ];

  const subGenreColumns = [
    {
      id: "name",
      header: () => (
        <span className="text-sm font-semibold text-gray-700">Name</span>
      ),
      accessorKey: "name",
      cell: ({ row }) => <span>{row.original.name}</span>,
    },
    {
      id: "genre",
      header: () => (
        <span className="text-sm font-semibold text-gray-700">
          Parent Genre
        </span>
      ),
      accessorKey: "genre",
      cell: ({ row }) => <span>{row.original.category?.name || "-"}</span>,
    },
    {
      id: "created_at",
      header: () => (
        <span className="text-sm font-semibold text-gray-700">
          Date Created
        </span>
      ),
      accessorKey: "created_at",
      cell: ({ row }) => <span>{formatDate(row.original.created_at)}</span>,
    },
  ];

  const filteredGenres = genres.filter((genre) =>
    genre?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSubGenres = subGenres
    .map((sub) => ({
      ...sub,
      genre: sub.genre || {},
    }))
    .filter((sub) =>
      sub.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <AdminLayout
      header={
        <div className="w-full flex flex-col md:flex-row justify-between items-center ">
          <div className="px-4 mt-20 md:mt-0 py-6 flex justify-start items-start w-full">
            <div className="flex flex-col items-start gap-2">
              <h1 className="text-xl font-bold">Genre Management</h1>
              <p className="text-gray-500 text-sm">
                Organize content by genre and sub-genre to help users discover
                materials.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <div className="mt-12 md:mt-4">
        <Tabs defaultValue="genre" className="px-4 mt-6 space-y-4">
          <div className="w-full overflow-auto py-2">
            <div className="md:w-full border-b-3 border-gray-200">
              <TabsList className="flex items-center gap-6 w-max bg-transparent p-0">
                {["genre", "sub-genre"].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="text-base font-medium cursor-pointer text-gray-600 data-[state=active]:shadow-none data-[state=active]:text-base data-[state=active]:font-[600] data-[state=active]:text-yellow-600 data-[state=active]:border-b-3 data-[state=active]:border-yellow-500 p-2 rounded-none transition-colors border-0 pb-[30px] focus:outline-none justify-start"
                  >
                    {tab === "genre" ? "Genres" : "Sub-Genres"}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>

          <TabsContent value="genre">
            <div className="flex justify-between items-center">
              <div className="flex flex-col md:flex-row gap-4 w-full my-4 items-start justify-start bg-white">
                <div className="relative w-full md:w-[400px]">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={16}
                  />
                  <Input
                    type="text"
                    placeholder="Search by name..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <CreateGenre />
            </div>
            <div className="bg-white rounded-lg border w-full p-4 h-auto shadow-md">
              <TableComponent
                data={filteredGenres}
                columns={genreColumns}
                showPagination={true}
                isLoading={statusFetchGenres === "loading"}
              />
            </div>
          </TabsContent>

          <TabsContent value="sub-genre">
            <div className="flex justify-between items-center">
              <div className="flex flex-col md:flex-row gap-4 w-full my-4 items-start justify-start bg-white">
                <div className="relative w-full md:w-[400px]">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={16}
                  />
                  <Input
                    type="text"
                    placeholder="Search by name..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <CreateSubGenre genres={genres} />
            </div>
            <div className="bg-white rounded-lg border w-full p-4 h-auto shadow-md">
              <TableComponent
                data={filteredSubGenres}
                columns={subGenreColumns}
                showPagination={true}
                isLoading={statusFetchSubGenres === "loading"}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Genre;
