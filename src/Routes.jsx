import { FiHome } from 'react-icons/fi';
import { AiOutlineLineChart } from 'react-icons/ai';
import Dashboard from './views/Dashboard.jsx';
import React from 'react';
import ManageCharts from './views/ManageCharts.jsx';
import Datasets from "./views/Datasets.jsx";
import {CgAlbum} from "react-icons/all.js";

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
    title: 'Datasets',
    icon: CgAlbum,
    path: '/datasets',
    element: <Datasets />,
    permission: 'admin'
  }
];

export default ClientRoutes;
