import { FiCalendar, FiHome, FiSettings } from "react-icons/fi";
import Dashboard from "./views/Dashboard.jsx";
import Graph from "./views/Datasets.jsx";
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
    title: "Graph",
    icon: FiCalendar,
    path: "/datasets",
    element: <Graph />,
    permission: null
  },
  {
    title: "Settings",
    icon: FiSettings,
    path: "/settings",
    element: <Settings />,
    permission: "admin"
  },
  {
    title: "Manage Charts",
    icon: FiSettings,
    path: "/createChart",
    element: <ManageCharts/>,
    permission: null
  },
];


export default ClientRoutes;
