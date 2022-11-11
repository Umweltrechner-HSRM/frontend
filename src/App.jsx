import {
  ChakraProvider,
  ColorModeScript,
} from "@chakra-ui/react";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import Dashboard from "./views/Dashboard.jsx";
import Graph from "./views/Datasets.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from "react";
import theme from "./theme.js";
import { Layout } from "./layout/Layout.jsx";
import AdminPanel from "./views/AdminPanel.jsx";
import Settings from "./views/Settings.jsx";

const queryClient = new QueryClient();

const RoutesHandler = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout/>}>
          <Route element={<Dashboard />} path="/" />
          <Route element={<Graph />} path="/datasets" />
          <Route element={<AdminPanel />} path="/admin" />
          <Route element={<Settings/>} path="/settings" />
          <Route element={<h1>404</h1>} path="*" />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

const App = () => {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <RoutesHandler />
        </QueryClientProvider>
      </ChakraProvider>
    </>
  )

}
export default App;