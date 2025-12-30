import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:8081",       
  realm: "fazmerir",
  clientId: "fazmerir-web",
});



export default keycloak;
 