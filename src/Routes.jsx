import {FiActivity, FiCalendar, FiEdit, FiHome, FiSettings} from "react-icons/fi";
import Dashboard from "./views/Dashboard.jsx";
import Settings from "./views/Settings.jsx";
import ChartTest from "./views/ChartTest.jsx";
import React from "react";
import CreateChart from "./views/CreateChart.jsx";

const ClientRoutes = [
    {
        title: "Dashboard",
        icon: FiHome,
        path: "/",
        element: <Dashboard/>,
        permission: null
    },
    {
        title: "Create Chart",
        icon: FiEdit,
        path: "/createChart",
        element: <CreateChart />,
        permission: null
    },
    {
        title: "Charts",
        icon: FiActivity,
        path: "/charts",
        element: <ChartTest/>,
        permission: null
    },
    {
        title: "Settings",
        icon: FiSettings,
        path: "/settings",
        element: <Settings/>,
        permission: "admin"
    }
];


export default ClientRoutes;
