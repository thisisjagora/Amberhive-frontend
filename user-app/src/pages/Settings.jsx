import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
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
import { Label } from "@/components/ui/label";
import { Pen } from "lucide-react";
import { FiEye, FiEyeOff, FiUpload } from "react-icons/fi";
import { Switch } from "@/components/ui/switch";
import { BsExclamationCircle } from "react-icons/bs";
import PasswordUpdateForm from "@/components/PasswordUpdateForm";

const Settings = () => {
  const [visibleFields, setVisibleFields] = useState({
    "current-password": false,
    "new-password": false,
    "confirm-password": false,
  });

  const togglePasswordVisibility = (fieldId) => {
    setVisibleFields((prev) => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }));
  };

  return (
    <div className="max-w-[80rem] mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Manage your account here</p>
      </div>
      <div>
        <div className="">
          <Tabs defaultValue="Account Security">
            <div className=" w-full">
              {/* Scrollable wrapper */}
              <div className="w-full overflow-auto py-2">
                <div className=" w-ful border-b-3 border-gray-200">
                  <TabsList className="flex items-center gap-6 w-max bg-transparent p-0">
                    {[
                      "Account Security",
                      // "Notification Settings",
                      // "Close Account",
                    ].map((tab) => (
                      <TabsTrigger
                        key={tab}
                        value={tab}
                        className="text-base font-medium text-gray-600 data-[state=active]:shadow-none data-[state=active]:text-base data-[state=active]:font-[600] data-[state=active]:text-yellow-600 data-[state=active]:border-b-3 data-[state=active]:border-yellow-500 p-2 rounded-none transition-colors border-0 pb-[30px] focus:outline-none justify-start"
                      >
                        {tab === "Account Security"
                          ? "Account Security"
                          : tab === "Notification Settings"
                          ? "Notification Settings"
                          : "Close Account"}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
              </div>
            </div>

            {/* Account Security */}
            <TabsContent value="Account Security" className="">
              <div className="space-y-6 max-w-[900px] py-12">
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

            {/* Notification Settings */}
            {/* <TabsContent value="Notification Settings" className="pt-6">
              <div className="space-y-6 max-w-[900px] py-12">
             
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-[500px] shrink-0">
                    <Label htmlFor="Announcements" className="text-base">
                      Announcements from platform Admin
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      (Get dashboard alert when an announcement is sent.)
                    </p>
                  </div>
                  <Switch
                    id="auto-approval"
                    defaultChecked
                    className="mt-1 data-[state=checked]:bg-[#F8B846]"
                  />
                </div>

              
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-[500px] shrink-0">
                    <Label
                      htmlFor="Promotion notifications"
                      className="text-base"
                    >
                      Get promotion notifications from authors
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      (Get dashboard alert when a promotion of a book is sent)
                    </p>
                  </div>
                  <Switch
                    id="manual-review"
                    defaultChecked
                    className="mt-1 data-[state=checked]:bg-[#F8B846]"
                  />
                </div>
              </div>
            </TabsContent> */}

            {/* Close Account */}
            {/* <TabsContent value="Close Account">
              <div className="space-y-6 max-w-[900px] py-12">
                <h1>
                  <span className="text-[#FF5C02]">Warning: </span>If you close
                  your account, you will be unsubscribed from all 8 of your
                  books and will lose access to your account and data associated
                  with your account forever, even if you choose to create a new
                  account using the same email address in the future.
                </h1>
                <h1>
                  Please note, if you want to reinstate your account after
                  submitting a deletion request, you will have 14 days after the
                  initial submission date to reach out to
                  amberhivesupport@amber.com to cancel this request.
                </h1>
              </div>

          
              <div className="flex py-8 max-w-[900px]">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="default" size="sm" className="px-6">
                      Deactivate Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="flex flex-col items-center justify-center text-center gap-4 font-gilroy">
                    <div className="bg-red-50 rounded-full p-2">
                      <div className="bg-red-100 rounded-full p-2">
                        <BsExclamationCircle className="text-[#D92D20] w-8 h-8" />
                      </div>
                    </div>

                    <AlertDialogHeader className="flex flex-col items-center justify-center space-y-2">
                      <AlertDialogTitle className="text-lg font-semibold">
                        Confirm Account Closure
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-600 mb-6 max-w-sm">
                        <h1 className="text-center">
                          You are about to make an irreversible action that will
                          cost you your investments.
                        </h1>
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter className="flex justify-center gap-4">
                      <AlertDialogCancel className="px-4 py-2">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2"
                        onClick={() => {
                          console.log("Account closed");
                        }}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TabsContent> */}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Settings;
