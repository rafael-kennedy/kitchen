import Service from "feathers-mongoose";
import { facilitiesModel } from "./facilities.model.js";
import { facilitiesHooks } from "./hooks/facilities.hooks.js";
import errs from "@feathersjs/errors";
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

  app.use("/public/facilities-summary-by-location", {
    async get(id, params) {
      return this.find(params);
    },
    async find(params) {
      if (
        !(
          params.query?.hasOwnProperty("latitude") &&
          params.query?.hasOwnProperty("longitude")
        )
      ) {
        throw new errs.BadRequest(
          "You need to include a latitude and longitude"
        );
      }
      const { latitude, longitude, distance = 50 } = params.query;

      const facilities = await app.service("facilities").Model.find(
        {
          location: {
            $nearSphere: {
              $geometry: {
                type: "Point",
                coordinates: [longitude, latitude],
              },
              $maxDistance: distance * 1609.344,
            },
          },
        },

        {
          description: 0,
          clientDocumentRequirements: 0,
          owners: 0,
          uploads_documents: 0,
          uploads_documentTemplates: 0,
        },
        { lean: true }
      );

      return facilities;
    },
  });
}
