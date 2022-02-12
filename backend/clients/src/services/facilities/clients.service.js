import Service from "feathers-mongoose";
import { clientsModel } from "./clients.model.js";
import { clientsHooks } from "./hooks/index.js";
import errs from "@feathersjs/errors";

export function registerClientsService(app) {
  const Model = clientsModel(app);
  app.use(
    "/clients",
    new Service({
      Model,
    })
  );

  const service = app.service("clients");

  service.hooks(clientsHooks);
}
