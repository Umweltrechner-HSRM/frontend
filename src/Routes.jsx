import { FiHome } from 'react-icons/fi';
import { AiOutlineLineChart } from 'react-icons/ai';
import { HiOutlineVariable } from 'react-icons/hi';
import Dashboard from './views/Dashboard.jsx';
import React from 'react';
import ManageCharts from './views/ManageCharts.jsx';
import FormulaEditor from "./views/FormelEditor.jsx";
import VariablePage from "./views/Variable.jsx";
import { TbMath } from "react-icons/tb";
import { SettingsIcon } from "@chakra-ui/icons";
import SettingsPage from "./views/Settings.jsx";
import VariableView from "./views/VariableView.jsx";

const ClientRoutes = [
  {
    title: 'Dashboard',
    icon: FiHome,
    path: '/',
    element: <Dashboard />,
    permission: null,
    navbar: true,
  },
  {
    title: 'Manage Charts',
    icon: AiOutlineLineChart,
    path: '/manageCharts',
    element: <ManageCharts />,
    permission: null,
    navbar: true,
  },
  {
    title: 'Formula Editor',
    icon: TbMath,
    path: '/formula',
    element: <FormulaEditor />,
    permission: null,
    navbar: true,
  },
  {
    title: 'Variables',
    icon: HiOutlineVariable,
    path: '/variable',
    element: <VariablePage />,
    permission: null,
    navbar: true,
  },
  {
    title: 'Variable',
    icon: HiOutlineVariable,
    path: '/variable/:id',
    element: <VariableView />,
    permission: null,
    navbar: false,
  },
  {
    title: "Settings",
    icon: SettingsIcon,
    path: "/settings",
    element: <SettingsPage />,
    permission: null,
    navbar: true
  }
];

export default ClientRoutes;
