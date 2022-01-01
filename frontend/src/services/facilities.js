import { facilitiesService } from "./index.js";
import { ref } from "vue";
import { asyncErrorWrapper } from "../utils/wrapper.js";
import { escapeRegExp } from "../utils/regex.js";

class Facility {
  constructor(facility) {
    this.updateData(facility);
  }

  updateData(data) {
    Object.assign(this, data);
  }

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

  get persistenceData() {
    const {
      name,
      status,
      monthly,
      hourly,
      description,
      capacity,
      features,
      location,
      address,
      zip,
      state,
    } = this;
    return {
      name,
      status,
      monthly,
      hourly,
      description,
      capacity,
      features,
      location,
      address,
      zip,
      state,
    };
  }

  stringCheck(regex) {
    let stringFields = [
      this.name,
      this.description,
      this.features,
      this.address,
      this.zip,
      this.state,
    ];

    for (const stringField of stringFields) {
      if (regex.test(stringField)) {
        return true;
      }
    }
    return false;
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
        this.entries.push(new Facility(newFacilityData));
      }
    });
  }

  getById(_id) {
    return this.entries.find((v) => v._id === _id);
  }

  async fetchById(_id) {
    const raw = await facilitiesService.get("owned/" + _id);
    const facility = new Facility(raw);
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
    const facility = new Facility({
      _id: "stub",
      status: "pending",
      address: null,
      monthly: false,
      hourly: false,
      description: "",
      capacity: "",
      features: [],
    });
    this.entries.push(facility);
    return facility;
  }
}
export const ownedFacilities = new OwnedFacilities();
export const ownedFacilitiesRef = ref();
