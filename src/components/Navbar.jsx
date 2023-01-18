import { Box, Flex, HStack, IconButton, Image, Link, Text, useColorModeValue } from "@chakra-ui/react";
import ThemeToggleButton from './ToggleButton.jsx';
import { NavLink, useLocation } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import { DashboardTabsContext } from '../App.jsx';
import React, { useContext } from 'react';
import DashboardTabs from './DashboardTabs.jsx';
import {  FiUser } from "react-icons/fi";
import { useKeycloak } from "@react-keycloak/web";

const Navbar = () => {
  const context = useContext(DashboardTabsContext);
  const location = useLocation();
  const { keycloak } = useKeycloak()


  return (
    <Flex
      paddingX={5}
      w={'100%'}
      display="flex"
      justify="space-between"
      alignItems={'center'}
      boxShadow={"rgba(0, 0, 0, 0.35) 0px 5px 15px"}
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
            <Link target="_blank" href={`${keycloak.authServerUrl}/realms/${keycloak.realm}/account`} >
              <Flex alignItems={"center"}>
                <IconButton
                  aria-label="Logout"
                  colorScheme={useColorModeValue('purple', 'orange')}
                  icon={<FiUser />}
                />
              </Flex>
            </Link>
            <LogoutButton />

          </Flex>
        </HStack>
      </Box>
    </Flex>
  );
};

export default Navbar;
