export const getBaseURL = () => {
  return import.meta.env.VITE_BASE_URL || 'http://localhost:8230';
};

export const getKeycloakURL = () => {
  return import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8084/auth';
};
