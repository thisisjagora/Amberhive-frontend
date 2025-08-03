import React from "react";
import bannerImage from "@/assets/Ads.png";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Link } from "react-router";

export function BannerSection() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        backgroundImage: `url(${bannerImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay Content */}
      <div className="relative z-10 h-full flex flex-col gap-4 items-center justify-center py-16 px-6 md:px-12 lg:px-24 text-white">
        <Badge className="bg-yellow-100 text-[#966714] font-[600] px-3 py-1 text-sm">
          Our Online Book Lovers
        </Badge>
        <p className="text-xl mb-6 text-[#966714] font-semibold">
          10% Off Frequent Buyers Sales
        </p>
        <Link to="/books">
          <Button variant="default" className="cursor-pointer">Shop Now</Button>
        </Link>
      </div>
    </section>
  );
}
