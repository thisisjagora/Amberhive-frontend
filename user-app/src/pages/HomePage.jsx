import { BannerSection } from "@/components/homeComp/BannerSection";
import BestSellers from "@/components/homeComp/BestSellers";
import FeaturedBooks from "@/components/homeComp/Featured-Books";
import FeaturesCard from "@/components/homeComp/FeaturesCard";
import Hero from "@/components/homeComp/Hero";
import NewReleases from "@/components/homeComp/NewReleases";

const HomePage = () => {
  return (
    <div>
      <Hero />
      <FeaturesCard />
      <FeaturedBooks />
      <NewReleases />
      <BannerSection />
      <BestSellers />
    </div>
  );
};

export default HomePage;
