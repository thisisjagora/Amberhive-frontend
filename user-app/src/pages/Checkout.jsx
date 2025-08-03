import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { checkout, fetchCarts, removeCartItem } from "@/store/slice/cartSlice";
import { toast } from "sonner";
import { getCurrencySymbol } from "@/utils/format";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [removingItemId, setRemovingItemId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    payment_method: "",
    shipping_address: "",
    billing_address: "",
    unit_price: 0,
    total_price: 0,
  });

  const { carts, statusCheckout } = useSelector((state) => state.carts);
  const cart = carts.items || [];

  useEffect(() => {
    dispatch(fetchCarts());
  }, [dispatch]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: null }));
  };

  const saveAddressToHistory = (field, value) => {
    if (!value || value.trim().length < 3) return;
    const key = `${field}_history`;
    const existing = JSON.parse(localStorage.getItem(key)) || [];
    if (!existing.includes(value.trim())) {
      const updated = [value.trim(), ...existing].slice(0, 5);
      localStorage.setItem(key, JSON.stringify(updated));
    }
  };

  const getAddressSuggestions = (key) => {
    return JSON.parse(localStorage.getItem(key)) || [];
  };

  const shippingSuggestions = getAddressSuggestions("shipping_address_history");
  const billingSuggestions = getAddressSuggestions("billing_address_history");

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

  // Validation function
  const validate = () => {
    const errors = {};

    if (!formData.shipping_address.trim()) {
      errors.shipping_address = "Shipping address is required";
      toast.error("Shipping address is required");
    }

    if (!formData.billing_address.trim()) {
      errors.billing_address = "Billing address is required";
      toast.error("Billing address is required");
    }

    // if (!formData.payment_method || formData.payment_method.trim() === "") {
    //   errors.payment_method = "Payment method is required";
    //   toast.error("Payment method is required");
    // }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    dispatch(fetchCarts()).then((action) => {
      const items = action.payload?.items || [];

      if (items.length > 0) {
        const currency = items[0]?.book?.currency?.toLowerCase();

        const defaultMethod =
          currency === "ngn"
            ? "paystack"
            : currency === "usd"
            ? "stripe"
            : null;

        setFormData((prev) => ({
          ...prev,
          payment_method: defaultMethod,
        }));
      }
    });
  }, [dispatch]);

  const getEffectivePrice = (book) => {
    const hasDiscount =
      book?.discount_price &&
      parseFloat(book.discount_price) < parseFloat(book.price);
    return hasDiscount
      ? parseFloat(book.discount_price)
      : parseFloat(book.price || 0);
  };

  const unitPrice =
    cart.length > 0
      ? cart.reduce((acc, item) => {
          const price = getEffectivePrice(item.book);
          const quantity = Number(item.quantity) || 1;
          return acc + price * quantity;
        }, 0) /
        cart.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0)
      : 0;

  const subtotal = cart.reduce((acc, item) => {
    const price = getEffectivePrice(item.book);
    const quantity = Number(item.quantity) || 1;
    return acc + price * quantity;
  }, 0);

  const vat = subtotal * 0.075;
  const total = subtotal + vat;

 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const payload = {
      ...formData,
      unit_price: unitPrice,
      total_price: total,
    };

    try {
      // ✅ Free book
      if (formData.payment_method === "") {
        const result = await dispatch(checkout(payload)).unwrap();
        // console.log(result)
        toast.success(result.message);
        navigate("/library");
        return;
      }

      // ✅ Paystack
      if (formData.payment_method === "paystack") {
        const result = await dispatch(checkout(payload)).unwrap();
        // console.log(result)
        const paystackUrl = result?.data?.authorization_url;

        if (!paystackUrl) {
          toast.error("Missing Paystack URL.");
          // console.error("Paystack result:", result);
          return;
        }

        toast.info("Redirecting to Paystack...");
        // console.log("Paystack URL:", paystackUrl);

        window.location.href = paystackUrl;
        return;
      }

      if (formData.payment_method === "stripe") {
        const result = await dispatch(checkout(payload)).unwrap();
        const stripeUrl = result?.data?.original?.payment_url;

        if (!stripeUrl) {
          toast.error("Missing Stripe URL.");
          // console.error("Stripe result:", result);
          return;
        }

        toast.info("Redirecting to Stripe...");
        // console.log("Stripe URL:", stripeUrl);

        window.location.href = stripeUrl;
        return;
      }

      // 🚨 Unexpected case
      toast.error("Unknown payment method or no action required.");
      console.error("Unexpected checkout result:", result);
    } catch (err) {
      toast.error(err.message || "Checkout failed");
      console.error("Checkout error:", err);
    }
  };

  const currencySymbol = cart[0]?.book?.currency
    ? getCurrencySymbol(cart[0].book.currency)
    : "";

  return (
    <div className="max-w-[90rem] mx-auto px-4 py-10 flex flex-col md:flex-row gap-6">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 md:p-6 w-full"
        noValidate
      >
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Checkout</h2>
          <Card>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Shipping Details</h3>

                <Input
                  list="shipping-suggestions"
                  placeholder="Shipping Address"
                  value={formData.shipping_address}
                  onChange={(e) =>
                    handleInputChange("shipping_address", e.target.value)
                  }
                  onBlur={(e) =>
                    saveAddressToHistory("shipping_address", e.target.value)
                  }
                  required
                  autoComplete="off"
                  aria-invalid={formErrors.shipping_address ? "true" : "false"}
                  aria-describedby="shipping-error"
                />
                <datalist id="shipping-suggestions">
                  {shippingSuggestions.map((addr, i) => (
                    <option key={i} value={addr} />
                  ))}
                </datalist>
                {formErrors.shipping_address && (
                  <p
                    className="text-red-600 text-sm mt-1"
                    id="shipping-error"
                    role="alert"
                  >
                    {formErrors.shipping_address}
                  </p>
                )}

                <Input
                  list="billing-suggestions"
                  placeholder="Billing Address"
                  value={formData.billing_address}
                  onChange={(e) =>
                    handleInputChange("billing_address", e.target.value)
                  }
                  onBlur={(e) =>
                    saveAddressToHistory("billing_address", e.target.value)
                  }
                  required
                  autoComplete="off"
                  aria-invalid={formErrors.billing_address ? "true" : "false"}
                  aria-describedby="billing-error"
                />
                <datalist id="billing-suggestions">
                  {billingSuggestions.map((addr, i) => (
                    <option key={i} value={addr} />
                  ))}
                </datalist>
                {formErrors.billing_address && (
                  <p
                    className="text-red-600 text-sm mt-1"
                    id="billing-error"
                    role="alert"
                  >
                    {formErrors.billing_address}
                  </p>
                )}
              </div>

              <Select
                value={formData.payment_method}
                onValueChange={(v) => handleInputChange("payment_method", v)}
                disabled // <- disable user interaction
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent className="font-gilroy">
                  <SelectItem value="paystack">Paystack</SelectItem>
                  <SelectItem value="stripe">Stripe</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Order Summary</h2>
          <Card>
            <CardContent className="space-y-6 pt-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <img
                    src={`https://test.amber-hive.com/storage/${item.book.cover_image}`}
                    alt={item.book.title}
                    className="w-16 h-24"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{item.book.title}</div>
                    <div className="text-base text-muted-foreground">
                      {item.format}
                    </div>
                    <div className="flex items-center gap-6 ">
                      <div className="text-base font-semibold">
                        {item?.book?.currency?.toUpperCase() === "NGN"
                          ? "₦"
                          : "$"}
                        {item.book?.discount_price &&
                        parseFloat(item.book.discount_price) <
                          parseFloat(item.book.price)
                          ? item.book.discount_price
                          : item.book.price}
                      </div>

                      {item.book?.discount_price &&
                        parseFloat(item.book.discount_price) <
                          parseFloat(item.book.price) && (
                          <div className="text-base text-red-500 line-through">
                            {item?.book?.currency?.toUpperCase() === "NGN"
                              ? "₦"
                              : "$"}
                            {item.book.price}
                          </div>
                        )}
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeItem(item.id)}
                    disabled={removingItemId === item.id}
                  >
                    {removingItemId === item.id ? (
                      <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4 text-red-500" />
                    )}
                  </Button>
                </div>
              ))}

              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>
                    {currencySymbol}
                    {subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (7.5%)</span>
                  <span>
                    {currencySymbol}
                    {vat.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>
                    {currencySymbol}
                    {total.toFixed(2)}
                  </span>
                </div>
              </div>
              <Button
                type="submit"
                className={`w-full ${
                  statusCheckout === "loading"
                    ? "cursor-wait"
                    : "cursor-pointer"
                }`}
                disabled={statusCheckout === "loading"}
              >
                {statusCheckout === "loading" ? "Processing..." : "Checkout"}
              </Button>
              <Button variant="outline" className="w-full " asChild>
                <Link to="/books" className=" cursor-pointer">
                  Back to Shopping
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
