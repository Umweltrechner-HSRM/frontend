import { Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { Link as ChakraLink } from "@chakra-ui/layout";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom"
import { FiCalendar, FiHome, FiSettings} from "react-icons/fi";

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
        <NavItem icon={FiHome} title="Dashboard" link="/" />
        <NavItem icon={FiCalendar} title="Datasets" link="/datasets" />
        <NavItem icon={FiSettings} title="Settings" link="/settings" />
      </Flex>

    </Flex>
  );
};

export default Sidebar;
