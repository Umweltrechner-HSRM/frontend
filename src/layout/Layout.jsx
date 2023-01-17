import { Box, Divider, Flex } from '@chakra-ui/react';
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';

export const Layout = () => {
  return (
    <Box>
      <Navbar />
      <Divider orientation={'horizontal'} />
      <Flex
        justifyContent={'space-between'}
        flexDir={{ base: 'column-reverse', md: 'row' }}
        h="90vh">
        <Box boxShadow={"rgba(0, 0, 0, 0.35) 0px 5px 15px"} borderRadius={"5px"} h={"99%"}>
          <Sidebar />
        </Box>
        <Box padding={4} pb={0} w="100%" overflow={'auto'}>
          <Outlet />
        </Box>
      </Flex>
    </Box>
  );
};
