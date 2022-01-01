import { ref } from "vue";
import { CookieStorage } from "cookie-storage";

const cookieStorage = new CookieStorage();
const userString = cookieStorage.getItem("kitchen-user");

const userRef = ref(userString ? JSON.parse(userString) : null);

export const getUser = () => userRef;
