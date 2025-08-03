import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router";
import TableComponent from "@/components/TableComponent";
import { useDispatch, useSelector } from "react-redux";
import { fetchCarts, removeCartItem } from "@/store/slice/cartSlice";
import { toast } from "sonner";

const Cart = () => {
  const dispatch = useDispatch();
  const { carts, status, error } = useSelector((state) => state.carts);
  const [removingItemId, setRemovingItemId] = useState(null);

  useEffect(() => {
    dispatch(fetchCarts());
  }, [dispatch]);

  const removeItem = async (itemId) => {
    try {
      setRemovingItemId(itemId);
      const resultAction = await dispatch(removeCartItem(itemId));

      if (removeCartItem.fulfilled.match(resultAction)) {
        await dispatch(fetchCarts());
        toast.success("Item removed from cart.");
      } else {
        toast.error(resultAction.payload || "Failed to remove item.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setRemovingItemId(null);
    }
  };

  const cartColumns = [
    {
      accessorKey: "image",
      id: "name",
      header: "Name of Book",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-4">
            {item.book.cover_image ? (
              <img
                src={`https://test.amber-hive.com/storage/${item.book.cover_image}`}
                alt={item.book.title}
                className="w-12 h-14 object-cover rounded-sm border border-gray-200"
              />
            ) : (
              <div className="w-16 h-20 flex items-center justify-center rounded-sm border border-gray-200 bg-gray-100 text-gray-500 text-xs">
                No Image
              </div>
            )}
            <span>{item.book.title}</span>
          </div>
        );
      },
      className: "w-1/3 py-4 text-gray-800",
    },
    {
      accessorKey: "price",
      id: "price",
      header: "Price",
      cell: ({ row }) => {
        const book = row.original.book;
        const currency = book?.currency?.toUpperCase() === "NGN" ? "₦" : "$";
        const hasDiscount =
          book?.discount_price &&
          parseFloat(book.discount_price) < parseFloat(book.price);

        return (
          <div className="flex gap-4 items-center">
            <span className="text-gray-800 font-medium">
              {currency}
              {hasDiscount ? book.discount_price : book.price}
            </span>
            {hasDiscount && (
              <span className="text-sm text-red-500 line-through">
                {currency}
                {book.price}
              </span>
            )}
          </div>
        );
      },
      className: "w-1/6 py-4 text-gray-800",
    },
    {
      id: "quantity",
      header: () => <div className="flex justify-center">Quantity</div>,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex justify-center items-center">
            <span className="text-gray-900">{item.quantity}</span>
          </div>
        );
      },
      className: "w-1/6 py-4",
    },
    {
      id: "remove",
      header: "Remove",
      cell: ({ row }) => {
        const itemId = row.original.id;
        const isLoading = removingItemId === itemId;

        return isLoading ? (
          <div className="w-4 h-4 animate-spin border-2 border-gray-400 border-t-transparent rounded-full" />
        ) : (
          <Trash2
            className="text-red-500 w-4 h-4 cursor-pointer"
            onClick={() => removeItem(itemId)}
          />
        );
      },
    },
  ];

  const getEffectivePrice = (book) => {
    const hasDiscount =
      book?.discount_price &&
      parseFloat(book.discount_price) < parseFloat(book.price);
    return hasDiscount
      ? parseFloat(book.discount_price)
      : parseFloat(book.price);
  };

  const total = carts?.items?.reduce((acc, item) => {
    const price = getEffectivePrice(item.book);
    return acc + price * item?.quantity;
  }, 0);

  return (
    <div className="max-w-[85rem] mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900">My Carts</h1>
        <p className="text-sm text-gray-500">Lists of items to be purchased</p>
      </div>

      {status === "failed" ? (
        <tr>
          <td colSpan="12" className="text-center py-4">
            <div className="flex justify-center items-center">
              Error. {error}.{" "}
              <span className="text-base font-semibold "> Try again later</span>
            </div>
          </td>
        </tr>
      ) : status === "loading" ? (
        <div className="flex justify-center items-center py-10">
          <span className="text-gray-500">Loading...</span>
        </div>
      ) : (
        <div>
          {carts?.items?.length === 0 ? (
            <div className="p-4 py-36 bg-white ">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="bg-gray-100 rounded-full p-2 inline-block">
                  <div className="bg-gray-200 rounded-full p-2">
                    <FiShoppingCart className="w-8 h-8" />
                  </div>
                </div>
                <h2 className="text-lg font-semibold">Your Cart is Empty</h2>
                <p className="text-base text-gray-500 max-w-[14rem]">
                  It looks like you haven’t made up your mind to shop with us
                  yet.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto border-b-2 border-gray-200 pb-8">
                <TableComponent
                  columns={cartColumns}
                  data={carts.items || []}
                  showPagination={carts.length > 7}
                />
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start mt-10 gap-6">
                <div className="flex items-start gap-2">
                  <Link
                    to="/books"
                    className="text-[#F6A920] text-sm cursor-pointer hover:font-semibold"
                  >
                    ← Continue Shopping
                  </Link>
                </div>
                <div className="w-full md:w-auto text-right space-y-4">
                  <div className="flex justify-between gap-4 text-sm text-gray-600">
                    <span>Shipping fee</span>
                    <span className="text-gray-800 font-medium text-base">
                      {/* Placeholder for shipping */}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 text-sm text-gray-600 pt-2">
                    <span>Total</span>
                    <span className="text-gray-900 font-bold text-2xl">
                      {(carts?.items?.[0]?.book?.currency?.toUpperCase() ===
                      "NGN"
                        ? "₦"
                        : "$") + total?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {carts?.items?.length > 0 && (
            <div className="flex justify-center items-center mt-10">
              <Link to="/checkout">
                <Button className="bg-black text-white hover:bg-gray-900 text-sm px-6 py-2 rounded-md">
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;
