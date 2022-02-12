import { ref } from "vue";
import { Facility } from "./facilities.js";
import { facilitiesService } from "./index.js";

class FacilitySearchEntry extends Facility {}

export class FacilitySearch {
  constructor() {
    this.longitude = null;
    this.latitude = null;
    this.data = [];
    this.loading = false;
  }

  setCoordinates({ latitude, longitude }) {
    this.latitude = latitude;
    this.longitude = longitude;
  }

  async loadData({ latitude, longitude }) {
    this.setCoordinates({ latitude, longitude });
    this.loading = true;
    const { data } = await facilitiesService.get(
      "/public/facilities-summary-by-location",
      {
        params: {
          latitude: this.latitude,
          longitude: this.longitude,
        },
      }
    );
    this.data = data;
    this.loading = false;
  }
}
export const facilitySearch = new FacilitySearch();
