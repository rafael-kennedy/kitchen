<template>
  <div class="borrow-search-box_wrapper">
    <div class="borrow-search-box">
      <input v-model="searchTerm" class="borrow-search-box_input" />
    </div>
    <div class="borrow-search-box_result-links">
      <template v-for="result in results">
        <div>
          <router-link
            :to="{
              name: 'borrow-search-results',
              params: {
                latitude: result.latitude,
                longitude: result.longitude,
                text: result.text.replace(/\s/g, '_'),
              },
            }"
          >
            {{ result.text }}
          </router-link>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { Search } from "@element-plus/icons-vue";
import { facilitiesService } from "../../services/index.js";
import debounce from "lodash/debounce.js";
const searchTerm = ref("");
const results = ref([]);

const debouncedAutocomplete = debounce(
  async function searchAutocomplete() {
    let position;
    if (navigator.geolocation) {
      position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve(position),
          () => resolve(null)
        );
      });
    }
    let url = "/borrow-search-autocomplete/" + searchTerm.value;
    let params = {};
    if (position) {
      params.latitude = position.coords.latitude;
      params.longitude = position.coords.longitude;
    }

    const { data } = await facilitiesService.get(url, { params });
    results.value = data || [];
  },
  300,
  { leading: false, trailing: true }
);

watch(searchTerm, () => {
  debouncedAutocomplete();
});
</script>

<style scoped></style>
