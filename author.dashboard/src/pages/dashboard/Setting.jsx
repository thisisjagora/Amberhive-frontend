import React, { useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Label } from "@/components/ui/label";
import Layout from "@/components/shared/Layout";
import SettingsHeader from "@/components/headers/SettingsHeader";
import { FiUser } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthorProfile } from "@/redux/slices/profileSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/utils/format";
import PasswordUpdateForm from "@/components/forms/PasswordUpdateForm";
import EditProfile from "@/components/forms/EditProfile";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const Setting = () => {
  const dispatch = useDispatch();
  const { profile, status } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchAuthorProfile());
  }, [dispatch]);

  const handleDelete = async () => {
    try {
      await dispatch(deleteAuthor({ id: profile.user_id })).unwrap();
      localStorage.removeItem("token"); // Optional: clear token
      toast.success("Profile deleted successfully");
      navigate("/"); // Optional: redirect to login
    } catch (error) {
      toast.error("Failed to delete profile", {
        description: error || "Something went wrong.",
      });
    }
  };

  return (
    <Layout header={<SettingsHeader />}>
      <div className="px-2">
        <Tabs defaultValue="profile">
          <div className=" w-full">
            {/* Scrollable wrapper */}
            <div className="w-full overflow-auto py-2">
              <div className=" w-ful border-b-3 border-gray-200">
                <TabsList className="flex items-center gap-6 w-max bg-transparent p-0">
                  {["profile", "security", "payment"].map((tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className="text-base font-medium text-gray-600 data-[state=active]:shadow-none data-[state=active]:text-base data-[state=active]:font-[600] data-[state=active]:text-yellow-600 data-[state=active]:border-b-3 data-[state=active]:border-yellow-500 p-2 rounded-none transition-colors border-0 pb-[30px] focus:outline-none justify-start"
                    >
                      {tab === "profile"
                        ? "Profile Details"
                        : tab === "security"
                        ? "Security & Privacy"
                        : "Payment Method"}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <TabsContent value="profile" className="">
            {status === "loading" ? (
              <div className="flex flex-col ml-2 py-6 max-w-[900px] space-y-6">
                <div className="flex justify-end">
                  <Skeleton className="h-9 w-[80px] rounded-md" />
                </div>

                {/* Profile Image */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <Label className="font-semibold text-gray-600">
                    Profile Image
                  </Label>
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>

                {/* Bio */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Label className="font-semibold text-gray-600">Bio</Label>
                  <Skeleton className="h-[100px] w-full" />
                </div>

                {/* Repeating Rows */}
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center"
                  >
                    <Label className="font-semibold text-gray-600">
                      Field Label
                    </Label>
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}

                {/* Address Section */}
                <div className="border-t pt-6 space-y-4">
                  <h3 className="font-semibold text-gray-600 text-lg">
                    Address Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.from({ length: 8 }).map((_, idx) => (
                      <div key={idx} className="space-y-2">
                        <Label className="text-gray-500">Field Label</Label>
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dates Section */}
                <div className="border-t pt-6 space-y-4">
                  <h3 className="font-semibold text-gray-600 text-lg">Dates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-500">Date Created</Label>
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-500">Date Updated</Label>
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-6">
                  <Skeleton className="h-9 w-20" />
                  <Skeleton className="h-9 w-20" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col ml-2 py-6 max-w-[900px]">
                <div className="flex justify-end">
                  <EditProfile />
                </div>

                <div className="pt-6 space-y-8">
                  {/* Profile Image */}
                  <div className="space-y-2">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Label className="font-semibold text-gray-600">
                        Profile Image
                      </Label>
                      <div className="flex items-center gap-4">
                        {profile?.profile_image ? (
                          <img
                            src={`https://test.amber-hive.com/storage/${profile?.profile_image}`}
                            alt="Profile"
                            className="w-20 h-20 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                            <FiUser className="text-gray-500 w-7 h-7" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Label className="font-semibold text-gray-600">Bio</Label>
                      <Textarea
                        value={profile?.bio || "No bio added"}
                        readOnly
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                  {/* Social Media */}
                  <div className="space-y-2">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Label className="font-semibold text-gray-600">
                        Facebook
                      </Label>
                      <Input
                        value={
                          profile?.social_media?.facebook || "Not provided"
                        }
                        readOnly
                      />
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Label className="font-semibold text-gray-600">
                        Instagram
                      </Label>
                      <Input
                        value={
                          profile?.social_media?.instagram || "Not provided"
                        }
                        readOnly
                      />
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Label className="font-semibold text-gray-600">
                        LinkedIn
                      </Label>
                      <Input
                        value={
                          profile?.social_media?.linkedin || "Not provided"
                        }
                        readOnly
                      />
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Label className="font-semibold text-gray-600">
                        X (formerly Twitter)
                      </Label>
                      <Input
                        value={profile?.social_media?.x || "Not provided"}
                        readOnly
                      />
                    </div>
                  </div>

                  {/* Royalty Percentage */}
                  <div className="space-y-2">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Label className="font-semibold text-gray-600">
                        Royalty Percentage
                      </Label>
                      <Input
                        value={`${profile?.royalty_percentage || "0"}`}
                        readOnly
                      />
                    </div>
                  </div>

                  {/* Subscription Details */}
                  <div className="space-y-2">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Label className="font-semibold text-gray-600">
                        Subscription Plan
                      </Label>
                      <Input value={profile?.subscription?.name} readOnly />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Label className="font-semibold text-gray-600">
                        Subscription Started
                      </Label>
                      <Input
                        value={formatDate(profile?.subscription_started_at)}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Label className="font-semibold text-gray-600">
                        Subscription Ends
                      </Label>
                      <Input
                        value={formatDate(profile?.subscription_ends_at)}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Label className="font-semibold text-gray-600">
                        Books Uploaded This Month
                      </Label>
                      <Input
                        value={profile?.books_uploaded_this_month || "0"}
                        readOnly
                      />
                    </div>
                  </div>

                  {/* Address Details Section */}
                  <div className="space-y-4 border-t pt-6">
                    <h3 className="font-semibold text-gray-600 text-lg">
                      Address Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* <div className="space-y-2">
                        <Label className="text-gray-500">Shipping Name</Label>
                        <Input
                          value={
                            profile?.address_details?.shippingName || "N/A"
                          }
                          readOnly
                        />
                      </div> */}

                      <div className="space-y-2">
                        <Label className="text-gray-500">Country</Label>
                        <Input
                          value={profile?.address_details?.country || "N/A"}
                          readOnly
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-500">Address Line 1</Label>
                        <Input
                          value={profile?.address_details?.address1 || "N/A"}
                          readOnly
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-500">Address Line 2</Label>
                        <Input
                          value={profile?.address_details?.address2 || "N/A"}
                          readOnly
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-500">City</Label>
                        <Input
                          value={profile?.address_details?.city || "N/A"}
                          readOnly
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-500">State</Label>
                        <Input
                          value={profile?.address_details?.state || "N/A"}
                          readOnly
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-500">Zip Code</Label>
                        <Input
                          value={profile?.address_details?.zip || "N/A"}
                          readOnly
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-500">Phone Number</Label>
                        <Input
                          value={profile?.address_details?.phone || "N/A"}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dates Section */}
                  <div className="space-y-4 border-t pt-6">
                    <h3 className="font-semibold text-gray-600 text-lg">
                      Dates
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-gray-500">Date Created</Label>
                        <Input
                          value={
                            formatDate(profile?.created_at) || "DD-MM-YYYY"
                          }
                          readOnly
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-500">Date Updated</Label>
                        <Input
                          value={
                            formatDate(profile?.updated_at) || "DD-MM-YYYY"
                          }
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Security */}

          <TabsContent value="security" className="pt-6">
            <div className="space-y-6 max-w-[900px]">
              {/* Password Update Section */}
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3 ml-3">
                  <Label className="text-base font-[600] text-gray-700">
                    Update Password
                  </Label>
                </div>
                <PasswordUpdateForm />
              </div>

              {/* Delete Profile Section */}
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3 ml-3">
                  <Label className="text-base font-[600] text-red-600">
                    Danger Zone
                  </Label>
                  <p className="text-sm text-muted-foreground mt-2">
                    Deleting your profile will also permanently delete all books
                    you’ve published.
                  </p>
                </div>

                <div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        className={`cursor-pointer`}
                        variant="destructive"
                      >
                        Delete Profile
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent className={`font-gilroy`}>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your profile and all books you've published.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel className={`cursor-pointer`}>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="cursor-pointer"
                          onClick={handleDelete}
                        >
                          Confirm
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Payment */}
          <TabsContent value="payment" className="pt-6">
            {/* 1. Edit Payment Method */}
            {/* <div>
              <div className="flex flex-col md:flex-row items-start ml-2 max-w-[900px]">
                <div className="flex items-center w-full">
                  <h3 className="text-base font-[600] text-gray-700">
                    Edit Payment Method
                  </h3>
                </div>
                <div className="flex flex-col gap-6 w-full">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="company-name"
                        className="text-sm font-[600] text-gray-700"
                      >
                        Company Name
                      </Label>
                      <Input id="company-name" />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-sm font-[600] text-gray-700"
                      >
                        Email
                      </Label>
                      <Input id="email" type="email" />
                    </div>

                    <div className="space-y-2 w-full">
                      <Label
                        htmlFor="country"
                        className="text-sm font-[600] text-gray-700"
                      >
                        Country
                      </Label>
                      <Select>
                        <SelectTrigger className="w-full" id="country">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="nigeria">Nigeria</SelectItem>
                            <SelectItem value="ghana">Ghana</SelectItem>
                            <SelectItem value="kenya">Kenya</SelectItem>
                            <SelectItem value="south-africa">
                              South Africa
                            </SelectItem>
                            <SelectItem value="usa">United States</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                           
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="address-line-1"
                        className="text-sm font-[600] text-gray-700"
                      >
                        Address Line 1
                      </Label>
                      <Input id="address-line-1" />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="address-line-2"
                        className="text-sm font-[600] text-gray-700"
                      >
                        Address Line 2
                      </Label>
                      <Input id="address-line-2" />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="city"
                        className="text-sm font-[600] text-gray-700"
                      >
                        City
                      </Label>
                      <Input id="city" />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="state"
                        className="text-sm font-[600] text-gray-700"
                      >
                        State
                      </Label>
                      <Input id="state" />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="zip-code"
                        className="text-sm font-[600] text-gray-700"
                      >
                        Zip Code
                      </Label>
                      <Input id="zip-code" />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="text-sm font-[600] text-gray-700"
                      >
                        Phone Number
                      </Label>
                      <Input id="phone" />
                    </div>
                  </div>
                </div>
              </div>
            </div> */}

            {/* 2. Payment Information */}
            {/* <div className="border-t-[1px] my-4"></div> */}
            <div className="flex flex-col md:flex-row  mt-8  items-start ml-2 max-w-[900px]">
              <div className="flex items-center w-full">
                <h3 className="text-base font-[600] text-gray-700">
                  Payment Information
                </h3>
              </div>
              <div className="flex flex-col gap-6 w-full">
                <div className="space-y-6">
                  {/* Payment Method */}
                  {/* <div className="space-y-2">
                    <Label
                      htmlFor="payment-method"
                      className="text-sm font-[600] text-gray-600"
                    >
                      Choose how you want to get paid
                    </Label>
                    <Select defaultValue="bank-transfer">
                      <SelectTrigger id="payment-method" className="w-full">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank-transfer">
                          Bank Transfer
                        </SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="crypto">Crypto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div> */}

                  {/* Account Number */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="account-number"
                      className="text-sm font-[600] text-gray-600"
                    >
                      Account Number
                    </Label>
                    <Input
                      id="account-number"
                      value={
                        profile?.bank_details?.accountNumber ||
                        "No account number added"
                      }
                      readOnly
                    />
                  </div>

                  {/* Bank */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="bank"
                      className="text-sm font-[600] text-gray-600"
                    >
                      Bank
                    </Label>
                    <Input
                      id="bank"
                      value={profile?.bank_details?.bank || "No bank added"}
                      readOnly
                    />
                  </div>

                  {/* Account Name */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="account-name"
                      className="text-sm font-[600] text-gray-600"
                    >
                      Account Name
                    </Label>
                    <Input
                      id="account-name"
                      value={
                        profile?.bank_details?.accountName ||
                        "No account name added"
                      }
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Setting;
