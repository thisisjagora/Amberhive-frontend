import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  FiLogOut,
  FiUser,
  FiBook,
  FiCreditCard,
  FiBell,
  FiSettings,
  FiHelpCircle,
  FiGrid,
} from "react-icons/fi";
import AmberHiveLogo from "@/assets/Amberhive.png";
import { RiMenu2Line } from "react-icons/ri";
import { toast } from "sonner";

export default function MobileNavbar({ user, totalQuantity, handleLogout }) {
  const handleProtectedNavigation = (path) => {
    if (!user) {
      toast.warning("You have to login first.");
      navigate("/sign-in");
    } else {
      navigate(path);
    }
  };

  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    const initials =
      parts.length === 1
        ? parts[0][0]
        : parts[0][0] + parts[parts.length - 1][0];
    return initials.toUpperCase();
  };

  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white flex items-center justify-between px-4 py-2 border-b border-gray-100">
      <Link to="/">
        <img
          src={AmberHiveLogo}
          alt="Amber Hive Logo"
          className="w-28 h-auto"
        />
      </Link>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <RiMenu2Line className="w-20 h-20" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-[260px] sm:w-[300px] font-gilroy overflow-y-auto"
        >
          <div className="flex flex-col gap-6 p-4">
            <Link to="/" className="mb-2" onClick={() => setIsSheetOpen(false)}>
              <img
                src={AmberHiveLogo}
                alt="Amber Hive Logo"
                className="w-28 h-auto"
              />
            </Link>

            <div>
              {/* Main Nav */}
              <nav className="flex flex-col px-2 gap-4 text-sm font-medium text-gray-700">
                <Link to="/" onClick={() => setIsSheetOpen(false)}>
                  Home
                </Link>
                <Link to="/books" onClick={() => setIsSheetOpen(false)}>
                  All Books
                </Link>
                <Link to="/best-sellers" onClick={() => setIsSheetOpen(false)}>
                  Best Sellers
                </Link>
                <Link to="/new-releases" onClick={() => setIsSheetOpen(false)}>
                  New Releases
                </Link>
                <Link to="/about" onClick={() => setIsSheetOpen(false)}>
                  Membership
                </Link>
              </nav>

              <div className=" border-gray-200 pt-4">
                {/* Secondary Nav */}
                <nav className="flex flex-col gap-4 text-sm px-2 font-medium text-gray-700">
                  <button
                    onClick={() => {
                      setIsSheetOpen(false);
                      handleProtectedNavigation("/favourites");
                    }}
                    className="text-left"
                  >
                    Favorites
                  </button>

                  <button
                    onClick={() => {
                      setIsSheetOpen(false);
                      handleProtectedNavigation("/cart");
                    }}
                    className="relative text-left"
                  >
                    Cart
                    {totalQuantity > 0 && (
                      <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {totalQuantity}
                      </span>
                    )}
                  </button>
                </nav>

                {/* User */}
                {user ? (
                  <div className="flex flex-col gap-4 mt-8 text-sm text-gray-700">
                    {/* Avatar + name */}
                    <div className="flex items-center gap-3 px-2">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-[600]">
                          {getInitials(user.name)}
                        </div>
                      )}
                      <span className="font-semibold">{user.name}</span>
                    </div>

                    {/* User navigation links */}
                    <ul className="flex flex-col gap-2">
                      {[
                        {
                          to: "/profile",
                          icon: <FiUser />,
                          label: "Edit Profile",
                        },
                        {
                          to: "/library",
                          icon: <FiBook />,
                          label: "My Library",
                        },
                        // {
                        //   to: "/payment-methods",
                        //   icon: <FiCreditCard />,
                        //   label: "Payment Methods",
                        // },
                        {
                          to: "/notifications",
                          icon: <FiBell />,
                          label: "Notification",
                        },
                        {
                          to: "/settings",
                          icon: <FiSettings />,
                          label: "Settings",
                        },
                        {
                          to: "/support",
                          icon: <FiHelpCircle />,
                          label: "Support",
                        },
                        {
                          to: "/about",
                          icon: <FiGrid />,
                          label: "Author Dashboard",
                        },
                      ].map(({ to, icon, label }) => (
                        <li key={label}>
                          <Link
                            to={to}
                            onClick={() => setIsSheetOpen(false)}
                            className="flex items-center gap-3 px-2 py-1 rounded hover:bg-gray-100 transition"
                          >
                            {icon}
                            {label}
                          </Link>
                        </li>
                      ))}
                    </ul>

                    {/* Logout button */}
                    <button
                      onClick={() => {
                        setIsSheetOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-3 px-2 py-1 rounded text-red-600 hover:bg-red-100 transition w-full text-left"
                    >
                      <FiLogOut className="w-4 h-4" />
                      Log out
                    </button>
                  </div>
                ) : (
                  <Button
                    onClick={() => {
                      navigate("/sign-in");
                    }}
                    className="bg-black text-white text-sm rounded-md"
                  >
                    Login
                  </Button>
                )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
