import { Box, Flex, HStack, LinkBox, LinkOverlay, Text } from "@chakra-ui/react";
import ThemeToggleButton from "./ToggleButton.jsx";
import { NavLink } from "react-router-dom";

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
        <LinkBox cursor="pointer">
          <NavLink to={"/"}>
            <LinkOverlay>
              <Text>Umweltrechner</Text>
            </LinkOverlay>
          </NavLink>
        </LinkBox>
      </Flex>

      <Box flex={2} align="right">
        <HStack justifyContent={"flex-end"}>
          <ThemeToggleButton />
        </HStack>
      </Box>
    </Flex>
  );

};

export default Navbar;
