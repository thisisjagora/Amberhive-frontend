import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import TableComponent from "@/components/TableComponent";

const UsersTabContent = ({ allUsers, userColumns, statusUsers }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase();

    return allUsers?.filter((user) => {
      return (
        (user.name || "").toLowerCase().includes(term) ||
        (user.email || "").toLowerCase().includes(term) ||
        (user.phone || "").toLowerCase().includes(term) ||
        (user.role || "").toLowerCase().includes(term)
      );
    });
  }, [searchTerm, allUsers]);

  return (
    <TabsContent value="All User" className="">
      <div>
        <div className="flex flex-col md:flex-row gap-4 my-4 items-start md:items-center justify-start md:justify-between bg-white">
          <div className="flex flex-col-reverse md:flex-row items-start md:items-center gap-2 w-[400px] max-w-full">
            <div className="relative w-full md:w-[400px]">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={16}
              />
              <Input
                type="text"
                placeholder="Search ..."
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
                  columns={userColumns}
                  showPagination={true}
                  isLoading={statusUsers === "loading"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
  );
};

export default UsersTabContent;
