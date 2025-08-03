import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaChevronDown, FaChevronUp, FaUserCircle } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { links } from "../Navigations";

import AmberHiveLogo from "@/assets/Amberhive.png";
import HamburgerIcon from "@/assets/icons/humb.png";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, logout } from "@/redux/slices/authSlice";
import UpgradeNotification from "../UpgradeNotification";
import { FiLogOut } from "react-icons/fi";

const Sidebar = () => {
  const [openSections, setOpenSections] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const isBlocked = user?.user?.block === "1";

  // console.log(isBlocked);

  useEffect(() => {
    dispatch(fetchProfile());

    const initialState = {};
    links.forEach((link) => {
      initialState[link.name.toLowerCase()] =
        link.subLinks?.some((subLink) =>
          location.pathname.startsWith(subLink.path)
        ) || false;
    });
    setOpenSections(initialState);
  }, [dispatch]);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("dismissedUpgradeNotice");
    dispatch(logout());
    navigate("/");
  };

  const renderLink = (link, isSub = false) => {
    const isSupport = link.name.toLowerCase() === "support";
    const disabled = isBlocked && !isSupport;

    const classes = (isActive) =>
      [
        isSub
          ? "flex justify-between items-center py-1 px-4 rounded-sm text-sm"
          : "flex items-center gap-2 justify-between py-1 rounded-sm w-full",
        disabled
          ? "text-gray-400 cursor-not-allowed"
          : "text-gray-600 hover:text-yellow-600",
        isActive && !disabled && "bg-yellow-50 font-[600] text-yellow-600",
      ]
        .filter(Boolean)
        .join(" ");

    const onClick = (e) => {
      if (disabled) e.preventDefault();
    };

    return (
      <NavLink
        key={link.name}
        to={disabled ? "#" : link.path}
        className={({ isActive }) => classes(isActive)}
        onClick={onClick}
      >
        <div className="flex items-center gap-2">
          {link.icon}
          <span>{link.name}</span>
          {link.name === "Community" && (
            <Badge
              variant="outline"
              className="rounded-full bg-green-600 text-white px-2 py-0.5 text-xs"
            >
              Coming Soon
            </Badge>
          )}
        </div>
      </NavLink>
    );
  };

  return (
    <>
      {/* DESKTOP */}
      <aside className="hidden lg:flex w-72 h-screen bg-white border-r flex-col p-4">
        <img src={AmberHiveLogo} alt="Logo" className="mb-6 w-32 h-auto" />

        <div className="mt-4 flex-1 overflow-y-auto">
          <nav className="space-y-4">
            {links.map((link) => (
              <div key={link.name}>
                {link.subLinks?.length > 0 ? (
                  <div
                    className="flex items-center justify-between text-gray-600 cursor-pointer w-full py-1 pr-2"
                    onClick={() => toggleSection(link.name.toLowerCase())}
                  >
                    <div className="flex items-center gap-1">
                      {link.icon}
                      <span>{link.name}</span>
                    </div>
                    <button>
                      {openSections[link.name.toLowerCase()] ? (
                        <FaChevronUp className="text-yellow-500" />
                      ) : (
                        <FaChevronDown className="text-gray-500" />
                      )}
                    </button>
                  </div>
                ) : (
                  renderLink(link)
                )}

                {openSections[link.name.toLowerCase()] &&
                  link.subLinks?.length > 0 && (
                    <div className="pl-6 flex flex-col gap-1 mt-2">
                      {link.subLinks.map((subLink) =>
                        renderLink(subLink, true)
                      )}
                    </div>
                  )}
              </div>
            ))}
          </nav>
        </div>

        <UpgradeNotification />

        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                {user?.user?.author?.profile_image ? (
                  <AvatarImage
                    src={`https://test.amber-hive.com/storage/${user?.user?.author?.profile_image}`}
                    alt={user?.user?.name}
                  />
                ) : (
                  <AvatarFallback>
                    <FaUserCircle className="w-10 h-10 text-gray-400" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {user?.user?.name}
                </p>
                <p className="text-xs text-gray-500">{user?.user?.email}</p>
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="p-2 rounded-md cursor-pointer bg-gray-100 text-gray-600 hover:bg-red-600 hover:text-white">
                  <FiLogOut />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md font-gilroy rounded-xl shadow-lg">
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold text-gray-800">
                    Confirm Logout
                  </DialogTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    Are you sure you want to log out? You will need to log in
                    again.
                  </p>
                </DialogHeader>
                <DialogFooter className="flex justify-end gap-3 mt-6">
                  <DialogClose asChild>
                    <Button variant="outline" className={`cursor-pointer`}>Cancel</Button>
                  </DialogClose>
                  <Button variant="destructive" className={`cursor-pointer`} onClick={handleLogout}>
                    Log Out
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </aside>

      {/* MOBILE */}
      <Sheet>
        <div className="fixed top-0 left-0 right-0 z-50 flex lg:hidden w-11/12 mx-auto items-center justify-between bg-white px-4 py-4 border-b">
          <img src={AmberHiveLogo} alt="Logo" className="w-28 h-auto" />
          <SheetTrigger asChild>
            <img src={HamburgerIcon} alt="Menu" className="w-6 h-auto" />
          </SheetTrigger>
        </div>

        <SheetContent className="p-0 overflow-auto font-gilroy max-w-xs">
          <div className="h-screen bg-white p-4 flex flex-col">
            <img src={AmberHiveLogo} alt="Logo" className="mb-6 w-32 h-auto" />

            <div className="mt-4 flex-1 overflow-y-auto">
              <nav className="space-y-4">
                {links.map((link) => (
                  <div key={link.name}>
                    {link.subLinks?.length > 0 ? (
                      <div
                        className="flex items-center justify-between text-gray-600 cursor-pointer w-full py-1 pr-2"
                        onClick={() => toggleSection(link.name.toLowerCase())}
                      >
                        <div className="flex items-center gap-1">
                          {link.icon}
                          <span>{link.name}</span>
                        </div>
                        <button>
                          {openSections[link.name.toLowerCase()] ? (
                            <FaChevronUp className="text-yellow-500" />
                          ) : (
                            <FaChevronDown className="text-gray-500" />
                          )}
                        </button>
                      </div>
                    ) : (
                      renderLink(link)
                    )}

                    {openSections[link.name.toLowerCase()] &&
                      link.subLinks?.length > 0 && (
                        <div className="pl-6 flex flex-col gap-1 mt-2">
                          {link.subLinks.map((subLink) =>
                            renderLink(subLink, true)
                          )}
                        </div>
                      )}
                  </div>
                ))}
              </nav>
            </div>

            <UpgradeNotification />

            <SheetFooter>
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage
                        src={`https://test.amber-hive.com/storage/${user?.user?.author?.profile_image}`}
                        alt={user?.user?.name}
                      />
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {user?.user?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user?.user?.email}
                      </p>
                    </div>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="p-2 rounded-md cursor-pointer bg-gray-100 text-gray-600 hover:bg-red-600 hover:text-white">
                        <FiLogOut />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md rounded-xl font-gilroy shadow-lg">
                      <DialogHeader>
                        <DialogTitle className="text-lg font-semibold text-gray-800">
                          Confirm Logout
                        </DialogTitle>
                        <p className="text-sm text-gray-500 mt-1">
                          Are you sure you want to log out? You will need to log
                          in again.
                        </p>
                      </DialogHeader>
                      <DialogFooter className="flex justify-end gap-3 mt-6">
                        <DialogClose asChild>
                          <Button variant="outline" className={`cursor-pointer`}>Cancel</Button>
                        </DialogClose>
                        <Button variant="destructive" className={`cursor-pointer`} onClick={handleLogout}>
                          Log Out
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Sidebar;
