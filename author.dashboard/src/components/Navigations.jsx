import dashIcon from "@/assets/icons/dash.png";
import mypubIcon from "@/assets/icons/mypub.png";
import promIcon from "@/assets/icons/prom.png";
import commIcon from "@/assets/icons/comm.png";
import suppIcon from "@/assets/icons/supp.png";
import settIcon from "@/assets/icons/sett.png";
import { HiOutlineBookOpen } from "react-icons/hi";

export const links = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <img src={dashIcon} alt="Dashboard Icon" className="w-4 h-4" />,
    subLinks: [
      { name: "Overview", path: "/dashboard/overview" },
      { name: "Notification", path: "/dashboard/notification" },
    ],
  },
  {
    name: "My Publications",
    path: "/dashboard/publications",
    icon: <img src={mypubIcon} alt="Publications Icon" className="w-5 h-5" />,
    subLinks: [
      { name: "Upload Book", path: "/dashboard/publications/upload-book" },
      { name: "All Books", path: "/dashboard/publications/all-books" },
      { name: "Drafts", path: "/dashboard/publications/drafts" },
      { name: "Trash", path: "/dashboard/publications/trash" },
      { name: "My Sales", path: "/dashboard/publications/my-sales" },
    ],
  },
  {
    name: "Promotion",
    path: "/dashboard/promotion",
    icon: <img src={promIcon} alt="Promotion Icon" className="w-5 h-5" />,
    subLinks: [],
  },
  {
    name: "Community",

    icon: <img src={commIcon} alt="Community Icon" className="w-5 h-5" />,
    subLinks: [],
  },
  {
    name: "Support",
    path: "/dashboard/support",
    icon: <img src={suppIcon} alt="Support Icon" className="w-5 h-5" />,
    subLinks: [],
  },
  {
    name: "Knowledge Base",
    path: "/dashboard/knowledge-base",
    icon: <HiOutlineBookOpen className="w-5 h-5" />,
    subLinks: [],
  },
  {
    name: "Settings",
    path: "/dashboard/settings",
    icon: <img src={settIcon} alt="Settings Icon" className="w-5 h-5" />,
    subLinks: [],
  },
];
