import { formatDate } from "@/utils/format";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { CellAction } from "./cellAction";



const statusMap = {
  approved: "text-green-600 bg-green-100",
  draft: "text-gray-500 bg-gray-100",
  pending: "text-yellow-600 bg-yellow-100",
  declined: "text-red-500 bg-red-100",
  published: "text-green-600 bg-green-100",
};


export const columns = (viewMode) => [

  {
    id: "name",
    accessorKey: "name",
    header: () => (
      <span className="text-sm font-semibold text-gray-700">Name of Book</span>
    ),
    cell: ({ row }) => {
      const { cover_image, title } = row.original;
      return (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {cover_image ? (
            <img
              src={`https://test.amber-hive.com/storage/${cover_image}`}
              alt={title}
              className="w-14 h-16 object-cover rounded"
            />
          ) : (
            <div className="w-14 h-16 bg-gray-100 border rounded flex items-center justify-center text-[10px] text-center text-muted-foreground">
              No Image
            </div>
          )}
          {title}
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
      const currencySymbol = row.original.currency === "ngn" ? "₦" : "$";
      const price = row.original.price || 0;
      return (
        <span className="text-sm text-gray-600">
          {currencySymbol}
          {price}
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
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">
        {formatDate(row.original.created_at)}
      </span>
    ),
  },
 {
    id: "approval_status",
    accessorKey: "approval_status",
    header: () => (
      <span className="text-sm font-semibold text-gray-700">Approval Status</span>
    ),
    cell: ({ row }) => {
      const status = row.original.approval_status;
      const style =
        statusMap[status?.toLowerCase()] || "text-gray-600 bg-gray-200";
      return (
        <Badge className={`w-fit font-semibold capitalize ${style}`}>
          {status}
        </Badge>
      );
    },
  },
  // {
  //   id: "actions",
  //   header: () => (
  //     <span className="text-sm font-semibold text-gray-700">Actions</span>
  //   ),
  //   cell: ({ row }) => <CellAction data={row.original} viewMode={viewMode} />,
  // },
];
