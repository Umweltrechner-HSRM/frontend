import { IconButton, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { useKeycloak } from "@react-keycloak/web";
import { FiLogOut } from "react-icons/fi";

const LogoutButton = () => {
  const { keycloak } = useKeycloak();

  return (
    <IconButton
      aria-label="Logout"
      colorScheme={useColorModeValue("purple", "orange")}
      icon={<FiLogOut />}
      onClick={() => keycloak.logout()}
    />
  );
};

export default LogoutButton;
