import { Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { Link as ChakraLink } from "@chakra-ui/layout";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import ClientRoutes from "../Routes.jsx";

function NavItem({ icon, title, link }) {
  const location = useLocation();
  const isActive = location.pathname === link;

  return (
    <Flex
      mt={5}
      flexDir="column"
      w="100%"
      alignItems={{ base: "center", lg: "flex-start" }}
    >
      <ChakraLink
        as={NavLink}
        to={link}
        backgroundColor={isActive && "#AEC8CA"}
        p={3}
        w={"100%"}
        borderRadius={8}
        _hover={{ textDecor: "none", backgroundColor: "#AEC8CA" }}
      >
        <Flex justifyContent={{ base: "center", lg: "flex-start" }}>
          <Icon
            as={icon} fontSize="xl" color={isActive ? "#82AAAD" : "gray.500"} />
          <Text ml={5} display={{ base: "none", lg: "block" }}>{title}</Text>
        </Flex>
      </ChakraLink>
    </Flex>
  );
}

const Sidebar = () => {
  const { keycloak } = useKeycloak();

  return (
    <Flex
      w={{ base: "100%", md: "13vw" }}
      flexDir="column"
      justifyContent="space-between"
    >
      <Flex
        flexDir={{ base: "row", md: "column" }}
        alignItems={{ base: "center", lg: "flex-start" }}
        as="nav"
      >
        {
          ClientRoutes.map((route, index) => {
              if (route.permission === null || keycloak.hasRealmRole(route.permission)) {
                return <NavItem key={index} icon={route.icon} title={route.title} link={route.path} />;
              }
            }
          )
        }

      </Flex>

    </Flex>
  );
};

export default Sidebar;
