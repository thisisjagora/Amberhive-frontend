import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import {
  FaChevronDown,
  FaChevronUp,
  FaSearch,
  FaUserCircle,
} from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
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

import AmberHiveLogo from "@/assets/Amberhive.png";
import HamburgerIcon from "@/assets/icons/humb.png";
import { links } from "../SANavigations";
import { fetchProfile, logout } from "@/redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { FiLogOut } from "react-icons/fi";

const SuperAdminSidebar = () => {
  const [openSections, setOpenSections] = useState(() => {
    const initialState = {};
    links.forEach((link) => {
      initialState[link.name.toLowerCase()] = false;
      if (
        link.subLinks &&
        link.subLinks.some((subLink) =>
          location.pathname.startsWith(subLink.path)
        )
      ) {
        initialState[link.name.toLowerCase()] = true;
      }
    });
    return initialState;
  });
  const dispatch = useDispatch();
  const notificationCount = [];
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "", imageUrl: "" });

  const { profile, fetchProfileStatus } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    // Fetch user from localStorage and parse it
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          name: parsedUser.name || "Unknown User",
          email: parsedUser.email || "",
          imageUrl: parsedUser.imageUrl || "", // adapt key if different
        });
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }
  }, []);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(logout());
    navigate("/");
  };

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-72 h-screen bg-white border-r flex-col p-4">
        <div className="mb-2">
          <img
            src={AmberHiveLogo}
            alt="Amber Hive Logo"
            className="mb-6 w-32 h-auto"
          />
        </div>

        <div className="mt-4 flex-1 overflow-y-auto">
          <nav className="space-y-4">
            {links.map((link) => (
              <div key={link.name}>
                {/* Top-level: toggle if has subLinks, else NavLink or Div */}
                {link.subLinks.length > 0 ? (
                  <div
                    className="flex items-center justify-between text-gray-600 cursor-pointer w-full py-1 pr-2"
                    onClick={() => toggleSection(link.name.toLowerCase())}
                  >
                    <div className="flex items-center gap-1">
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
                    <button>
                      {openSections[link.name.toLowerCase()] ? (
                        <FaChevronUp className="text-yellow-500" />
                      ) : (
                        <FaChevronDown className="text-gray-500" />
                      )}
                    </button>
                  </div>
                ) : link.path ? (
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      [
                        "flex items-center gap-2 justify-between py-1 rounded-sm text-gray-600 hover:text-yellow-600 w-full",
                        isActive && "bg-yellow-50 font-[600] text-yellow-600",
                      ]
                        .filter(Boolean)
                        .join(" ")
                    }
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
                ) : (
                  <div className="flex items-center gap-2 py-1 rounded-sm text-gray-400 cursor-not-allowed w-full">
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
                )}

                {/* Desktop sub-nav */}
                {openSections[link.name.toLowerCase()] &&
                  link.subLinks.length > 0 && (
                    <div className="pl-6 flex flex-col gap-1 text-gray-600 text-sm mt-2">
                      {link.subLinks.map((subLink) => (
                        <NavLink
                          key={subLink.name}
                          to={subLink.path}
                          className={({ isActive }) =>
                            [
                              "flex justify-between items-center py-1 px-4 rounded-sm",
                              isActive
                                ? "bg-yellow-50 font-[600] text-yellow-600"
                                : "text-gray-600 hover:text-yellow-600",
                            ].join(" ")
                          }
                        >
                          <span>{subLink.name}</span>
                          {subLink.name === "Notification" &&
                            notificationCount.length > 0 && (
                              <Badge
                                variant="outline"
                                className="rounded-full bg-red-100 text-red-600 px-2 py-0.5 text-xs font-[600]"
                              >
                                {notificationCount.length}
                              </Badge>
                            )}
                        </NavLink>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Avatar className="w-10 h-10">
                {profile?.user?.image ? (
                  <AvatarImage
                    src={`https://test.amber-hive.com/storage/${profile?.user?.image}`}
                    alt={user.name}
                  />
                ) : (
                  <AvatarFallback>
                    <FaUserCircle className="w-10 h-10 text-gray-400" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {profile?.user?.name}
                </p>

                <p className="text-xs text-gray-500">{profile?.user?.email}</p>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-red-600 hover:text-gray-100 cursor-pointer transition duration-200">
                  <FiLogOut />
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md rounded-xl shadow-lg">
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold text-gray-800 font-gilroy">
                    Confirm Logout
                  </DialogTitle>
                  <p className="text-sm text-gray-500 mt-1 font-gilroy">
                    Are you sure you want to log out? You will need to log in
                    again to continue using AmberHive.
                  </p>
                </DialogHeader>

                <DialogFooter className="flex justify-end gap-3 mt-6 font-gilroy">
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      className="px-4 py-2 text-sm font-medium cursor-pointer text-gray-700 hover:bg-gray-200"
                    >
                      Cancel
                    </Button>
                  </DialogClose>

                  <Button
                    variant="destructive"
                    className="px-4 py-2 text-sm font-medium cursor-pointer text-white"
                    onClick={handleLogout}
                  >
                    Log Out
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <Sheet>
        <div className="fixed top-0 left-0 right-0 z-50 flex md:hidden w-11/12 mx-auto items-center justify-between bg-white px- py-4 border-b">
          <img
            src={AmberHiveLogo}
            alt="Amber Hive Logo"
            className="w-28 h-auto"
          />
          <SheetTrigger asChild>
            <img
              src={HamburgerIcon}
              alt="Hamburger Icon"
              className="w-6 h-auto"
            />
          </SheetTrigger>
          {/* </div> */}
        </div>

        <SheetContent className="p-0 overflow-hidden max-w-xs">
          <div className="h-screen bg-white p-4 flex flex-col">
            <div className="mb-6">
              <img
                src={AmberHiveLogo}
                alt="Amber Hive Logo"
                className="mb-6 w-32 h-auto"
              />
            </div>

            <div className="mt-4 flex-1 overflow-y-auto">
              <nav className="space-y-4">
                {links.map((link) => (
                  <div key={link.name}>
                    {/* Top-level: toggle if has subLinks, else NavLink or Div */}
                    {link.subLinks.length > 0 ? (
                      <div
                        className="flex items-center justify-between text-gray-600 cursor-pointer w-full py-1 pr-2"
                        onClick={() => toggleSection(link.name.toLowerCase())}
                      >
                        <div className="flex items-center gap-1">
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
                        <button>
                          {openSections[link.name.toLowerCase()] ? (
                            <FaChevronUp className="text-yellow-500" />
                          ) : (
                            <FaChevronDown className="text-gray-500" />
                          )}
                        </button>
                      </div>
                    ) : link.path ? (
                      <NavLink
                        to={link.path}
                        className={({ isActive }) =>
                          [
                            "flex items-center gap-2 justify-between py-1 rounded-sm text-gray-600 hover:text-yellow-600 w-full",
                            isActive &&
                              "bg-yellow-50 font-[600] text-yellow-600",
                          ]
                            .filter(Boolean)
                            .join(" ")
                        }
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
                    ) : (
                      <div className="flex items-center gap-2 py-1 rounded-sm text-gray-400 cursor-not-allowed w-full">
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
                    )}

                    {/* Desktop sub-nav */}
                    {openSections[link.name.toLowerCase()] &&
                      link.subLinks.length > 0 && (
                        <div className="pl-6 flex flex-col gap-1 text-gray-600 text-sm mt-2">
                          {link.subLinks.map((subLink) => (
                            <NavLink
                              key={subLink.name}
                              to={subLink.path}
                              className={({ isActive }) =>
                                [
                                  "flex justify-between items-center py-1 px-4 rounded-sm",
                                  isActive
                                    ? "bg-yellow-50 font-[600] text-yellow-600"
                                    : "text-gray-600 hover:text-yellow-600",
                                ].join(" ")
                              }
                            >
                              <span>{subLink.name}</span>
                              {subLink.name === "Notification" &&
                                notificationCount.length > 0 && (
                                  <Badge
                                    variant="outline"
                                    className="rounded-full bg-red-100 text-red-600 px-2 py-0.5 text-xs font-[600]"
                                  >
                                    {notificationCount.length}
                                  </Badge>
                                )}
                            </NavLink>
                          ))}
                        </div>
                      )}
                  </div>
                ))}
              </nav>
            </div>
          </div>

          {/* Footer */}
          <SheetFooter>
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    {profile?.user?.image ? (
                      <AvatarImage
                        src={`https://test.amber-hive.com/storage/${profile?.user?.image}`}
                        alt={user.name}
                      />
                    ) : (
                      <AvatarFallback>
                        <FaUserCircle className="w-10 h-10 text-gray-400" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {profile?.user?.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      {profile?.user?.email}
                    </p>
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-red-600 hover:text-gray-100 cursor-pointer transition duration-200">
                      <FiLogOut />
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-md rounded-xl shadow-lg">
                    <DialogHeader>
                      <DialogTitle className="text-lg font-semibold text-gray-800 font-gilroy">
                        Confirm Logout
                      </DialogTitle>
                      <p className="text-sm text-gray-500 mt-1 font-gilroy">
                        Are you sure you want to log out? You will need to log
                        in again to continue using AmberHive.
                      </p>
                    </DialogHeader>

                    <DialogFooter className="flex justify-end gap-3 mt-6 font-gilroy">
                      <DialogClose asChild>
                        <Button
                          variant="outline"
                          className="px-4 py-2 text-sm cursor-pointer font-medium text-gray-700 hover:bg-gray-200"
                        >
                          Cancel
                        </Button>
                      </DialogClose>

                      <Button
                        variant="destructive"
                        className="px-4 py-2 text-sm cursor-pointer font-medium text-white"
                        onClick={handleLogout}
                      >
                        Log Out
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default SuperAdminSidebar;
