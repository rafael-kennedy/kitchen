import axios from "axios";

export const facilitiesService = axios.create({ baseURL: "/facilities/" });
