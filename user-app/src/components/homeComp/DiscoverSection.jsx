import { SiTicktick } from "react-icons/si";
import { Button } from "../ui/button";
import { Link } from "react-router";

export default function DiscoverSection() {
  return (
    <section className="mx-auto max-w-[90rem] px-4 py-12 md:py-24">
      <div className="bg-blue-50 p-6 md:p-12 rounded-2xl">
        <div className="md:px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-start">
            {/* Left side */}
            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-center md:text-left text-black mb-3">
                For <span className="text-blue-600">Readers</span>: Discover and
                Support African Literature
              </h3>
              <p className="text-gray-700 mb-6 text-center md:text-left text-base md:text-sm leading-relaxed">
                AmberHive is your gateway to the finest African storytelling.
                Whether you're looking for contemporary fiction, historical
                narratives, poetry, or thought-provoking essays, our platform
                brings together a diverse collection of books that celebrate
                Africa’s literary heritage.
              </p>
              <div className="flex justify-center md:justify-start mb-6">
                <Button asChild className="font-semibold px-5 py-2">
                  <Link to="/books">Explore AmberHive</Link>
                </Button>
              </div>
            </div>

            {/* Right side */}
            <div>
              <h4 className="text-lg font-semibold text-center md:text-left text-blue-600 mb-4">
                Why Read on AmberHive?
              </h4>
              <ul className="space-y-4 text-gray-700 text-base md:text-sm">
                {[
                  "A Curated Collection: Browse an extensive selection of books from established and emerging African authors.",
                  "Reader Accounts: Create wishlists, follow your favourite authors, and track your purchases.",
                  "Book Rankings: Discover trending books based on popularity and sales.",
                  "Community Engagement: Join discussions, leave reviews, and participate in literary events.",
                  "Directly Support Authors: Every purchase on AmberHive helps African writers earn and sustain their craft.",
                ].map((text, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <SiTicktick
                      className="text-blue-500 mt-1 shrink-0"
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
