<template>
  <section>
    <h3>Kitchen Equipment</h3>
    <el-collapse>
      <template v-for="feature in featuresList">
        <el-collapse-item>
          <template #title>
            <h4
              :style="{
                minWidth: '12rem',
              }"
            >
              {{ feature.displayName }}
            </h4>
            <el-checkbox
              :label="
                facility.monthly ? 'Available to Hourly Customers' : 'Available'
              "
              v-if="facility.hourly"
              v-model="facility.featureObject[feature.type].availableHourly"
            ></el-checkbox>
            <el-checkbox
              :label="
                facility.hourly ? 'Available to Monthly Customers' : 'Available'
              "
              v-if="facility.monthly"
              v-model="facility.featureObject[feature.type].availableMonthly"
            ></el-checkbox>
          </template>
          <el-form label-width="12rem">
            <el-form-item>
              <el-checkbox
                label="Available only by Appointment"
                v-model="facility.featureObject[feature.type].byAppointment"
              ></el-checkbox>
            </el-form-item>
            <el-form-item>
              <el-checkbox
                label="Available with Additional Fee"
                v-model="facility.featureObject[feature.type].additionalFee"
              ></el-checkbox>
            </el-form-item>
            <el-form-item label="Notes">
              <el-input
                type="textarea"
                label="Notes"
                v-model="facility.featureObject[feature.type].notes"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </template>
    </el-collapse>
  </section>
</template>

<script setup>
import { featuresList } from "../../../utils/features.js";

const props = defineProps({
  facility: { type: Object, required: true },
});
</script>

<style scoped></style>
