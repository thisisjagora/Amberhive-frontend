import { useLocation, useNavigate, Link } from "react-router";
import {
  FiSearch,
  FiHeart,
  FiShoppingCart,
  FiChevronDown,
  FiUser,
  FiBook,
  FiBell,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiGrid,
} from "react-icons/fi";
import { useEffect, useState } from "react";

import AmberHiveLogo from "@/assets/Amberhive.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { logout } from "@/store/slice/authSlice";
import { useDispatch, useSelector } from "react-redux";
import MobileNavbar from "./MobileNavbar";
import { fetchCarts } from "@/store/slice/cartSlice";
import { toast } from "sonner";
import { fetchFavorites } from "@/store/slice/favoritesSlice";

export default function Navbar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { carts } = useSelector((state) => state.carts);
  const { favorites } = useSelector((state) => state.favorites);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchCarts());
    dispatch(fetchFavorites());
  }, [dispatch]);

  const isActive = (path) => location.pathname === path;

  const [user, setUser] = useState(null);

  const handleProtectedNavigation = (path) => {
    if (!user) {
      toast.warning("You have to login first.");
      navigate("/sign-in");
    } else {
      navigate(path);
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    return parts.length === 1
      ? parts[0][0]
      : parts[0][0] + parts[parts.length - 1][0];
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    navigate(`/searched-book?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleLogout = () => {
    dispatch(logout());
    setPopoverOpen(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <header className="w-full bg-black border-b border-gray-700">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black text-white transition-colors duration-300">
        <div className="max-w-[90rem] mx-auto px-4 py-4 hidden lg:flex items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="shrink-0 self-start md:self-center">
            <img
              src={AmberHiveLogo}
              alt="Amber Hive Logo"
              className="w-36 h-auto transition-all duration-300"
            />
          </Link>

          {/* Search and Nav Links */}
          <div className="flex flex-col w-full max-w-2xl gap-3">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative w-full">
              <FiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
                onClick={handleSearch}
              />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="pl-10 pr-3 py-2 rounded-md border w-full bg-white text-gray-700 border-gray-200"
              />
            </form>

            <nav className="flex flex-wrap gap-6 text-[15px] font-medium">
              {[
                { to: "/", label: "Home" },
                { to: "/books", label: "All Books" },
                { to: "/best-sellers", label: "Best Sellers" },
                { to: "/new-releases", label: "New Releases" },
                { to: "/about", label: "Membership" },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`transition-colors ${
                    isActive(to)
                      ? "text-yellow-500 font-semibold"
                      : "text-white hover:text-yellow-500"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            {/* Favorites */}
            <div
              onClick={() => handleProtectedNavigation("/favourites")}
              className={`relative flex items-center gap-2 cursor-pointer transition-colors ${
                isActive("/favourites")
                  ? "text-yellow-500 font-semibold"
                  : "text-white hover:text-yellow-500"
              }`}
            >
              <FiHeart className="w-5 h-5" />
              <span>Favorites</span>
              {favorites?.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </div>

            {/* Cart */}
            <div
              onClick={() => handleProtectedNavigation("/cart")}
              className={`relative flex items-center gap-2 cursor-pointer transition-colors ${
                isActive("/cart")
                  ? "text-yellow-500 font-semibold"
                  : "text-white hover:text-yellow-500"
              }`}
            >
              <FiShoppingCart className="w-5 h-5" />
              <span>Cart</span>
              {carts?.items?.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {carts.items.length}
                </span>
              )}
            </div>

            {/* User Dropdown */}
            {user ? (
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    title={user.name}
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold bg-gray-700 text-white">
                        {getInitials(user.name)}
                      </div>
                    )}
                    <FiChevronDown className="w-5 h-5 text-white" />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-52 p-2 text-sm font-gilroy">
                  <ul className="flex flex-col gap-2 text-gray-700">
                    {[
                      { to: "/profile", icon: FiUser, label: "Profile" },
                      { to: "/library", icon: FiBook, label: "My Library" },
                      {
                        to: "/notifications",
                        icon: FiBell,
                        label: "Notification",
                      },
                      { to: "/settings", icon: FiSettings, label: "Settings" },
                      { to: "/support", icon: FiHelpCircle, label: "Support" },
                      { to: "/about", icon: FiGrid, label: "Become an Author" },
                    ].map(({ to, icon: Icon, label }) => (
                      <li key={to}>
                        <Link
                          to={to}
                          onClick={() => setPopoverOpen(false)}
                          className="flex items-center gap-3 px-2 py-1 rounded hover:bg-gray-100"
                        >
                          <Icon className="w-4 h-4" />
                          {label}
                        </Link>
                      </li>
                    ))}
                    <li
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-2 py-1 rounded cursor-pointer text-red-600 hover:bg-red-100"
                    >
                      <FiLogOut className="w-4 h-4" />
                      Log out
                    </li>
                  </ul>
                </PopoverContent>
              </Popover>
            ) : (
              <Button
                onClick={() => navigate("/sign-in")}
                className="text-sm rounded-md transition-all cursor-pointer px-4 py-2 bg-white text-black hover:bg-gray-100"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navbar */}
      <MobileNavbar
        user={user}
        carts={carts?.items?.length}
        handleLogout={handleLogout}
      />
    </header>
  );
}
