import { formatDate } from "@/utils/format";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { CellAction } from "./cellAction";

const getStatusBadge = (status) => {
  const statusMap = {
    approved: "text-green-600 bg-green-100",
    draft: "text-gray-500 bg-gray-100",
    pending: "text-yellow-600 bg-yellow-100",
    declined: "text-red-500 bg-red-100",
    published: "text-green-600 bg-green-100",
  };

  return (
    <Badge
      className={`w-fit font-semibold ${
        statusMap[status] || "bg-gray-200 text-gray-600"
      }`}
    >
      {status}
    </Badge>
  );
};

export const columns = (viewMode) => [

  {
    id: "name",
    accessorKey: "title",
    header: () => (
      <span className="text-sm font-semibold text-gray-700">Name of Book</span>
    ),
    cell: ({ row }) => {
      const book = row.original;

      return (
        <div className="flex items-center gap-2">
          {book.cover_image ? (
            <img
              src={`https://test.amber-hive.com/storage/${book.cover_image}`}
              alt={book.title}
              className="w-10 h-14 object-cover rounded"
            />
          ) : (
            <div className="w-10 h-14 bg-gray-200 rounded" />
          )}
          <span className="text-sm text-gray-800">{book.title}</span>
        </div>
      );
    },
  },

{
  id: "price",
  accessorKey: "price",
  header: () => (
    <span className="text-sm font-semibold text-gray-700">Price</span>
  ),
  cell: ({ row }) => {
    const { price, currency } = row.original;
   const symbol = currency
  ? currency.toLowerCase() === "ngn"
    ? "₦"
    : "$"
  : "";
    return (
      <span className="text-sm text-gray-800">
        {symbol} {price}
      </span>
    );
  },
},

  {
    id: "date",
    accessorKey: "created_at",
    header: () => (
      <span className="text-sm font-semibold text-gray-700">Date Created</span>
    ),
    cell: ({ row }) => {
      const { created_at } = row.original;
      return (
        <span className="text-sm text-gray-800">
          {created_at ? formatDate(created_at) : "-"}
        </span>
      );
    },
  },
  {
    id: "status",
    accessorKey: "status",
    header: () => (
      <span className="text-sm font-semibold text-gray-700">Status</span>
    ),
    cell: ({ row }) => {
      const { status } = row.original;
      return getStatusBadge(status);
    },
  },
  {
    id: "actions",
    header: () => (
      <span className="text-sm font-semibold text-gray-700">Actions</span>
    ),
    cell: ({ row }) => <CellAction data={row.original} viewMode={viewMode} />,
  },
];
