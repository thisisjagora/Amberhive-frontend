import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner"; // <-- import toast
import {
  subscribeWithPaystack,
  subscribeWithStripe,
  freeSubscribe,
} from "@/redux/slices/subscribeSlice";
import { ArrowLeft } from "lucide-react";

const MembershipSignup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // <-- useNavigate hook

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const planId = params.get("plan_id");
  const priceStr = params.get("price");
  const duration = params.get("duration"); // default to 1 if not provided

  const [discountCode, setDiscountCode] = useState("");

  const [loadingUser, setLoadingUser] = useState(true);
  const [errorUser, setErrorUser] = useState(null);

  const [authorId, setAuthorId] = useState(null);

  const discountAmount = discountCode === "SAVE10" ? 10 : 0;

  const priceValue = useMemo(() => {
    const numeric = parseFloat(priceStr.replace(/[^0-9.]/g, ""));
    return isNaN(numeric) ? 0 : numeric;
  }, [priceStr]);

  const subtotal = priceValue;
  const shipping = 0;
  const taxes = 0;
  const total = priceValue;

  const [email, setEmail] = useState("");
  const [country] = useState("Nigeria");

  // const fetchUser = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       throw new Error("No authentication token found");
  //     }

  //     const response = await fetch(
  //       "https://test.amber-hive.com/api/v1/me/author",
    
  //       {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //           "ngrok-skip-browser-warning": "1",
  //           "User-Agent": "Custom-User-Agent",
  //         },
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch user data");
  //     }

  //     const data = await response.json();
  //     // console.log("Fetched user data:", data);

  //     setAuthorId(data.id);
  //   } catch (err) {
  //     console.error("Fetch error:", err);
  //     setErrorUser(err.message);
  //   } finally {
  //     setLoadingUser(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchUser();
  // }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.email) {
          setEmail(parsedUser.email);
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
      }
    }
  }, []);

  const statusPaystack = useSelector((state) => state.subscribe.statusPaystack);
  const statusStripe = useSelector((state) => state.subscribe.statusStripe);
  const error = useSelector((state) => state.subscribe.error);
  const statusFree = useSelector((state) => state.subscribe.statusFree);

  const handlePayment = async (provider) => {
    if (!planId) {
      toast.error("No plan ID found.");
      return;
    }

    try {
      let result;

      if (provider === "paystack") {
        result = await dispatch(
          subscribeWithPaystack({ plan_id: planId, duration })
        ).unwrap();

        toast.info("Redirecting to Paystack...");
        setTimeout(() => {
          window.location.href = result.authorization_url;
        }, 2000);
        return;
      } else if (provider === "stripe") {
        result = await dispatch(
          subscribeWithStripe({ plan_id: planId, duration })
        ).unwrap();

        const stripeUrl = result.original?.payment_url || result.payment_url;

        if (!stripeUrl) {
          toast.error("Stripe payment URL is missing.");
          return;
        }

        toast.info("Redirecting to Stripe...");
        setTimeout(() => {
          window.location.href = stripeUrl;
        }, 2000);
        return;
      } else if (provider === "free") {
        console.log(planId)
        result = await dispatch(freeSubscribe(planId)).unwrap();

        if (result?.authorization_url) {
          toast.info("Redirecting for free subscription...");
          setTimeout(() => {
            window.location.href = result.authorization_url;
          }, 2000);
          return;
        } else {
          toast.success(result.message || "Free subscription successful!");
          navigate("/profile-confirm");
          return;
        }
      }

      // Fallback (non-redirect response)
      if (result?.authorization_url) {
        toast.info("Redirecting...");
        setTimeout(() => {
          window.location.href = result.authorization_url;
        }, 2000);
      } else {
        toast.success(result.message || "Subscription successful!");
        navigate("/profile-confirm");
      }
    } catch (err) {
      toast.error(err.message);
      console.error("Payment failed:", err);
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-white p-8">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="max-w-5xl mx-auto mt-8 grid md:grid-cols-2 gap-10">
          {/* Order Summary */}
          <div>
            <h2 className="text-xl font-bold mb-2">Order Summary</h2>
            <div className="text-3xl font-semibold text-black flex items-baseline gap-2">
              {priceStr}{" "}
              <span className="text-sm text-gray-500">Billed Annually</span>
            </div>

            {/* Price Breakdown */}
            <div className="text-sm text-gray-700 space-y-6 border-t pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Charge</span>
                <span>{shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span>{taxes.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span>{discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-black border-t pt-2">
                <span>Total</span>
                <span>{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div>
            <div className="text-sm text-gray-500 mb-1">
              <span className="text-amber-600 font-semibold">
                Basic Details
              </span>{" "}
              / Payments
            </div>
            <h2 className="text-xl font-bold mb-4">Customer Details</h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm block mb-1 text-gray-600">
                  Email Address
                </label>
                <Input value={email} disabled />
              </div>

              <div>
                <label className="text-sm block mb-1 text-gray-600">
                  Country
                </label>
                <Input disabled value={country} />
              </div>

              <div className="grid grid-cols-1 gap-4 pt-4">
                {planId === "2" && (
                  <div className="flex flex-col gap-4">
                    <Button
                      onClick={() => handlePayment("paystack")}
                      variant="default"
                      className="w-full cursor-pointer"
                      disabled={statusPaystack === "loading"}
                    >
                      {statusPaystack === "loading"
                        ? "Processing..."
                        : "Pay with Paystack"}
                    </Button>

                    <Button
                      onClick={() => handlePayment("stripe")}
                      variant="outline"
                      className="w-full bg-gray-200 hover:bg-gray-300 cursor-pointer"
                      disabled={statusStripe === "loading"}
                    >
                      {statusStripe === "loading"
                        ? "Processing..."
                        : "Pay with Stripe"}
                    </Button>
                  </div>
                )}
                {planId === "1" && (
                  <Button
                    onClick={() => handlePayment("free")}
                    // variant="secondary"
                    className="w-full cursor-pointer"
                    disabled={statusFree === "loading"}
                  >
                    {statusFree === "loading"
                      ? "Processing..."
                      : "Subscribe for Free"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipSignup;
