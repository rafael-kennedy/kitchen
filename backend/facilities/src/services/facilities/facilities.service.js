import Service from "feathers-mongoose";
import { facilitiesModel } from "./facilities.model.js";
import { facilitiesHooks } from "./facilities.hooks.js";
export function registerFacilitiesService(app) {
  const Model = facilitiesModel(app);
  app.use(
    "/facilities",
    new Service({
      Model,
    })
  );

  const service = app.service("facilities");

  service.hooks(facilitiesHooks);
}
