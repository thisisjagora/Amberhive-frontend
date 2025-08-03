import React from "react";
import { Badge } from "@/components/ui/badge";


export const getStatusBadge = (status) => {
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