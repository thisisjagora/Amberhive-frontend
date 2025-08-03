import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Pen } from "lucide-react";
import {
  FiEye,
  FiEyeOff,
  FiUpload,
  FiUploadCloud,
  FiUser,
} from "react-icons/fi";
import SuperAdminLayout from "./DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { TbApi } from "react-icons/tb";
import { FaPlus } from "react-icons/fa";
import PasswordUpdateForm from "@/components/forms/PasswordUpdateForm";
import EditProfile from "@/components/forms/EditProfile";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "@/redux/slices/authSlice";
import { Skeleton } from "@/components/ui/skeleton";

const tabLabels = {
  profile: "Profile Details",
  security: "Security & Privacy",
  "book-approval": "Book Approval Settings",
  "promotion-management": "Promotion Management Settings",
  notification: "Notification Settings",
  "api-integration": "API Integration",
};

const Setting = () => {
  const [message, setMessage] = useState("");
  const [tags, setTags] = useState([
    "Book Announcement",
    "Discount & Promotion",
    "New Release Update",
  ]);

  const removeTag = (tagToRemove) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const dispatch = useDispatch();
  const { profile, fetchProfileStatus } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  return (
    <SuperAdminLayout
      header={
        <div className="flex flex-col px-4 mt-20 md:mt-0 py-6 justify-start items-start w-full">
          <div className="flex flex-col items-start gap-2">
            <h1 className="text-xl font-bold">Settings</h1>
            <p className="text-gray-500 text-sm">
              Track, manage and make insights on your dashboard
            </p>
          </div>
        </div>
      }
    >
      <div className="px-2 md:mt-8  mt-14">
        <Tabs defaultValue="profile">
          <div className=" w-full">
            {/* Scrollable wrapper */}
            <div className="w-full overflow-auto py-2">
              <div className=" md:w-[1169px] w-[900px] border-b-3 border-gray-200">
                <TabsList className="flex items-center gap-6 bg-transparent p-0">
                  {[
                    "profile",
                    "security",
                    // "book-approval",
                    // "promotion-management",
                    // "notification",
                    // "api-integration",
                  ].map((tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className="text-base font-medium text-gray-600 data-[state=active]:shadow-none data-[state=active]:text-base data-[state=active]:font-[600] data-[state=active]:text-[#F6A920] data-[state=active]:border-b-3 data-[state=active]:border-[#F6A920] p-2 rounded-none transition-colors border-0 pb-[30px] focus:outline-none justify-start"
                    >
                      {tabLabels[tab] || tab}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </div>
          </div>

          {/* Profile Details */}
           <TabsContent value="profile" className="">
            <div className="flex flex-col ml-2 py-6 max-w-[900px]">
              <div className="flex flex-col md:flex-row md:justify-end">
                <EditProfile />
              </div>

              <div className="pt-6 space-y-8">
                {/* Image */}
                <div className="flex justify-center">
                  {fetchProfileStatus === "loading" ? (
                    <Skeleton className="w-24 h-24 rounded-full" />
                  ) : profile?.user?.image ? (
                    <img
                      src={`https://test.amber-hive.com/storage/${profile.user.image}`}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border shadow"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 border shadow">
                      No Image
                    </div>
                  )}
                </div>

                {/* Name */}
                <div className="flex justify-between items-start">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Label
                      htmlFor="name"
                      className="font-semibold text-gray-600"
                    >
                      Name
                    </Label>
                    {fetchProfileStatus === "loading" ? (
                      <Skeleton className="h-10 w-full rounded-md" />
                    ) : (
                      <Input
                        id="name"
                        value={profile?.user?.name || ""}
                        readOnly
                      />
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Label
                      htmlFor="email"
                      className="font-semibold text-gray-600"
                    >
                      Email Address
                    </Label>
                    {fetchProfileStatus === "loading" ? (
                      <Skeleton className="h-10 w-full rounded-md" />
                    ) : (
                      <Input
                        id="email"
                        type="email"
                        value={profile?.user?.email || ""}
                        readOnly
                      />
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Label className="font-semibold text-gray-600">
                      Phone Number
                    </Label>
                    {fetchProfileStatus === "loading" ? (
                      <Skeleton className="h-10 w-full rounded-md" />
                    ) : (
                      <Input value={profile?.user?.phone || ""} readOnly />
                    )}
                  </div>
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Label className="font-semibold text-gray-600">Role</Label>
                    <div className="flex items-center">
                      {fetchProfileStatus === "loading" ? (
                        <Skeleton className="h-8 w-24 rounded-full" />
                      ) : (
                        <Badge className="bg-green-100 text-green-800 font-[600] text-sm">
                          {profile?.user?.role?.name || "N/A"}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="pt-6">
            <div className="space-y-6 max-w-[900px]">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Left: Title */}
                <div className="md:w-1/3 ml-3">
                  <Label className="text-base font-[600] text-gray-700">
                    Update Password
                  </Label>
                </div>

                {/* Right: Password Fields */}
                <PasswordUpdateForm />
              </div>
            </div>
          </TabsContent>

          {/* book-approval */}
          <TabsContent value="book-approval" className="mt-6">
            <div className="py-6 max-w-[900px] space-y-8">
              {/* Auto-Approval Rules */}
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-[300px] shrink-0">
                  <Label htmlFor="auto-approval" className="text-base">
                    Auto-Approval Rules
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Enable auto-approval for trusted authors.
                  </p>
                </div>
                <Switch
                  id="auto-approval"
                  defaultChecked
                  className="mt-1 data-[state=checked]:bg-[#F8B846]"
                />
              </div>

              {/* Manual Review Requirement */}
              <div className="flex flex-col md:flex-row  gap-6">
                <div className="w-[300px] shrink-0">
                  <Label htmlFor="manual-review" className="text-base">
                    Manual Review Requirement
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Require manual review for new authors/books.
                  </p>
                </div>
                <Switch
                  id="manual-review"
                  defaultChecked
                  className="mt-1 data-[state=checked]:bg-[#F8B846]"
                />
              </div>

              {/* Default Feedback Message */}
              <div className="flex flex-col md:flex-row  gap-6">
                <div className="w-[300px] shrink-0">
                  <Label htmlFor="feedback-message" className="text-base">
                    Default Feedback Message
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Set a quick "rejection reason" template (editable per book).
                  </p>
                </div>
                <div className="flex-1">
                  <Textarea
                    id="feedback-message"
                    placeholder="Write here"
                    className="min-h-[100px] w-full"
                    maxLength={1000}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <div className="text-left text-sm  mt-1">
                    {message.length}/1000
                  </div>
                </div>
              </div>

              {/* Approval Notification Setting */}
              <div className="flex flex-col md:flex-row  gap-6">
                <div className="w-[300px] shrink-0">
                  <Label htmlFor="approval-notification" className="text-base">
                    Approval Notification Setting
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Notify authors via email on book approval or rejection.
                  </p>
                </div>
                <Switch
                  id="approval-notification"
                  className="mt-1 data-[state=checked]:bg-[#F8B846]"
                />
              </div>
            </div>
          </TabsContent>

          {/* promotion-management */}
          <TabsContent
            value="promotion-management"
            className="mt-6 max-w-[900px] "
          >
            <div className=" py-6 space-y-8">
              {/* Promotion Duration */}
              <div className="flex flex-col md:flex-row  gap-6 items-start">
                <div className="w-[320px] shrink-0">
                  <Label htmlFor="promo-duration" className="text-base">
                    Promotion Duration
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    E.g, "Default promo lasts 7 days unless specified."
                  </p>
                </div>
                <div className="flex flex-col flex-1 w-full md:max-w-xs">
                  <Input
                    id="promo-duration"
                    type="text"
                    placeholder="7 days (default)"
                  />
                </div>
              </div>

              {/* Promotion Activation Notifications */}
              <div className="flex flex-col md:flex-row  gap-6 items-start">
                <div className="w-[320px] shrink-0">
                  <Label
                    htmlFor="promo-activation-notifications"
                    className="text-base"
                  >
                    Promotion Activation Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Promotion Activation Notifications.
                  </p>
                </div>
                <div className="flex flex-col flex-1 max-w-xs">
                  <Switch
                    id="promo-activation-notifications"
                    defaultChecked
                    className="mt-1 data-[state=checked]:bg-[#F8B846]"
                  />
                </div>
              </div>

              {/* Featured Books Limit */}
              <div className="flex flex-col md:flex-row  gap-6 items-start">
                <div className="w-[320px] shrink-0">
                  <Label htmlFor="featured-books-limit" className="text-base">
                    Featured Books Limit
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    How many books can be "featured" on homepage at once (e.g, 5
                    max).
                  </p>
                </div>
                <div className="flex flex-col flex-1 w-full md:max-w-xs">
                  <Input id="featured-books-limit" type="number" />
                </div>
              </div>

              {/* Promotion Types Allowed */}
              <div className="flex flex-col md:flex-row  gap-6 items-start">
                <div className="w-[320px] shrink-0">
                  <Label htmlFor="promotion-types" className="text-base">
                    Promotion Types Allowed
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Book Announcement, Discount & Promotion, New Release Update.
                  </p>
                </div>
                <div className="flex flex-col flex-1 max-w-2xl p-2 border-2 rounded-lg ">
                  <div className="flex flex-col md:flex-row  gap-2 mt-1">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="inline-flex items-center space-x-2"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-lg hover:text-destructive focus:outline-none focus:ring-2 focus:ring-destructive rounded"
                          aria-label={`Remove ${tag}`}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Discount Percentage Cap */}
              <div className="flex flex-col md:flex-row  gap-6 items-start">
                <div className="w-[320px] shrink-0">
                  <Label htmlFor="discount-cap" className="text-base">
                    Discount Percentage Cap
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Discounts higher than a threshold (e.g., no more than 50%).
                  </p>
                </div>
                <div className="flex flex-col flex-1 w-full md:max-w-xs">
                  <Input id="discount-cap" type="number" placeholder="0%" />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* notification */}
          <TabsContent value="notification" className="mt-6">
            <div className="py-6  space-y-8">
              <div className="flex flex-col gap-4">
                {/* Approval Notification Setting */}
                <div className="flex flex-col md:flex-row gap-6 max-w-[900px]">
                  <div className="w-[300px] shrink-0">
                    <Label
                      htmlFor="approval-notification"
                      className="text-base"
                    >
                      New Submission Alerts
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      (Get dashboard alert when a new book is submitted.)
                    </p>
                  </div>
                  <Switch
                    id="approval-notification"
                    defaultChecked
                    className="mt-1 data-[state=checked]:bg-[#F8B846]"
                  />
                </div>

                <Separator />

                <div className="flex flex-col md:flex-row gap-6 max-w-[900px]">
                  <div className="w-[300px] shrink-0">
                    <Label
                      htmlFor="approval-notification"
                      className="text-base"
                    >
                      Promotion End Alerts
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      (Get alert 24hrs before a promo ends.)
                    </p>
                  </div>
                  <Switch
                    id="approval-notification"
                    defaultChecked
                    className="mt-1 data-[state=checked]:bg-[#F8B846]"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* api-integration */}
          <TabsContent value="api-integration" className="mt-6">
            <div>
              <div className="p-4 bg-white ">
                <div className="flex flex-col items-center justify-center text-center mt-20 space-y-4">
                  <div className="bg-gray-100 rounded-full p-2 inline-block">
                    <div className="bg-gray-200 rounded-full p-2">
                      <TbApi className="text-gray-600 text-2xl" />
                    </div>
                  </div>

                  <h2 className="text-lg font-semibold">
                    Integrate with Third Party API
                  </h2>
                  <p className="text-base text-gray-500 max-w-md">
                    You can integrate with licensed third party services to
                    boost productivity.
                  </p>
                  <Button>
                    <FaPlus className="mr-2" /> Add Apps
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SuperAdminLayout>
  );
};

export default Setting;
