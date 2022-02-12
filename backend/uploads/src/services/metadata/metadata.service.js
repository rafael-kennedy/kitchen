import Service from "feathers-mongoose";
import { metadataModel } from "./metadata.model.js";
import { metadataHooks } from "./metadata.hooks.js";
export function registerMetadataService(app) {
  const Model = metadataModel(app);
  app.use(
    "/metadata",
    new Service({
      Model,
      multi: ["create"],
    })
  );

  const service = app.service("metadata");

  service.hooks(metadataHooks);
}
