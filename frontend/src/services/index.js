import axios from "axios";

export const facilitiesService = axios.create({ baseURL: "/facilities/" });
export const uploadsService = axios.create({ baseURL: "/uploads/" });
