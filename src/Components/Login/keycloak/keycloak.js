import Keycloak from "keycloak-js"

const KeycloakConfig=new Keycloak({
    url: `${process.env.REACT_APP_KEYCLOAK_URL}`,
    realm: 'guacamole',
    clientId: "lucky-client",
})

export default KeycloakConfig