import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useNavigate } from "react-router";
import Autoplay from "embla-carousel-autoplay";
import Herobg from "@/assets/hero-bg.png";
import Hero1 from "@/assets/hero-1.png";
import Hero2 from "@/assets/hero2.jpg";
import { useEffect, useState } from "react";

export default function Hero() {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState(null);

  const slides = [
    {
      badge: "Welcome to AmberHive",
      title: "Buy and Sell books for the best prices with AmberHive Today.",
      desc: `AmberHive is a pioneering platform dedicated to showcasing the richness of African literary talent. 
        Designed for both authors and readers, it is more than just a publishing space—it is a thriving ecosystem 
        that nurtures creativity, fosters learning, and generates opportunities for African writers.`,
      img: Hero1,
      cta: "Shop with Us",
    },
    {
      badge: "Featured Books",
      title: "Leader Shift",
      desc: `Dive into exclusive stories with our featured novel—carefully selected for its unmatched storytelling and performance. 
        Whether you're seeking knowledge or simply something that stands out, this book is a true marvel in its depth.`,
      img: Hero2,
      cta: "Buy",
    },
    {
      badge: "Our Mission",
      title: "Amplifying African Voices",
      desc: `AmberHive is committed to amplifying African voices, bridging the gap between writers and readers, and ensuring 
        that the continent’s literary work is accessible to a global audience.`,
      cta: "Learn more",
    },
  ];

  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setSelectedIndex(carouselApi.selectedScrollSnap());
    };

    carouselApi.on("select", onSelect);
    onSelect(); // run on mount

    return () => {
      carouselApi?.off("select", onSelect);
    };
  }, [carouselApi]);

  return (
    <section className="relative mt-6 lg:mt-16 py-4 bg-white">
      {/* Background graphic for large screens only */}
      <div className="hidden lg:block absolute top-0 left-0">
        <img
          src={Herobg}
          alt="Decorative"
          className="w-[450px] object-contain"
        />
      </div>

      <Carousel
        className="w-full max-w-[1240px] mx-auto px-4"
        plugins={[Autoplay({ delay: 4000 })]}
        setApi={setCarouselApi}
      >
        <CarouselContent className="mb-10">
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              {index === 2 ? (
                // Slide 3: Full-width centered content
                <div className="flex flex-col items-start mt-24 lg:mt-4 lg:items-center justify-center text-left lg:text-center max-w-2xl mx-auto space-y-6 ">
                  <Badge className="bg-yellow-100 text-yellow-700 px-4 py-1.5 text-base font-semibold">
                    {slide.badge}
                  </Badge>
                  <h1 className="text-2xl lg:text-4xl font-bold leading-snug text-black">
                    {slide.title}
                  </h1>
                  <p className="text-gray-700 text-sm lg:text-base leading-relaxed">
                    {slide.desc}
                    <br />
                    We aim to provide African authors with the tools, knowledge,
                    and opportunities to thrive in the publishing industry while
                    fostering a vibrant community of engaged readers.
                  </p>
                  <Button
                    onClick={() => navigate("/about")}
                    className="bg-black hover:bg-gray-900 cursor-pointer text-white px-6 py-2 rounded"
                  >
                    {slide.cta}
                  </Button>
                </div>
              ) : (
                // Slide 1 & 2: Text on top, image below (mobile + tablet), side-by-side only on desktop
                <div
                  className={`flex flex-col ${
                    index === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
                  } gap-10 px-4 items-center`}
                >
                  {/* Text content */}
                  <div className="w-full lg:w-1/2 space-y-6 text-left order-1">
                    <Badge className="bg-yellow-100 text-yellow-700 px-4 py-1.5 text-base font-semibold">
                      {slide.badge}
                    </Badge>
                    <h1 className="text-2xl lg:text-4xl font-bold leading-snug text-black">
                      {slide.title}
                    </h1>
                    <p className="text-gray-700 text-sm lg:text-base leading-relaxed">
                      {slide.desc}
                    </p>
                    <Button
                      onClick={() => navigate("/books")}
                      className="bg-black hover:bg-gray-900 cursor-pointer text-white px-6 py-2 rounded"
                    >
                      {slide.cta}
                    </Button>
                  </div>

                  {/* Image content */}

                  <div className="w-full lg:w-1/2 flex justify-center order-2">
                    <img
                      src={slide.img}
                      alt={`Slide ${index + 1}`}
                      className={`w-full ${
                        index === 1
                          ? "max-w-[180px] md:max-w-[220px] lg:max-w-[280px]" // smaller for slide 2
                          : "max-w-xs sm:max-w-sm md:max-w-[480px]"
                      }`}
                    />
                  </div>
                </div>
              )}
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Pagination Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => carouselApi?.scrollTo(index)}
              className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                selectedIndex === index
                  ? "bg-yellow-400 scale-125"
                  : "bg-yellow-200"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </section>
  );
}
