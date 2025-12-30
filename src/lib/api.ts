import axios from "axios";
import keycloak from "../auth/keycloak";

export const api = axios.create({
  baseURL: "http://localhost:8080",
});
api.get("/ping").then(r => console.log(r.data));



api.interceptors.request.use((config) => {
  const token = keycloak.token;

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
