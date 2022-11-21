import {
  ChakraProvider,
  ColorModeScript
} from "@chakra-ui/react";
import {
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import React from "react";
import theme from "./theme.js";
import { Layout } from "./layout/Layout.jsx";
import { useKeycloak } from "@react-keycloak/web";
import ClientRoutes from "./Routes.jsx";

const queryClient = new QueryClient();

const RoutesHandler = () => {
  const { keycloak } = useKeycloak();
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {
            ClientRoutes.map((route, index) => {
              return <Route
                key={index}
                path={route.path}
                element={(route.permission === null || keycloak.hasRealmRole(route.permission)) ? route.element :
                  <Navigate to={"/"} />}
              />;
            })
          }
          <Route element={<h1>404</h1>} path="*" />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

const App = () => {
  const { keycloak, initialized } = useKeycloak();
  if (!initialized) {
    return null;
  }

  if (!keycloak?.authenticated) {
    keycloak.login();
    return;
  }

  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <RoutesHandler />
        </QueryClientProvider>
      </ChakraProvider>
    </>
  );

};
export default App;