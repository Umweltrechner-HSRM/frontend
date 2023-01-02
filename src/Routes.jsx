import { FiCalendar, FiHome, FiSettings } from "react-icons/fi";
import { AiOutlineLineChart } from "react-icons/ai";
import Dashboard from "./views/Dashboard.jsx";
import Settings from "./views/Settings.jsx";
import React from "react";
import ManageCharts from "./views/ManageCharts.jsx";

const ClientRoutes = [
  {
    title: "Dashboard",
    icon: FiHome,
    path: "/",
    element: <Dashboard />,
    permission: null
  },
  {
    title: "Manage Charts",
    icon: AiOutlineLineChart,
    path: "/manageCharts",
    element: <ManageCharts/>,
    permission: null
  },
  {
    title: "Settings",
    icon: FiSettings,
    path: "/settings",
    element: <Settings />,
    permission: "admin"
  },
];


export default ClientRoutes;
