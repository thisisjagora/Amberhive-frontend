import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { CellAction } from "./cellAction"; // Optional: for row actions

const getStatusBadge = (status) => {
  switch (status) {
    case "Active":
      return (
        <Badge variant="default" className="bg-green-200 text-green-800">
          Active
        </Badge>
      );
    case "Inactive":
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
          Inactive
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-700">
          Blocked
        </Badge>
      );
  }
};


export const columns = (viewMode) => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        className="text-gray-600"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    size: 40,
  },
  {
    id: "name",
    accessorKey: "name",
    header: () => (
      <span className="text-sm font-semibold text-gray-700">Buyer Name</span>
    ),
    cell: ({ row }) => {
      const { name, image } = row.original;
      return (
        <div className="flex items-center gap-3">
          <img
            src={image}
            alt={name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <span className="text-sm font-medium text-gray-800">{name}</span>
        </div>
      );
    },
  },
  
  {
    id: "email",
    accessorKey: "email",
    header: () => (
      <span className="text-sm font-semibold text-gray-700">Email Address</span>
    ),
  },
  {
    id: "phone",
    accessorKey: "phone",
    header: () => (
      <span className="text-sm font-semibold text-gray-700">Phone Number</span>
    ),
  },
  {
    id: "registeredOn",
    accessorKey: "registeredOn",
    header: () => (
      <span className="text-sm font-semibold text-gray-700">
        Date of Registration
      </span>
    ),
  },
  {
    id: "totalOrders",
    accessorKey: "totalOrders",
    header: () => (
      <span className="text-sm font-semibold text-gray-700">Total Orders</span>
    ),
  },
  {
    id: "amountSpent",
    accessorKey: "amountSpent",
    header: () => (
      <span className="text-sm font-semibold text-gray-700">Amount Spent</span>
    ),
  },
  {
    id: "status",
    accessorKey: "status",
    header: () => (
      <span className="text-sm font-semibold text-gray-700">Status</span>
    ),
    cell: ({ getValue }) => getStatusBadge(getValue()),
  },
  {
    id: "actions",
    header: () => <span className="text-sm font-semibold text-gray-700"></span>,
    cell: ({ row }) => <CellAction data={row.original} viewMode={viewMode} />,
  },
];
