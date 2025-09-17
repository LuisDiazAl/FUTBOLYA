import axios from "axios";
import { API_BASE_URL } from "./config";

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = (email, password) => {
  return client.post("/auth/login", {
    correo: email,
    contrasena: password,
  });
};

export const register = (nombre, email, password) => {
  return client.post("/auth/registro", {
    nombre,
    correo: email,
    contrasena: password,
  });
};
