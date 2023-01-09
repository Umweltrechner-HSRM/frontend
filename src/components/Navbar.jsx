import { Box, Flex, HStack, Text } from '@chakra-ui/react';
import ThemeToggleButton from './ToggleButton.jsx';
import { NavLink, useLocation } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import { DashboardTabsContext } from '../App.jsx';
import { useContext, useEffect, useState } from 'react';
import DashboardTabs from './DashboardTabs.jsx';

const Navbar = () => {
  const context = useContext(DashboardTabsContext);
  const location = useLocation();

  return (
    <Flex
      paddingX={5}
      w={'100%'}
      display="flex"
      justify="space-between"
      alignItems={'center'}
      h={'8vh'}>
      <Flex align="flex-start">
        <NavLink to={'/'}>
          <Text>SensorGuard</Text>
        </NavLink>
      </Flex>
      {location.pathname === '/' && (
        <DashboardTabs
          setTabIndex={context.tabData?.setTabIndex}
          dashboards={context.tabData?.dashboards}
          setEditState={context.tabData?.setEditState}
          editState={context.tabData?.editState}
        />
      )}
      <Box flex={2} align="right">
        <HStack justifyContent={'flex-end'}>
          <ThemeToggleButton />
          <LogoutButton />
        </HStack>
      </Box>
    </Flex>
  );
};

export default Navbar;
