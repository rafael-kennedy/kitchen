<template>
  <div>
    <el-input
      v-model="filterString"
      placeholder="Find "
      :prefix-icon="Search"
    />
    <template v-for="facility in visibleFacilities" :key="facility._id">
      <el-card @click="goToEditFacilityPage(facility)">
        <template v-if="facility.arrayOfImages?.length">
          <img
            :src="
              facility.arrayOfImages[facility.arrayOfImages.length - 1].medUrl
            "
            class="image"
          />
        </template>
        <template v-else>
          <el-empty></el-empty>
        </template>
        <div class="centered">
          <h3>{{ facility.name }}</h3>
        </div>
        <el-row>
          <el-col :span="12">
            {{ facility.summary }}
          </el-col>

          <el-col :span="12">
            {{ facility.status.toUpperCase() }}
          </el-col>
        </el-row>
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
const visibleFacilities = ref(ownedFacilities.entries);
watch(filterString, () => {
  ownedFacilities.filterByString(filterString.value);
  visibleFacilities.value = ownedFacilities.entries.filter((v) => !v.hidden);
});
</script>

<style scoped></style>
