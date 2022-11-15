import { Box, Flex, HStack, Text } from "@chakra-ui/react";
import ThemeToggleButton from "./ToggleButton.jsx";
import { NavLink } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const Navbar = () => {

  return (
    <Flex
      paddingX={5}
      w={"100%"}
      display="flex"
      justify="space-between"
      alignItems={"center"}
      h={"8vh"}
    >
      <Flex align="flex-start">
        <NavLink to={"/"}>
          <Text>Umweltrechner</Text>
        </NavLink>
      </Flex>

      <Box flex={2} align="right">
        <HStack justifyContent={"flex-end"}>
          <ThemeToggleButton />
          <LogoutButton />
        </HStack>
      </Box>
    </Flex>
  );

};

export default Navbar;
