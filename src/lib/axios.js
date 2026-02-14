import axios from "axios";

const api = axios.create({
  baseURL: "https://optica-api-vad8.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
