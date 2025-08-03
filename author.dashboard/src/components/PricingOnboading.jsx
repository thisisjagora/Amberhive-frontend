import React, { useEffect, useState } from "react";
import { SiTicktick } from "react-icons/si";
import { FaBolt, FaLayerGroup } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubscriptionPlans } from "@/redux/slices/subscribeSlice";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";

export default function PricingOnboading() {
  const dispatch = useDispatch();

  const [isAnnually, setIsAnnually] = useState(false);
  const navigate = useNavigate();
  const { plans, status, error } = useSelector((state) => state.subscribe);

  useEffect(() => {
    dispatch(fetchSubscriptionPlans());
  }, [dispatch]);

  return (
    <section className="bg-[#FBDCA4] h-full py-12 font-gilroy">
      <div className="text-center mb-12">
        <div className="mb-4">
          <Badge className="bg-yellow-100 text-[#966714] font-[600] px-3 py-1 text-sm">
            Membership Tiers & Benefits
          </Badge>
        </div>
        <div className="max-w-2xl mx-auto flex flex-col">
          <p className="text-gray-700 px-6 md:px-0  text-center text-sm md:text-base">
            To cater to different author needs, AmberHive offers a multi-tier
            membership structure
          </p>
          <p className="text-gray-700 px-6 md:px-0 mt-2 text-center text-sm md:text-base">
            Our Standard Tier will launch in January 2026 and unlock unique book
            promotional features, higher royalty rates, higher book upload
            capacity, and other benefits. Click below to open your FREE
            membership account.
          </p>
        </div>
        <div className="flex items-center justify-center gap-2 py-6">
          <span
            className={`text-sm ${
              !isAnnually ? "font-bold text-black" : "text-gray-600"
            }`}
          >
            Monthly
          </span>

          <Switch
            id="pricing-switch"
            checked={isAnnually}
            onCheckedChange={setIsAnnually}
            className="data-[state=checked]:bg-[#F8B846]"
          />

          <span
            className={`text-sm ${
              isAnnually ? "font-bold text-black" : "text-gray-600"
            }`}
          >
            Annually
          </span>
        </div>
      </div>

      <div className="w-full max-w-3xl mx-auto grid md:grid-cols-2  gap-8 px-4">
        {plans?.map((plan, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md px-6 py-8 flex flex-col items-center text-center h-full"
          >
            {/* Icon bubble */}
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-yellow-100 p-3">
                <div className="rounded-full bg-yellow-200 p-3 flex items-center justify-center">
                  {plan.icon}
                </div>
              </div>
            </div>

            {/* Title and pricing */}
            <h3 className="text-md font-semibold text-amber-500 mb-">
              {plan.name}
            </h3>
            <p className="text-2xl font-bold text-black mb-1">
              {isAnnually
                ? `${(
                    Number(plan.monthly_price.replace(/[^\d.]/g, "")) * 12
                  ).toLocaleString()}`
                : plan.monthly_price}
            </p>
            <p className="text-xs text-gray-500 mb-4">
              {isAnnually ? "Billed annually." : "Billed monthly."}
            </p>

            {/* Features list */}
            <ul className="text-sm text-gray-700 space-y-2 mb-6  w-full max-w-sm flex-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <SiTicktick
                    className="text-yellow-400 mt-1 shrink-0"
                    size={16}
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* Get started button at bottom */}
            <div className="w-full mt-auto">
              <Link
                to={`/membership?plan_id=${plan.id}&price=${
                  isAnnually
                    ? (
                        Number(plan.monthly_price.replace(/[^\d.]/g, "")) * 12
                      ).toLocaleString()
                    : plan.monthly_price
                }&duration=${isAnnually ? 12 : 1}`}
                className="bg-black text-white w-full inline-block text-center py-2 rounded-md text-sm font-medium"
              >
                Get started
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
