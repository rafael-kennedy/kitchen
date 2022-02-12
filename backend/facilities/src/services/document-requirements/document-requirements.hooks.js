import errs from "@feathersjs/errors";

async function lookupFacility(context) {
  const facility = await context.app.service("facilities").get(context.id);
  if (!facility) {
    throw new errs.BadRequest(
      "You need to pass a facility id to the document requirements endpoint."
    );
  }
  context.params.facilityData = facility;
}
export const documentRequirementsHooks = {
  before: { get: [lookupFacility] },
};
