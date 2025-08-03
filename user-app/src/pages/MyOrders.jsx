import TableComponent from "@/components/TableComponent";
import { Badge } from "@/components/ui/badge";
import { MoreVertical } from "lucide-react";
import React from "react";
import { BsBoxSeam } from "react-icons/bs";

const orderColumns = [
  {
    accessorKey: "image",
    header: () => <span className="sr-only">Cover</span>,
    cell: ({ row }) => {
      const image = row.original.image;
      return (
        <img
          src={image}
          alt="book cover"
          className="w-12 h-14 object-cover rounded"
        />
      );
    },
  },
  {
    accessorKey: "bookName",
    header: () => (
      <div className="text-sm font-semibold text-gray-700">Name of Book</div>
    ),
    cell: ({ row }) => (
      <div className="text-sm text-gray-900 font-medium">
        {row.original.bookName}
      </div>
    ),
  },
  {
    accessorKey: "orderNumber",
    header: () => (
      <div className="text-sm font-semibold text-gray-700">Order Number</div>
    ),
    cell: ({ row }) => (
      <div className="text-sm text-gray-700">{row.original.orderNumber}</div>
    ),
  },
  {
    accessorKey: "quantity",
    header: () => (
      <div className="text-sm font-semibold text-gray-700">QTY</div>
    ),
    cell: ({ row }) => (
      <div className="text-sm text-gray-700">{row.original.quantity}</div>
    ),
  },
  {
    accessorKey: "totalAmount",
    header: () => (
      <div className="text-sm font-semibold text-gray-700">Total Amount</div>
    ),
    cell: ({ row }) => (
      <div className="text-sm text-gray-700">{row.original.totalAmount}</div>
    ),
  },
  {
    accessorKey: "orderDate",
    header: () => (
      <div className="text-sm font-semibold text-gray-700">Order Date</div>
    ),
    cell: ({ row }) => (
      <div className="text-sm text-gray-700">{row.original.orderDate}</div>
    ),
  },
  {
    accessorKey: "deliveryDate",
    header: () => (
      <div className="text-sm font-semibold text-gray-700">Delivery Date</div>
    ),
    cell: ({ row }) => (
      <div className="text-sm text-gray-700">{row.original.deliveryDate}</div>
    ),
  },
  {
    accessorKey: "paymentMethod",
    header: () => (
      <div className="text-sm font-semibold text-gray-700">Payment Method</div>
    ),
    cell: ({ row }) => (
      <div className="text-sm text-gray-700">{row.original.paymentMethod}</div>
    ),
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="text-sm font-semibold text-gray-700">Status</div>
    ),
    cell: ({ row }) => {
      const status = row.original.status;

      const statusStyles = {
        Delivered: "bg-green-100 text-green-700 font-[600] ",
        Processing: "bg-red-100 text-red-700 font-[600] ",
        Returned: "bg-blue-100 text-blue-700 font-[600] ",
      };

      const className = `text-xs px-2 py-1 rounded-md font-medium ${
        statusStyles[status] || ""
      }`;

      return (
        <Badge className={className} variant="outline">
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: () => (
      <div className="text-sm font-semibold text-gray-700 text-center">
        Action
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          <button className="p-2 hover:bg-muted rounded">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      );
    },
  },
];

const orderData = [];

const MyOrders = () => {
  return (
    <div className="max-w-[85rem] mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900">My Orders</h1>
        <p className="text-sm text-gray-500">
          Items that are liked but haven’t been purchased
        </p>
      </div>
      <div>
        {orderData.length === 0 ? (
          <div>
            <div className="p-4 py-36 bg-white ">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="bg-gray-100 rounded-full p-2 inline-block">
                  <div className="bg-gray-200 rounded-full p-2">
                    <BsBoxSeam className="w-8 h-8 text-gray-400" />
                  </div>
                </div>

                <h2 className="text-lg font-semibold">No Orders Yet</h2>
                <p className="text-base text-gray-500 max-w-[18rem]">
                  When you eventually like a product thats when it shows up
                  here.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div>
              <TableComponent columns={orderColumns} data={orderData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
