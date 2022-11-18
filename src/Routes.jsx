import { FiCalendar, FiHome, FiSettings } from "react-icons/fi";
import Dashboard from "./views/Dashboard.jsx";
import Datasets from "./components/AlertSystem.jsx";
import Settings from "./views/Settings.jsx";
import React from "react";

const ClientRoutes = [
  {
    title: "Dashboard",
    icon: FiHome,
    path: "/",
    element: <Dashboard />,
    permission: null
  },
  {
    title: "Datasets",
    icon: FiCalendar,
    path: "/datasets",
    element: <Datasets />,
    permission: null
  },
  {
    title: "Settings",
    icon: FiSettings,
    path: "/settings",
    element: <Settings />,
    permission: "admin"
  }
];


export default ClientRoutes;
