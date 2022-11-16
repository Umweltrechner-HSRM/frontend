import { FiCalendar, FiHome, FiSettings } from "react-icons/fi";
import {AiOutlineTable} from "react-icons/ai";
import Dashboard from "./views/Dashboard.jsx";
import Graph from "./views/Graphs.jsx";
import Settings from "./views/Settings.jsx";
import Datasets from './views/Datasets.jsx';
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
    path: "/graphs",
    element: <Graph />,
    permission: null
  },
  {
    title: "Datasets",
    icon: AiOutlineTable,
    path: "/datasets",
    element: <Datasets />,
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
