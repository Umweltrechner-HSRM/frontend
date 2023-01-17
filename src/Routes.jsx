import { FiHome } from 'react-icons/fi';
import { AiOutlineLineChart } from 'react-icons/ai';
import Dashboard from './views/Dashboard.jsx';
import React from 'react';
import ManageCharts from './views/ManageCharts.jsx';
import FormulaEditor from "./views/FormelEditor.jsx";
import VariablePage from "./views/Variable.jsx";

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
    path: '/manageCharts',
    element: <ManageCharts />,
    permission: 'admin'
  },
  {
    title: 'Formula Editor',
    icon: AiOutlineLineChart,
    path: '/formula',
    element: <FormulaEditor />,
    permission: 'admin'
  },
  {
    title: 'Variables',
    icon: AiOutlineLineChart,
    path: '/variable',
    element: <VariablePage />,
    permission: 'admin'
  }
];

export default ClientRoutes;
