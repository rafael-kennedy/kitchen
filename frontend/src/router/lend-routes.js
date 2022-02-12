import { ownedFacilities } from "../services/facilities.js";

export const lendRoutes = [
  {
    path: "/lend",
    component: () => import("../pages/lend/manage-facilities.vue"),
    name: "lend-home",
    beforeEnter: fetchMyFacilities,
  },
  {
    path: "/lend-edit/:facilityId?/:tabNumber?",
    component: () => import("../pages/lend/edit-facility/edit-facility.vue"),
    name: "lend-edit",
    props: true,
    beforeEnter: fetchMyFacilities,
  },
];

async function fetchMyFacilities(to) {
  await ownedFacilities.refresh();

  if (ownedFacilities.entries.length === 0 && to.name !== "lend-edit") {
    return { name: "lend-edit" };
  }
}
