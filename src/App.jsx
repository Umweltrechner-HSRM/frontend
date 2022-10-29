import { Box, ChakraProvider, Container, List, ListIcon, ListItem, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import Start from "./views/Start.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Start/>
  }
])

const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <ChakraProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ChakraProvider>
    </React.StrictMode>
  )

}
export default App;