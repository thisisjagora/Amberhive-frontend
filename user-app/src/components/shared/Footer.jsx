import { Link } from "react-router";
import AmberHiveLogo from "@/assets/Amberhive.png";

export default function Footer() {
  const year = new Date().getFullYear();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/books", label: "Books" },
    { to: "/about", label: "Membership" },
    { to: "/privacy-policy", label: "Privacy Policy" },
    { to: "/terms-and-conditions", label: "Terms & Conditions" },
    { to: "/about", label: "Become an Author" },
  ];

  return (
    <footer className="bg-black text-white py-10">
      <div className="max-w-[80rem] mx-auto px-4 space-y-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-0 justify-between">
          {/* Logo + Powered by */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link to="/" aria-label="AmberHive Home" title="AmberHive Home">
              <img
                src={AmberHiveLogo}
                alt="AmberHive Logo"
                className="w-32 h-auto"
              />
            </Link>
            <p className="text-sm font-medium">
              Powered by <span className="text-gray-400">Sophos Books</span>
            </p>
          </div>

          {/* Navigation */}
          <nav
            className=" flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-center md:text-left"
            aria-label="Footer Navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="hover:text-yellow-400 hover:underline transition"
                title={link.label}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Feedback */}
        <div className="flex justify-end">
          <div className="text-center md:text-left text-sm">
            Please send any feedback you have to:{" "}
            <a
              href="mailto:Feedback@amber-hive.com"
              className="hover:text-yellow-400 hover:underline"
              aria-label="Send feedback to AmberHive"
              rel="noopener noreferrer"
              title="Send Feedback"
            >
              Feedback@amber-hive.com
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-4 text-center text-sm text-gray-400">
          &copy; {year}{" "}
          <span className="font-medium text-white">AmberHive</span>. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
