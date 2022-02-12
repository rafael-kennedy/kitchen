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
  {
    path: "/borrow/search-results/:latitude/:longitude/:text?",
    name: "borrow-search-results",
    meta: { public: true },
    props: true,
    component: () =>
      import("../pages/borrow/borrow-search-results/borrow-search-results.vue"),
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
