const requiredFacilityDocuments = {
  all: [
    {
      name: "FDA Registration",
      type: "all-fda-registration",
      link: "https://www.fda.gov/food/registration-food-facilities-and-other-submissions/online-registration-food-facilities",
    },
  ],
  KY: [
    {
      name: "Commissary Kitchen License",
      link: "https://chfs.ky.gov/agencies/dph/dphps/fsb/Pages/foodmanufacturing.aspx",
      type: "ky-commissary-kitchen-license",
    },
  ],
};

const reccommendedClientDocuments = {
  all: [
    {
      name: "Friendly.Kitchen Use of Space Agreement",
      link: "/content/Space-Use-Agreement.docx",
      description:
        "For those new to lending out space, this represents our best practice selection of space use agreements",
    },
  ],
  KY: [],
};

export function getRequiredFacilityDocumentTypes(facility) {
  const { state } = facility;
  const allDocs = requiredFacilityDocuments.all;
  const stateDocs = requiredFacilityDocuments[state] || [];
  return [...allDocs, ...stateDocs].filter((v) => {
    if (!v.filterFacilities) {
      return true;
    } else {
      return v.filterFacilities(facility);
    }
  });
}

export function getRecommendedClientDocumentTypes(facility) {
  const { state } = facility;
  const allDocs = reccommendedClientDocuments.all;
  const stateDocs = reccommendedClientDocuments[state] || [];
  return [...allDocs, ...stateDocs].filter((v) => {
    if (!v.filterFacilities) {
      return true;
    } else {
      return v.filterFacilities(facility);
    }
  });
}
