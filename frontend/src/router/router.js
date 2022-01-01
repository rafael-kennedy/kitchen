import { createRouter, createWebHashHistory } from "vue-router";
import { getUser } from "../state.js";
import { lendRoutes } from "./lend-routes.js";

const routes = [
  {
    path: "/",
    component: () => import("../pages/welcome.vue"),
    meta: { public: true },
    name: "welcome",
  },
  {
    path: "/borrow",
    component: () => import("../pages/borrow/borrow.vue"),
    meta: { public: true },
    name: "borrow-home",
  },
  ...lendRoutes,
];

export const router = createRouter({
  routes,
  history: createWebHashHistory(),
});

router.beforeEach((to, from, next) => {
  const user = getUser();
  if (!to.meta.public) {
    if (!user.value) {
      next("/auth/login");
    } else {
      next();
    }
  } else {
    next();
  }
});
