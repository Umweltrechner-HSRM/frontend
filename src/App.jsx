import { Box, ChakraProvider, Flex } from "@chakra-ui/react";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import Start from "./views/Start.jsx";
import Graph from "./views/Graphs.jsx";
import { BrowserRouter, Link, Outlet, Route, Routes } from "react-router-dom";
import React from "react";
import ChartTest from "./views/ChartTest.jsx";

const queryClient = new QueryClient();

const Layout = () => {
  return (
    <Flex>
      <Box>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/graph">Graphen</Link>
            </li>
              <li>
              <Link to="/charttest">ChartTest</Link>
            </li>
          </ul>
        </nav>
      </Box>
      <Flex>
        <Outlet />
      </Flex>
    </Flex>
  );
}

const RoutesHandler = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout/>}>
          <Route element={<Start />} path="/" />
          <Route element={<Graph />} path="/graph" />
          <Route element={<ChartTest />} path="/charttest" />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

const App = () => {
  return (
    <React.StrictMode>
      <ChakraProvider>
        <QueryClientProvider client={queryClient}>
            <RoutesHandler />
        </QueryClientProvider>
      </ChakraProvider>
    </React.StrictMode>
  )

}
export default App;