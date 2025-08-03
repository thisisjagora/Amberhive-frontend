import React, { useState, useEffect } from "react";

const DashboardHeader = () => {
  const [user, setUser] = useState({ name: "", email: "", imageUrl: "" });

  useEffect(() => {
    // Fetch user from localStorage and parse it
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          name: parsedUser.name || "Unknown User",
          email: parsedUser.email || "",
          imageUrl: parsedUser.imageUrl || "",
        });
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }
  }, []);

  return (
    <div className="flex flex-col px-4 mt-20 md:mt-0 py-6 justify-start items-start w-full">
      <div className="flex flex-col items-start gap-2">
        <h1 className="text-xl font-bold">
          Welcome back, {user.name ? user.name.split(" ")[0] : "Guest"}
        </h1>
        <p className="text-gray-500 text-sm">
          Track, manage and forecast your customers and book orders.
        </p>
      </div>
    </div>
  );
};

export default DashboardHeader;
