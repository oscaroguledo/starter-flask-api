import { FiHome } from "react-icons/fi";
import { BsRecordBtn } from "react-icons/bs";
import { FiBarChart } from "react-icons/fi";

export const userNavLinks = [
  {
    icon: FiHome,
    path: "/dowellproctoring",
    name: "home",
  },
  {
    icon: BsRecordBtn,
    path: "/dowellproctoring/events",
    name: "events",
  },
  {
    icon: FiBarChart,
    path: "/",
    name: "reports",
  },
];
