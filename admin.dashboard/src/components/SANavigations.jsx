import dashIcon from "@/assets/icons/dash.png";
import commIcon from "@/assets/icons/comm.png";
import suppIcon from "@/assets/icons/supp.png";
import settIcon from "@/assets/icons/sett.png";
import promIcon2 from "@/assets/icons/Icon.png";
import reportIcon2 from "@/assets/icons/reports.png";
import { CiCreditCard1 } from "react-icons/ci";
import { FiHelpCircle } from "react-icons/fi";
import { MdOutlinePayment, MdAdminPanelSettings } from "react-icons/md";
import { HiOutlineBookOpen } from "react-icons/hi";


export const links = [
  {
    name: "Dashboard",
    path: "/super-admin/",
    icon: <img src={dashIcon} alt="Dashboard Icon" className="w-4 h-4" />,
    subLinks: [
      { name: "Overview", path: "/super-admin/overview" },
      { name: "Announcements", path: "/super-admin/announcements" },
      // { name: "Notification", path: "/super-admin/notification" },
    ],
  },

  {
    name: "User Management",
    path: "/super-admin/user-managements",
    icon: <img src={promIcon2} alt="Promotion Icon" className="w-4 h-4" />,
    subLinks: [],
  },
  {
    name: "Admin Management",
    path: "/super-admin/admin-management",
    icon: <MdAdminPanelSettings className="w-5 h-5" />, // 🔷 updated icon here
    subLinks: [],
  },
  {
    name: "Reports",
    path: "/super-admin/report",
    icon: <img src={reportIcon2} alt="Publications Icon" className="w-4 h-4" />,
    subLinks: [
      {
        name: "Book Reports",
        path: "/super-admin/reports/book-reports",
      },

      {
        name: "Authors Reports",
        path: "/super-admin/reports/author-reports",
      },
      {
        name: "Buyer Reports",
        path: "/super-admin/reports/buyer-reports",
      },
      {
        name: "Earnings Reports",
        path: "/super-admin/reports/earnings-reports",
      },
      {
        name: "User Management Reports",
        path: "/super-admin/reports/user-management-reports",
      },
    ],
  },
  {
    name: "Subscription",
    path: "/super-admin/subscription",
    icon: <CiCreditCard1 className="w-6 h-6" />,
    subLinks: [],
  },
  {
    name: "Payouts",
    path: "/super-admin/payout",
    icon: <MdOutlinePayment className="w-5 h-5" />,
    subLinks: [],
  },
  {
    name: "Community",
    // path: "/super-admin/community",
    icon: <img src={commIcon} alt="Community Icon" className="w-5 h-5" />,
    subLinks: [],
  },
  {
    name: "Support",
    path: "/super-admin/support",
    icon: <img src={suppIcon} alt="Support Icon" className="w-5 h-5" />,
    subLinks: [],
  },
  {
    name: "Knowledge Base",
    path: "/super-admin/knowledge-base",
    // icon: <FiBookOpen className="w-5 h-5" />,
    icon: <HiOutlineBookOpen className="w-5 h-5" />,
    subLinks: [],
  },
  {
    name: "Settings",
    path: "/super-admin/setting",
    icon: <img src={settIcon} alt="Settings Icon" className="w-5 h-5" />,
    subLinks: [],
  },
  {
    name: "Jagora Support",
    path: "/super-admin/jagora-support",
    icon: <FiHelpCircle className="w-5 h-5" />,
    subLinks: [],
  },
];
