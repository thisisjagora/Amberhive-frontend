import addAdminVideo from "@/assets/super-admin/How-to-add-an-Admin-User.mp4";
import downloadReportVideo from "@/assets/super-admin/How-to-Download-a-Report.mp4";

export const knowledgeVideos = [
  {
    id: "add-admin-user",
    title: "How to Add an Admin User",
    script: `Hello!

I’ll guide you on how to add an admin. To add an admin, log in and navigate to the Admin Management section.

A list of previously added admins will be displayed. Click on the Add Admin button.

A form is displayed. Enter the new admin’s full name, email address, and password.

To assign a role, click on the expand icon and select a role from the options displayed. Optionally, you can upload an image by clicking the upload icon and selecting an image from your device.

After all fields have been filled, click on the submit button. A success message is displayed and the newly added admin will be displayed at the top of the list.`,
    src: addAdminVideo,
  },
  {
    id: "download-report",
    title: "How to Download a Report",
    script: `Hello!

I’ll guide you on how to download a report. To download a report, sign in and navigate to the Reports section.

Click on the expand icon and select the report you want to download. Select Author report. A list of all user details is displayed.

Click on the Download Report button. The report will be successfully downloaded to your device and open on a new tab.`,
    src: downloadReportVideo,
  },
];
