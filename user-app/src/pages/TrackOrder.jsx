import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const statusSteps = [
  { label: "Placed Order", date: "Mar. 19 2025" },
  { label: "Order Packed", date: "Mar. 19 2025" },
  { label: "In Transit", date: "Mar. 19 2025" },
  { label: "Order Delivered", date: "Mar. 20 2025" },
];

const order = {
  number: "#203488294",
  placed: "Mar. 20 2025",
  delivery: "Mar. 20 2025",
  status: "Placed Order",
  items: [
    {
      title: "Son of the Storm",
      edition: "Paperback",
      price: 15.0,
      quantity: 2,
      image: "https://covers.openlibrary.org/b/id/11140179-L.jpg",
    },
    {
      title: "Son of the Storm",
      edition: "Paperback",
      price: 15.0,
      quantity: 2,
      image: "https://covers.openlibrary.org/b/id/11140179-L.jpg",
    },
  ],
  summary: {
    subtotal: 200,
    shipping: 200,
    taxes: 200,
    discount: 10,
    total: 700,
  },
};

const TrackOrder = () => {
  const currentStepIndex = statusSteps.findIndex(
    (step) => step.label === order.status
  );

  return (
    <div className="max-w-5xl mx-auto p-6 pb-24 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-6">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-gray-900">Track Orders</h2>
          <p className="text-sm text-muted-foreground">
            Track the progress of your orders
          </p>
        </div>
        <Button
          variant="ghost"
          className="text-xs bg-black text-white h-8 px-3"
        >
          ⬇ Download Invoice
        </Button>
      </div>

      {/* Order Details */}
      <div className="grid grid-cols-1 md:grid-cols-5 text-sm text-gray-600 gap-4">
        <div>
          <p className="text-gray-400">Order Number</p>
          <p className="font-medium text-black">{order.number}</p>
        </div>
        <div>
          <p className="text-gray-400">Order Placed</p>
          <p className="font-medium">{order.placed}</p>
        </div>
        <div>
          <p className="text-gray-400">Order Delivery</p>
          <p className="font-medium">{order.delivery}</p>
        </div>
        <div>
          <p className="text-gray-400">No. of Item</p>
          <p className="font-medium">{order.items.length} Items</p>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400">Status</p>
            <Badge
              variant="secondary"
              className="bg-orange-100 text-orange-500 border-0"
            >
              {order.status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Progress Bar with Steps */}
      <div className="w-full pt-6 pb-4 relative">
        {/* Full Track */}
        <div className="absolute mt-3 top-[20px] left-0 right-0 h-[6px] bg-gray-200 rounded-full z-0">
          <div
            className="h-full  bg-[#F6A920] rounded-full transition-all duration-300"
            style={{
              width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Steps */}
        <div className="flex justify-between items-center relative z-10">
          {statusSteps.map((step, index) => {
            const isActive = index <= currentStepIndex;

            return (
              <div
                key={step.label}
                className="flex flex-col items-center text-center w-[25%]"
              >
                {/* Dot */}
                <div
                  className={cn(
                    "w-5 h-5 rounded-full mb-2",
                    isActive ? "bg-[#F6A920]" : "bg-gray-300"
                  )}
                />
                {/* Label */}
                <p
                  className={cn(
                    "text-sm font-medium",
                    isActive ? "text-[#F6A920]" : "text-gray-700"
                  )}
                >
                  {step.label}
                </p>
                {/* Date */}
                <p
                  className={cn(
                    "text-xs mt-1",
                    isActive ? "text-[#F6A920]" : "text-gray-500"
                  )}
                >
                  {step.date}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Items */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-800">Order Items</h3>
        {order.items.map((item, i) => (
          <div key={i} className="flex gap-4">
            <img
              src={item.image}
              alt={item.title}
              className="w-20 h-28 object-cover rounded"
            />
            <div className="flex-1 text-sm">
              <p className="font-medium text-gray-800">{item.title}</p>
              <p className="text-muted-foreground">({item.edition})</p>
            </div>
            <div className="text-sm text-gray-700">
              <p>
                ${item.price.toFixed(2)} × {item.quantity}
              </p>
              <p className="font-semibold text-right">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="space-y-6 text-sm md:text-base text-gray-700 max-w-lg mr-auto">
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>${order.summary.subtotal.toFixed(2)}</p>
        </div>
        <div className="flex justify-between">
          <p>Shipping Charge</p>
          <p>${order.summary.shipping.toFixed(2)}</p>
        </div>
        <div className="flex justify-between">
          <p>Taxes</p>
          <p>${order.summary.taxes.toFixed(2)}</p>
        </div>
        <div className="flex justify-between text-green-600">
          <p>Discount</p>
          <p>-${order.summary.discount.toFixed(2)}</p>
        </div>
        <div className="flex justify-between font-semibold border-t pt-2">
          <p>Total</p>
          <p>${order.summary.total.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
