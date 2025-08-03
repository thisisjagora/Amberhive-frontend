import { SiTicktick } from "react-icons/si";
import { Button } from "../ui/button";
import { Link } from "react-router";

export default function EmpowermentSection() {
  return (
    <section className="mx-auto max-w-[90rem] px-4 py-12 md:py-24">
      <div className="bg-orange-50 p-6 md:p-12 rounded-2xl">
        <div className="md:px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            {/* Left side */}
            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-center md:text-left text-black mb-3">
                For <span className="text-amber-500">Authors</span>: Empowering
                African Writers
              </h3>
              <p className="text-gray-700 mb-6 text-center md:text-left text-base md:text-sm leading-relaxed">
                At AmberHive, we believe that African stories deserve global
                recognition. Our platform provides a comprehensive suite of
                tools and services to help authors publish, promote, and profit
                from their work.
              </p>
              <div className="flex justify-center md:justify-start">
                <Button asChild className="font-semibold px-5 py-2">
                  <a
                    href="https://author.amber-hive.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Become an Author
                  </a>
                </Button>
              </div>
            </div>

            {/* Right side */}
            <div>
              <h4 className="text-lg font-semibold text-center md:text-left text-amber-600 mb-4">
                What AmberHive offers Authors
              </h4>
              <ul className="space-y-4 text-gray-700 text-base md:text-sm">
                {[
                  "Self-Publishing Tools: Easily upload and format your manuscripts for ebook and paperback distribution.",
                  "Royalty & Sales Dashboard: Track book sales and earnings in real-time.",
                  "Author Pages & Profiles: Build a strong online presence with a customizable author page.",
                  "Bookstore Listings: Sell directly to readers on AmberHive and access broader distribution channels.",
                  "Competitions & Anthologies: Participate in curated writing opportunities to gain exposure.",
                  "Community & Networking: Connect with fellow authors, share experiences, and learn from industry experts.",
                  "Exclusive Membership Benefits: Depending on your membership tier, enjoy enhanced promotional credits, discounts on publishing services, and higher royalty percentages.",
                ].map((text, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <SiTicktick
                      className="text-amber-500 mt-1 shrink-0"
                      size={16}
                    />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
