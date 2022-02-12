import { facilitiesService } from "./index.js";
import { ref } from "vue";
import { asyncErrorWrapper } from "../utils/wrapper.js";
import { escapeRegExp } from "../utils/regex.js";
import { featuresList } from "../utils/features.js";

export class Facility {
  constructor(facility) {
    this.updateData(facility);
  }

  updateData(data) {
    this.links = {};
    this.location = {};
    this.clientDocumentRequirements = [];
    this.features = [];
    Object.assign(this, data);
    this.featureObject = this.buildFeatureObject(this.features || []);
  }

  pricesByClientType(clientType) {
    return clientType === "hourly" ? this.hourlyPricing : this.monthlyPricing;
  }

  buildFeatureObject() {
    return Object.fromEntries(
      featuresList.map((feature) => {
        const current =
          this.features.find((v) => v.type === feature.type) || {};
        return [
          feature.type,
          {
            additionalFee: current.additionalFee || false,
            availableHourly: current.availableHourly || false,
            availableMonthly: current.availableMonthly || false,
            byAppointment: current.byAppointment || false,
            notes: current.notes || "",
          },
        ];
      })
    );
  }

  stringCheck(regex) {
    let stringFields = [
      this.name,
      this.summary,
      this.features,
      this.address,
      this.zip,
      this.state,
      this.description,
      this.links.website,
      this.links.facebook,
      this.links.twitter,
    ];

    for (const stringField of stringFields) {
      if (stringField && regex.test(stringField)) {
        return true;
      }
    }
    return false;
  }

  // images
  get arrayOfImages() {
    return Object.values(this.uploads_images || {});
  }
}

class OwnedFacility extends Facility {
  get isStub() {
    return this._id === "stub";
  }

  async patchData() {
    let updatedDataPromise;
    if (this.isStub) {
      updatedDataPromise = facilitiesService.post(
        "facilities",
        this.persistenceData
      );
    } else {
      updatedDataPromise = facilitiesService.patch(
        "facilities/" + this._id,
        this.persistenceData
      );
    }
    const callResults = await asyncErrorWrapper(
      {
        title: "Error updating facility",
        messageFn: (m) =>
          "Sorry, there was an error updating the facility data.",
      },
      updatedDataPromise
    );
    this.updateData(callResults.data);
  }

  get hasAddress() {
    return !this.isStub && this.zip && this.state;
  }

  flattenFeatureObject(featureObject) {
    return Object.entries(featureObject).map(
      ([
        type,
        {
          additionalFee,
          availableHourly,
          availableMonthly,
          byAppointment,
          notes,
        },
      ]) => ({
        type,
        additionalFee,
        availableHourly,
        availableMonthly,
        byAppointment,
        notes,
      })
    );
  }

  get persistenceData() {
    const {
      name,
      status,
      summary,
      monthly,
      hourly,
      description,
      capacity,
      featureObject,
      location,
      address,
      pricing,
      zip,
      state,
      hourlyPricing,
      monthlyPricing,
      clientDocumentRequirements,
      phone,
      links,
    } = this;
    return {
      name,
      status,
      summary,
      monthly,
      hourly,
      description,
      capacity,
      features: this.flattenFeatureObject(featureObject),
      location,
      address,
      pricing,
      zip,
      state,
      hourlyPricing,
      monthlyPricing,
      clientDocumentRequirements,
      phone,
      links,
    };
  }

  async fetchDocumentRequirements() {
    const documents = await facilitiesService.get(
      "/document-requirements/" + this._id
    );
    this.documentRequirements = documents?.data?.facilityDocuments;
    this.recommendedClientDocuments =
      documents?.data?.recommendedClientDocuments;
    const { uploads_documents = {} } = this;
    Object.values(uploads_documents).forEach((v) => {
      if (v.info && v.info.documentType) {
        const requirementType = this.documentRequirements.find(
          (x) => x.type === v.info.documentType
        );
        if (requirementType.files) {
          requirementType.files.push(v);
        } else {
          requirementType.files = [v];
        }
      }
    });
  }

  hasRecommendedClientDocument(recommendedDocumentType) {
    return (this.clientDocumentRequirements || []).find(
      (v) => v.recommendedDocumentType === recommendedDocumentType
    );
  }

  addRecommendedClientDocument(recommendedDocumentType, name) {
    if (!this.hasRecommendedClientDocument(recommendedDocumentType)) {
      this.clientDocumentRequirements.push({
        recommendedDocumentType,
        name,
      });
    }
  }

  removeRecommendedClientDocument(recommendedDocumentType, name) {
    const foundDocType = this.hasRecommendedClientDocument(
      recommendedDocumentType
    );
    if (foundDocType) {
      this.clientDocumentRequirements.splice(
        this.clientDocumentRequirements.indexOf(foundDocType),
        1
      );
    }
  }
}

class OwnedFacilities {
  constructor() {
    this.entries = [];
  }

  filterByString(string) {
    if (!string) {
      this.entries.forEach((facility) => {
        facility.hidden = false;
      });
    }
    const stringRegex = new RegExp(escapeRegExp(string), "i");
    this.entries.forEach((facility) => {
      facility.hidden = !facility.stringCheck(stringRegex);
    });
  }

  async refresh() {
    const { data: rawFacilities } = await facilitiesService.get("owned");
    rawFacilities.forEach((newFacilityData) => {
      const { _id } = newFacilityData;
      const existingFacility = this.getById(_id);
      if (existingFacility) {
        existingFacility.updateData(newFacilityData);
      } else {
        this.entries.push(new OwnedFacility(newFacilityData));
      }
    });
  }

  getById(_id) {
    return this.entries.find((v) => v._id === _id);
  }

  async fetchById(_id) {
    const raw = await facilitiesService.get("owned/" + _id);
    const facility = new OwnedFacility(raw);
    this.entries.push(facility);
    return facility;
  }

  async getOrFetchById(id) {
    const existing = this.getById(id);
    if (!existing) {
      return await this.fetchById(id);
    }
  }

  createStub() {
    const facility = new OwnedFacility({
      _id: "stub",
      status: "pending",
      address: null,
      monthly: false,
      hourly: false,
      summary: "",
      description: "",
      capacity: "",
      features: [],
      hourlyPricing: [],
      monthlyPricing: [],
    });
    this.entries.push(facility);
    return facility;
  }
}
export const ownedFacilities = new OwnedFacilities();
export const ownedFacilitiesRef = ref();
