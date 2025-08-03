import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchProfile } from "@/store/slice/profileSlice";
import { formatDate } from "@/utils/format";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  return (
    <div className="max-w-[80rem] mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900">Profile</h1>
      </div>
      <div className="flex flex-col ml-2 py-6">
        <div className="pt-6 space-y-8">
          {/* Name */}
          <div className="flex justify-between items-start">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Label htmlFor="name" className="font-semibold text-gray-600">
                Name
              </Label>
              <div className="flex gap-4">
                {status === "loading" ? (
                  <Skeleton className="h-10 w-full rounded-md" />
                ) : (
                  <Input id="name" defaultValue={user?.user?.name} readOnly />
                )}
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Label htmlFor="email" className="font-semibold text-gray-600">
                Email Address
              </Label>
              <div>
                {status === "loading" ? (
                  <Skeleton className="h-10 w-full rounded-md" />
                ) : (
                  <Input
                    id="email"
                    type="email"
                    defaultValue={user?.user?.email}
                    readOnly
                  />
                )}
              </div>
            </div>
          </div>

          {/* Date Created */}
          <div className="space-y-2">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Label
                htmlFor="dateCreated"
                className="font-semibold text-gray-600"
              >
                Date Created
              </Label>
              {status === "loading" ? (
                <Skeleton className="h-10 w-full rounded-md" />
              ) : (
                <Input
                  id="dateCreated"
                  type="text"
                  defaultValue={
                    user?.user?.created_at
                      ? formatDate(user.user.created_at)
                      : ""
                  }
                  readOnly
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
