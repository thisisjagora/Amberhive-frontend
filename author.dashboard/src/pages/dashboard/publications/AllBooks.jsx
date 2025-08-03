import React, { useEffect, useState } from "react";
import EmptyBooks from "@/components/EmptyBooks";
import TableComponent from "@/components/TableComponent";
import { columns } from "@/components/allBooks/columns";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Layout from "@/components/shared/Layout";
import AllBookHeader from "@/components/headers/AllBookHeaders";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyBooks } from "@/redux/slices/bookSlice";

const AllBooks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const { myBooks, statusMyBooks, error } = useSelector((state) => state.books);

  useEffect(() => {
    dispatch(fetchMyBooks());
  }, [dispatch]);

  // console.log(myBooks)

  const filteredBooks = myBooks.filter((item) =>
    item?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white font-gilroy">
      {myBooks.length === 0 && !statusMyBooks ? (
        <Layout header={<AllBookHeader count={myBooks.length} />}>
          <EmptyBooks />
        </Layout>
      ) : (
        <Layout header={<AllBookHeader count={myBooks.length} />}>
          <div className="pb-4 px-2">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-start md:justify-between bg-white">
              {/* Left: View toggles */}

              {/* Right: Search and Filter */}
              <div className="flex flex-col-reverse md:flex-row items-start md:items-center gap-2 w-[400px] max-w-full">
                <div className="relative flex-1 w-full">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={16}
                  />
                  <Input
                    type="text"
                    placeholder="Search books..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-full"
                  />
                </div>
              </div>
            </div>
            <div>
              <div className="bg-white rounded-lg w-full p-4 h-auto border-[1px] mt-12 shadow">
                <div className="relative overflow-x-auto rounded-t-lg">
                  <TableComponent
                    columns={columns}
                    data={filteredBooks}
                    isLoading={statusMyBooks === "loading"}
                  />
                </div>
              </div>
            </div>
          </div>
        </Layout>
      )}
    </div>
  );
};

export default AllBooks;
