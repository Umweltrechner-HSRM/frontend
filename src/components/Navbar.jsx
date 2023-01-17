import { Box, Flex, HStack, Image, Text } from "@chakra-ui/react";
import ThemeToggleButton from './ToggleButton.jsx';
import { NavLink, useLocation } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import { DashboardTabsContext } from '../App.jsx';
import { useContext } from 'react';
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
      <Flex w={{ base: '100%', md: '13vw' }}>
        <NavLink to={'/'}>
          <Flex alignItems={"center"}>
            <Image src={'/android-chrome-192x192.png'} alt="logo" w={'64px'} h={'64px'} ml={"auto"} mr={"auto"}/>
            <Text fontSize={'md'} display={{
              base: 'none',
              lg: 'block',
            }} fontWeight={'bold'}>Sensor Guard</Text>
          </Flex>
        </NavLink>
      </Flex>
      <Box flex={2}>
        <HStack justifyContent={"flex-end"}>
          {location.pathname === '/' && (
            <DashboardTabs
              setTabIndex={context.tabData?.setTabIndex}
              dashboards={context.tabData?.dashboards}
              setEditState={context.tabData?.setEditState}
              editState={context.tabData?.editState}
            />
          )}
          <Flex gap={2}>
            <ThemeToggleButton />
            <LogoutButton />
          </Flex>
        </HStack>
      </Box>
    </Flex>
  );
};

export default Navbar;
