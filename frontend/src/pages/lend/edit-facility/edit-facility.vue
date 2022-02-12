<template xmlns="http://www.w3.org/1999/html">
  <el-tabs type="border-card" @tab-click="tabClick" v-model="activeTab">
    <el-tab-pane label="Basic Information">
      <el-form :model="activeFacility" label-width="10rem">
        <el-form-item label="Facility name">
          <el-input v-model="activeFacility.name"></el-input>
        </el-form-item>
        <el-form-item label="Facility address">
          <el-select-v2
            v-model="address"
            @change="setAddress"
            filterable
            remote
            style="width: 100%"
            :fit-input-width="true"
            :remote-method="remoteMethod"
            clearable
            :options="options"
            :loading="loading"
          />
        </el-form-item>
        <el-form-item>
          <template #label>
            <popover-label>
              <template #trigger> <span>Summary</span> </template>
              <template #popover>
                <div>
                  It's a good idea to provide a short, 1-2 sentence description
                  of the facility. For example:
                  <em>
                    A commercial pretzel bakery with large ovens and copious
                    storage located near the I-75 exit.
                  </em>
                </div>
              </template>
            </popover-label>
          </template>
          <el-input
            v-model="activeFacility.summary"
            :rows="3"
            type="textarea"
            placeholder="Please input"
          />
        </el-form-item>
        <el-form-item>
          <template #label>
            <popover-label>
              <template #trigger> <span>Rental Types</span> </template>
              <template #popover>
                <div>
                  <p>
                    At this point, don't worry about if you have availability in
                    either monthly or hourly slots, just whether you are willing
                    to accept this type of client.
                  </p>
                  <p>
                    Monthly clients will pay by the month, and will generally
                    get access to the facility during any open hours, and get
                    some amount of designated storage and fridge space.
                    Caterers, ghost kitchens, meal delivery services, etc. will
                    often be monthly clients.
                  </p>
                  <p>
                    Hourly clients will pay by the hour or day. This is
                    generally people making products, like jams or frozen meals
                    for retail sale.
                  </p>
                </div>
              </template>
            </popover-label>
          </template>
          <el-checkbox
            label="Monthly Rental"
            v-model="activeFacility.monthly"
          ></el-checkbox>
          <el-checkbox
            label="Hourly Rental"
            v-model="activeFacility.hourly"
          ></el-checkbox>
        </el-form-item>
        <el-form-item>
          <template #label>
            <popover-label>
              <template #trigger> <span>Phone Number</span> </template>
              <template #popover>
                <div>
                  Add the phone number for the person who can answer questions
                  from potential clients.
                </div>
              </template>
            </popover-label>
          </template>
          <el-input
            v-model="activeFacility.phone"
            type="text"
            placeholder="(123) 555 3232"
          />
        </el-form-item>
        <el-form-item>
          <template #label> Website </template>
          <el-input
            v-model="activeFacility.links.website"
            type="text"
            placeholder="www.example.com"
          />
        </el-form-item>
        <el-form-item>
          <template #label> Facebook </template>
          <el-input
            v-model="activeFacility.links.facebook"
            type="text"
            placeholder="https://www.facebook.com/example.page.1234567"
          />
        </el-form-item>
        <el-form-item>
          <template #label> Twitter </template>
          <el-input
            v-model="activeFacility.links.twitter"
            type="text"
            placeholder="https://twitter.com/example"
          />
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="Features">
      <template v-if="activeFacility">
        <facility-features-form
          :facility="activeFacility"
        ></facility-features-form>
      </template>
    </el-tab-pane>
    <el-tab-pane label="Photos">
      <div>
        <p>We recommend including at least 6 photos, and no more than 10.</p>
        <p>Try to make sure you have at least one photo of:</p>
        <ul>
          <li>The front of the building</li>
          <li>Prep Areas</li>
          <li>Cooktops</li>
          <li>Ovens</li>
          <li>Fridges</li>
          <li>Storage areas</li>
        </ul>
      </div>
      <div>
        <photo-uploads
          :id="activeFacility._id"
          :existing-uploads="activeFacilityUploads"
          model="facilities"
        ></photo-uploads>
      </div>
    </el-tab-pane>
    <el-tab-pane label="Full Description">
      <md-editor
        :images="activeFacility.arrayOfImages"
        :initial-content="activeFacility.description"
        @input="setDescription"
      ></md-editor>
    </el-tab-pane>
    <el-tab-pane label="Pricing">
      <div>
        <p>
          Enter a complete set of pricing here. If you end up needing help to
          enter your pricing, send us a note at support@friendly.kitchen. You
          should be able to include a number of different entries to include:
          daily fees, daily minimums and maximums, rental fees for different
          equipment,
        </p>
      </div>
      <el-card v-if="activeFacility.monthly" class="spacer">
        <template #header>
          <span>Monthly Clients</span>
        </template>
        <pricing-editor
          :facility="activeFacility"
          @input="(records) => (activeFacility.monthlyPricing = records)"
          type="monthly"
        ></pricing-editor>
      </el-card>
      <el-card v-if="activeFacility.hourly" class="spacer">
        <template #header>
          <span>Hourly Clients</span>
        </template>
        <pricing-editor
          :facility="activeFacility"
          @input="(records) => (activeFacility.hourlyPricing = records)"
          type="hourly"
        ></pricing-editor>
      </el-card>
    </el-tab-pane>
    <el-tab-pane label="Documents">
      <template v-if="activeFacility">
        <facility-documents :facility="activeFacility"></facility-documents>
      </template>
    </el-tab-pane>
    <el-row justify="center">
      <el-col :sm="24" :md="12" :lg="6">
        <el-button
          type="primary"
          @click="submitUpdate"
          :style="{ width: '100%' }"
        >
          <div>Save</div>
        </el-button>
      </el-col>
    </el-row>
  </el-tabs>
</template>

<script setup>
import { computed, ref } from "vue";
import { debounce } from "lodash";
import {
  onBeforeRouteLeave,
  onBeforeRouteUpdate,
  useRoute,
  useRouter,
} from "vue-router";

import { ownedFacilities } from "../../../services/facilities.js";
import { facilitiesService } from "../../../services/index.js";

import PhotoUploads from "../../../components/photo-uploads.vue";
import PopoverLabel from "../../../components/popover-label.vue";
import MdEditor from "../../../components/md-editor.vue";
import PricingEditor from "./pricing-editor.vue";
import FacilityDocuments from "./facility-documents.vue";
import FacilityFeaturesForm from "./facility-features-form.vue";

const props = defineProps({
  facilityId: { type: String, required: false, default: null },
  tabNumber: { type: String, required: false, default: "0" },
});
const route = useRoute();
const router = useRouter();

const isEditing = computed(() => !!props.facilityId);
const isCreating = computed(() => !props.facilityId);

const options = ref([]);
const loading = ref(false);
const activeTab = ref(props.tabNumber);
const activeFacility = ref(null);

if (isEditing.value) {
  activeFacility.value = ownedFacilities.getById(props.facilityId);
} else {
  activeFacility.value = ownedFacilities.createStub();
}
const address = ref(activeFacility.value.address);

function setAddress(address) {
  activeFacility.value.location = address.location;
  activeFacility.value.zip = address.zip;
  activeFacility.value.state = address.state;
  activeFacility.value.address = address.address;
}
function setDescription(desc) {
  activeFacility.value.description = desc;
}

const activeFacilityUploads = Object.values(
  activeFacility.value.uploads_images || {}
).map((v) => ({ ...v, name: v.filename, url: v.publicUrl }));

async function geocodeOptions(search) {
  loading.value = true;
  let position = null;
  if (navigator.geolocation) {
    position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        () => resolve(null)
      );
    });
  }
  let url = "geocode/" + search;
  if (position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    url += `/${latitude}/${longitude}`;
  }

  const data = await facilitiesService.get(url);
  console.log(data);
  options.value = (data?.data || []).map((v) => ({
    value: v,
    label: v.address,
  }));
  loading.value = false;
}

const remoteMethod = debounce(geocodeOptions, 600, { trailing: true });
function tabClick(tab) {
  router.push({
    ...route,
    params: { ...route.params, tabNumber: tab.paneName },
  });
}

onBeforeRouteLeave(() => {
  submitUpdate();
});
onBeforeRouteUpdate(() => {
  submitUpdate();
});

async function submitUpdate() {
  await activeFacility.value.patchData().catch((error) => {
    // TODO: handle these errors
    console.error(error);
  });
}
</script>

<style scoped>
.spacer {
  margin-bottom: 1rem;
}
</style>
