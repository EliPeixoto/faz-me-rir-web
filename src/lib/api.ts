import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080",
});
api.get("/ping").then(r => console.log(r.data));



api.interceptors.request.use((config) => {

  return config;
});
