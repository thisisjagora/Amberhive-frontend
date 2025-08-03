import dashIcon from "@/assets/icons/dash.png";
import mypubIcon from "@/assets/icons/mypub.png";
import promIcon from "@/assets/icons/prom.png";
import commIcon from "@/assets/icons/comm.png";
import suppIcon from "@/assets/icons/supp.png";
import settIcon from "@/assets/icons/sett.png";
import promIcon2 from "@/assets/icons/Icon.png";
import { HiOutlineBookOpen } from "react-icons/hi";

export const links = [
  {
    name: "Dashboard",
    path: "/admin/",
    icon: <img src={dashIcon} alt="Dashboard Icon" className="w-4 h-4" />,
    subLinks: [
      { name: "Overview", path: "/admin/overview" },
      { name: "Notification", path: "/admin/notification" },
    ],
  },
  {
    name: "Content Management",
    path: "/admin/content-managment",
    icon: <img src={mypubIcon} alt="Publications Icon" className="w-5 h-5" />,
    subLinks: [
      { name: "Genre", path: "/admin/content-management/genre" },
      {
        name: "All Books",
        path: "/admin/content-management/all-book",
      },
       {
        name: "Featured Books",
        path: "/admin/content-management/featured-book",
      },
       {
        name: "Pending Approval",
        path: "/admin/content-management/pending-approvals",
      },
       {
        name: "Approved Books",
        path: "/admin/content-management/approved-book",
      },
       {
        name: "Rejected Books",
        path: "/admin/content-management/rejected-book",
      },
    ],
  },
  {
    name: "Buyer Management",
    path: "/admin/buyer-management",
    icon: <img src={promIcon2} alt="Promotion Icon" className="w-4 h-4" />,
    subLinks: [],
  },
  {
    name: "Promotion Managament",
    path: "/admin/promotion",
    icon: <img src={promIcon} alt="Promotion Icon" className="w-5 h-5" />,
    subLinks: [],
  },
  {
    name: "Community",
    // path: "/admin/community",
    icon: <img src={commIcon} alt="Community Icon" className="w-5 h-5" />,
    subLinks: [],
  },
  {
    name: "Support",
    path: "/admin/support",
    icon: <img src={suppIcon} alt="Support Icon" className="w-5 h-5" />,
    subLinks: [],
  },
    {
      name: "Knowledge Base",
      path: "/admin/knowledge-base",
      // icon: <FiBookOpen className="w-5 h-5" />,
      icon: <HiOutlineBookOpen className="w-5 h-5" />,
      subLinks: [],
    },
  {
    name: "Settings",
    path: "/admin/setting",
    icon: <img src={settIcon} alt="Settings Icon" className="w-5 h-5" />,
    subLinks: [],
  },
];
