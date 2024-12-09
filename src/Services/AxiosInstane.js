import axios from "axios";
import keycloakConfig from "../Components/Login/keycloak/key";

export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Include the CSRF token in the headers
    const csrfToken = getCookie("csrftoken"); // Get CSRF token from cookies
    config.headers["x-CSRFToken"] = csrfToken;

    // Check if token exists in keyCloakConfig before adding it to headers
    if (keycloakConfig && keycloakConfig.token) {
      config.headers["Authorization"] = `Bearer ${keycloakConfig.token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance