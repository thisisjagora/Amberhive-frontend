import axios from "axios";

// const BASE_URL = "https://d32d-105-112-236-80.ngrok-free.app/api/v1";

const BASE_URL = "https://test.amber-hive.com/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    // "ngrok-skip-browser-warning": "1",
    // "User-Agent": "Custom-User-Agent",
  },
});

export default api;


