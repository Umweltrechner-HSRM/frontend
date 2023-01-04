import { FiHome } from 'react-icons/fi';
import { AiOutlineLineChart } from 'react-icons/ai';
import Dashboard from './views/Dashboard.jsx';
import React from 'react';
import ManageCharts from './views/ManageCharts.jsx';

const ClientRoutes = [
  {
    title: 'Dashboard',
    icon: FiHome,
    path: '/',
    element: <Dashboard />,
    permission: null
  },
  {
    title: 'Manage Charts',
    icon: AiOutlineLineChart,
    path: "/manageCharts",
    element: <ManageCharts/>,
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
