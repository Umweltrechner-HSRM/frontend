import Keycloak from "keycloak-js";
import { getKeycloakURL } from "./helpers/api.jsx";

const keycloak = new Keycloak({
  url: getKeycloakURL(),
  realm: "Umweltrechner-keycloak",
  clientId: "umweltrechner-frontend"
});


export default keycloak;
