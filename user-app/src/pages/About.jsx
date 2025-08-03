import DiscoverSection from "@/components/homeComp/DiscoverSection";
import EmpowermentSection from "@/components/homeComp/EmpowermentSection";
import Mission from "@/components/homeComp/Mission";
import PricingPlans from "@/components/homeComp/PricingPlans";
import React from "react";

const About = () => {
  return (
    <div>
      {" "}
      <Mission />
      <EmpowermentSection />
      <DiscoverSection />
      <PricingPlans />
    </div>
  );
};

export default About;
