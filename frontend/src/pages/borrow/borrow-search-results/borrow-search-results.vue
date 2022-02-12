<template>
  <div>
    <div>
      <h2>Showing results within 50 miles of {{ text.replace(/_/g, " ") }}</h2>
    </div>

    <div v-if="fs.loading">Loading...</div>
    <div v-else-if="fs.data.length">
      <template v-for="result in fs.data">
        <borrow-search-result-card
          :facility="result"
        ></borrow-search-result-card>
      </template>
    </div>
    <div v-else>
      It looks like we aren't operating in your area yet, would you like to
      leave an email, and we will reach out to you as soon as we've expanded. We
      are growing very rapidly, so it may be sooner than you think!
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { facilitySearch } from "../../../services/facility-search.js";
import BorrowSearchResultCard from "./borrow-search-result-card.vue";

const props = defineProps({
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
  text: { type: String, default: "your location" },
});

const fs = reactive(facilitySearch);
fs.loadData({
  latitude: props.latitude,
  longitude: props.longitude,
});

</script>

<style scoped></style>
