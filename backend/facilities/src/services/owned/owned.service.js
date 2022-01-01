export function registerOwnedService(app) {
  app.use("/owned", {
    async get(id) {},
    async find(params) {
      const { query = {}, userId } = params;
      return await app
        .service("facilities")
        .find({ query: { ...query, owners: userId } });
    },
  });
}
