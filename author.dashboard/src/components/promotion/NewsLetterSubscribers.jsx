import { MoreVertical, Search, Trash2 } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import TableComponent from "../TableComponent";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import { getNewsletterSubscribers } from "@/redux/slices/emailCampaignSlice";
import { useEffect, useState } from "react";

const newsLetterColumns = [
  {
    id: "name",
    header: () => (
      <div className="text-left font-semibold text-gray-700 uppercase text-xs tracking-wider px-2 py-1">
        Name of Subscriber
      </div>
    ),
    accessorKey: "first_name", // we'll use first_name and last_name combined in cell
    cell: ({ row }) => {
      const { first_name, last_name } = row.original;
      return (
        <div className="font-medium text-gray-900 px-2 py-1 whitespace-nowrap">
          {first_name} {last_name}
        </div>
      );
    },
  },
  {
    id: "email",
    header: () => (
      <div className="text-left font-semibold text-gray-700 uppercase text-xs tracking-wider px-2 py-1">
        Email Address
      </div>
    ),
    accessorKey: "email",
    cell: ({ row }) => (
      <div className="text-sm text-gray-600 px-2 py-1 whitespace-nowrap">
        {row.original.email}
      </div>
    ),
  },
  {
    id: "dateJoined",
    header: () => (
      <div className="text-left font-semibold text-gray-700 uppercase text-xs tracking-wider px-2 py-1">
        Date Joined
      </div>
    ),
    accessorKey: "last_changed",
    cell: ({ row }) => {
      const date = new Date(row.original.last_changed);
      return (
        <div className="font-medium text-gray-900 px-2 py-1 whitespace-nowrap">
          {date.toLocaleDateString()}
        </div>
      );
    },
  },
  {
    id: "status",
    header: () => (
      <div className="text-left font-semibold text-gray-700 uppercase text-xs tracking-wider px-2 py-1">
        Status
      </div>
    ),
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          className={`text-xs font-semibold px-2 py-1 whitespace-nowrap ${
            status === "subscribed"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {status}
        </Badge>
      );
    },
  },
  // {
  //   id: "action",
  //   header: () => <div className="px-2 py-1" />, // blank header but with padding
  //   cell: ({ row }) => (
  //     <div className="flex items-center gap-2 px-2 py-1">
  //       <Button
  //         variant="ghost"
  //         size="icon"
  //         aria-label={`Delete subscriber ${row.original.first_name} ${row.original.last_name}`}
  //         // onClick={() => console.log("Deleting subscriber:", row.original.id)}
  //       >
  //         <Trash2 className="w-4 h-4 text-gray-500" />
  //       </Button>
  //       <Button
  //         variant="ghost"
  //         size="icon"
  //         aria-label={`More options for ${row.original.first_name} ${row.original.last_name}`}
  //         // onClick={() => console.log("Opening menu for:", row.original.id)}
  //       >
  //         <MoreVertical className="w-4 h-4 text-gray-600" />
  //       </Button>
  //     </div>
  //   ),
  // },
];

const NewsLetterSubscribers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [authorId, setAuthorId] = useState("");
  const dispatch = useDispatch();
  const { statusFetchNewsletterSubscribers, newsletterSubscribers, error } =
    useSelector((state) => state.emailCampaign);

  useEffect(() => {
    // Fetch user from localStorage and parse it
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setAuthorId(parsedUser.author_id);
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }
  }, []);

  // console.log(authorId);

  useEffect(() => {
    if (authorId) {
      dispatch(getNewsletterSubscribers(authorId));
    }
  }, [authorId, dispatch]);

  const filteredSubscribers = newsletterSubscribers?.filter((subscriber) => {
    const fullName =
      `${subscriber.first_name} ${subscriber.last_name}`.toLowerCase();
    const email = subscriber.email?.toLowerCase();
    const search = searchTerm.toLowerCase();

    return fullName.includes(search) || email.includes(search);
  });

  return (
    <div>
      <div className="">
        <div className="flex flex-col mt-2 items-center justify-between mb-4 gap-2">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 w-full">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              {" "}
              {/* increased from md:w-60 */}
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="bg-white border-[1px] rounded-lg w-full p-4 h-auto shadow-md">
            <TableComponent
              data={filteredSubscribers}
              columns={newsLetterColumns}
              showPagination={true}
              isLoading={statusFetchNewsletterSubscribers === "loading"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsLetterSubscribers;
