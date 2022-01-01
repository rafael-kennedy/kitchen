<template>
  <div>
    <el-input
      v-model="filterString"
      placeholder="Find "
      :prefix-icon="Search"
    />
    <template v-for="facility in visibleFacilities" :key="facility._id">
      <el-card
        :body-style="{ padding: '0px' }"
        @click="goToEditFacilityPage(facility)"
      >
        <img src="https://placeimg.com/640/480/arch" class="image" />
        <div style="padding: 14px">
          <span>{{ facility.name }}</span>
          <div class="bottom">
            <time class="time">{{ currentDate }}</time>
            <el-button type="text" class="button">Operating</el-button>
          </div>
        </div>
      </el-card>
    </template>
  </div>
</template>

<script setup>
import { watch, computed } from "vue";
import { Search } from "@element-plus/icons-vue";
import { goToEditFacilityPage } from "../../utils/navigation.js";
import {
  ownedFacilities,
  ownedFacilitiesRef,
} from "../../services/facilities.js";
import { ref } from "vue";

const filterString = ref("");
watch(filterString, () => {
  ownedFacilities.filterByString(filterString.value);
});
const visibleFacilities = computed(() => {
  return ownedFacilities.entries.filter((v) => !v.hidden);
});
</script>

<style scoped></style>
