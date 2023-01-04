export const getBaseURL = () => {
  return import.meta.env.VITE_BASE_URL || 'http://localhost:8230';
};

export const getWebSocketURL = () => {
  return getBaseURL().contains('http') ? getBaseURL().replace('http', 'ws') : getBaseURL().replace('https', 'wss');
}

export const getKeycloakURL = () => {
  return import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8084/auth';
};
