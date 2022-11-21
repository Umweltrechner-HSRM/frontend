import Keycloak from "keycloak-js";

// Note: This needs to be transferred to a .env file
const keycloak = new Keycloak({
  url: "http://localhost:8084/auth",
  realm: "Umweltrechner-keycloak",
  clientId: "umweltrechner-frontend",
});


export default keycloak;
