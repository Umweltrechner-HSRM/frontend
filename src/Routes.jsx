import { FiCalendar, FiHome, FiSettings } from "react-icons/fi";
import {AiOutlineTable} from "react-icons/ai";
import Dashboard from "./views/Dashboard.jsx";
import Graph from "./views/Datasets.jsx";
import Settings from "./views/Settings.jsx";
import DataPreview from './views/DataPreview.jsx';
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
    title: "Graph",
    icon: FiCalendar,
    path: "/datasets",
    element: <Graph />,
    permission: null
  },
  {
    title: "Datasets",
    icon: AiOutlineTable,
    path: "/datapreview",
    element: <DataPreview />,
    permission: "admin"  
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
