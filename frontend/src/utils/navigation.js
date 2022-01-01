import { router } from "../router/router.js";

export function goToEditFacilityPage(facility) {
  router.push({
    name: "lend-edit",
    params: {
      facilityId: facility._id,
    },
  });
}
