import { documentRequirementsHooks } from "./document-requirements.hooks.js";
import {
  getRecommendedClientDocumentTypes,
  getRequiredFacilityDocumentTypes,
} from "../../utils/facility-documents.js";

export function registerDocumentRequirementsService(app) {
  app.use("/document-requirements", {
    async get(facilityId, params) {
      const { facilityData } = params;
      const facilityDocuments = getRequiredFacilityDocumentTypes(facilityData);
      const recommendedClientDocuments =
        getRecommendedClientDocumentTypes(facilityData);
      return { facilityDocuments, recommendedClientDocuments };
    },
  });

  const service = app.service("document-requirements");

  service.hooks(documentRequirementsHooks);
}
