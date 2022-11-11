import {
  Box,
  Divider,
  Flex,
} from "@chakra-ui/react";
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";

export const Layout = () => {
  return (
    <Box>
      <Navbar />
      <Divider orientation={"horizontal"} />
      <Flex
        flexDir={{ base: "column-reverse", md: "row" }} h="90vh">
        <Box>
          <Sidebar />
        </Box>
        <Box padding={4} w="100%" overflow={"auto"}>
          <Outlet />
        </Box>
      </Flex>
    </Box>
  );
};