<template>
  <el-steps :active="activeStep" finish-status="success" align-center>
    <el-step title="Tell Us About the Location"></el-step>
    <el-step title="Submit Photos"></el-step>
    <el-step title="Step 3"></el-step>
  </el-steps>
  {{ activeFacility }}
  <div v-if="activeStep === 0">
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
      <el-form-item label="Description">
        <el-input
          v-model="activeFacility.description"
          :rows="3"
          type="textarea"
          placeholder="Please input"
        />
      </el-form-item>
      <el-form-item label="Rental Types">
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
        <el-button type="primary" @click="submitUpdate">Submit</el-button>
        <el-button>Cancel</el-button>
      </el-form-item>
      <photo-uploads
        :id="activeFacility._id"
        model="facilities"
      ></photo-uploads>
    </el-form>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { debounce } from "lodash";
import { ownedFacilities } from "../../services/facilities.js";
import { facilitiesService } from "../../services/index.js";
import PhotoUploads from "../../components/photo-uploads.vue";
const props = defineProps({
  facilityId: { type: String, required: false, default: null },
});

const isEditing = computed(() => !!props.facilityId);
const isCreating = computed(() => !props.facilityId);
const activeStep = ref(0);

const options = ref([]);
const loading = ref(false);
const address = ref(null);

const activeFacility = ref(null);

if (isEditing.value) {
  activeFacility.value = ownedFacilities.getById(props.facilityId);
} else {
  activeFacility.value = ownedFacilities.createStub();
}

function setAddress(address) {
  activeFacility.value.location = address.location;
  activeFacility.value.zip = address.zip;
  activeFacility.value.state = address.state;
  activeFacility.value.address = address.address;
}

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

async function submitUpdate() {
  await activeFacility.value.patchData().catch((error) => {
    // TODO: handle these errors
    console.error(error);
  });
  activeStep.value += 1;
}
</script>

<style scoped></style>
