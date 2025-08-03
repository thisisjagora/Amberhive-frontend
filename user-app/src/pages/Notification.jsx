import React, { useEffect } from "react";
import { FaCircle } from "react-icons/fa";
import { BsBell } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { fetchAnnouncements } from "@/store/slice/announcementSlice";
import { Skeleton } from "@/components/ui/skeleton"; // ✅ make sure the path is correct
import { formatDate } from "@/utils/format";

const Notification = () => {
  const dispatch = useDispatch();
  const { announcements, statusFetchAnnouncements, error } = useSelector(
    (state) => state.announcement
  );

  useEffect(() => {
    dispatch(fetchAnnouncements());
  }, [dispatch]);

  const isLoading = statusFetchAnnouncements === "loading";

  return (
    <div className="max-w-[85rem] mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
        <p className="text-sm text-gray-500">
          Get notified for updates on the platform.
        </p>
      </div>

      {/* Loading skeletons */}
      {isLoading ? (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="flex items-start gap-4 border-b pb-6">
              <Skeleton className="w-20 h-24 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="w-1/2 h-4" />
                <Skeleton className="w-1/3 h-3" />
                <Skeleton className="w-full h-3 mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : announcements?.length === 0 ? (
        <div className="p-4 py-12 bg-white">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="bg-gray-100 rounded-full p-2 inline-block">
              <div className="bg-gray-200 rounded-full p-2">
                <BsBell className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                There is nothing to see here
              </h2>
              <p>You do not have any notification yet!</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {announcements.map((notif) => (
            <div
              key={notif.id}
              className="flex items-start gap-4 border-b pb-6"
            >
              <div className="relative shrink-0">
                <img
                  src={`https://test.amber-hive.com/storage/${notif.image_path}`}
                  alt={notif.name}
                  className="w-20 h-24 rounded-md object-cover"
                />
                {Date.now() - new Date(notif.created_at).getTime() <
                  24 * 60 * 60 * 1000 && (
                  <FaCircle className="text-red-500 text-xs absolute -bottom-1 right-1" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex flex-col-reverse gap-2">
                    <h4 className="font-semibold text-gray-800">
                      {notif.title}
                    </h4>
                    <div className="flex items-start md:items-center flex-col-reverse md:flex-row gap-2 text-xs text-gray-400">
                      <span>{formatDate(notif.created_at)}</span>
                    </div>
                  </div>
                </div>
                <div
                  className="text-gray-600 text-sm mt-2 "
                  dangerouslySetInnerHTML={{ __html: notif.message }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notification;
