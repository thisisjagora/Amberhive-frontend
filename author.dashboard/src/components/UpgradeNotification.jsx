import { fetchProfile } from "@/redux/slices/authSlice";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const UpgradeNotification = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const isBlocked = user?.user?.block === "1";

  const [showNotification, setShowNotification] = useState(true);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleDismiss = () => {
    setShowNotification(false);
    sessionStorage.setItem("dismissedUpgradeNotice", "true");
  };

  useEffect(() => {
    const dismissed = sessionStorage.getItem("dismissedUpgradeNotice");
    if (dismissed === "true") {
      setShowNotification(false);
    }
  }, []);

  if (user?.user?.author?.subscription_id !== "1" || !showNotification) return null;

  return (
    <div className="bg-yellow-50 rounded-lg p-4 my-2">
      <h3 className="text-sm font-semibold text-gray-700">Update Available</h3>
      <p className="text-sm text-gray-600 mt-1">
        Do you wish to earn more with AmberHive? Checkout our offerings!
      </p>
      <div className="w-full h-2 bg-yellow-600 rounded-full mt-3" />
      <div className="flex gap-4 mt-3 text-sm">
        <button
          className="text-gray-700 cursor-pointer hover:underline"
          onClick={handleDismiss}
        >
          Dismiss
        </button>

        {isBlocked ? (
          <button
            className="text-gray-400 cursor-not-allowed"
            disabled
          >
            Click
          </button>
        ) : (
          <Link to="/dashboard/pricing">
            <button className="text-yellow-800 cursor-pointer hover:underline">
              Click
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default UpgradeNotification;
