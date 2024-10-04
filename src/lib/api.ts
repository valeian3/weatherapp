/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import axios from "axios";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = import.meta.env.VITE_WEATHER_BASE_URL;

if (!API_KEY) {
  throw new Error("API_KEY is not set in the environment variables");
}

if (!BASE_URL) {
  throw new Error("BASE_URL is not set in the environment variables");
}

const weatherApiInstance = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY,
  },
});

export default weatherApiInstance;
