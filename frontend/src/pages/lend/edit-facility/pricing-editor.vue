<template>
  <div>
    <template v-for="(price, idx) in currentPrices" :key="idx">
      <div class="row">
        <div class="price-delete-btn-wrapper">
          <div>
            <el-button
              :icon="Close"
              circle
              type="primary"
              class="price-delete-btn"
              @click="currentPrices.splice(idx, 1)"
            ></el-button>
          </div>
        </div>
        <div class="price-inner">
          <el-input
            v-model="price.name"
            placeholder="Please input"
            class="input-with-select"
          >
            <template #prepend>
              <el-select v-model="price.priceType" style="width: 10rem">
                <el-option label="Rental" value="rental">
                  <span>Rental Price</span>
                </el-option>
                <el-option label="Deposit" value="deposit">
                  <span>Refundable Deposit</span>
                </el-option>
                <el-option label="Daily Fee" value="daily-fee">
                  <span>Daily Fee</span>
                </el-option>
                <el-option label="One Time Fee" value="one-time-fee">
                  <span>One Time Fee</span>
                </el-option>
              </el-select>
            </template>
          </el-input>
          <el-input
            v-model="price.dollarValue"
            type="number"
            placeholder="Dollar ammount"
            class="input-with-select"
          >
            <template #prepend> $ </template>
            <template #append>
              <el-select
                v-model="price.optional"
                style="width: 8rem"
                placeholder="Optional"
              >
                <el-option label="Optional" :value="true"> </el-option>
                <el-option label="Required" :value="false"> </el-option>
              </el-select>
            </template>
          </el-input>
          <div v-if="price.priceType === 'rental' && type === 'hourly'">
            <el-input
              v-model="price.dailyMinimum"
              type="number"
              placeholder="Dollar ammount"
              class="input-with-select"
            >
              <template #prepend> Daily Minumum </template>
              <template #append>
                <el-button
                  :icon="Close"
                  @click="price.dailyMinimum = undefined"
                ></el-button>
              </template>
            </el-input>
            <el-input
              v-model="price.dailyMaximum"
              type="number"
              placeholder="Dollar ammount"
              class="input-with-select"
            >
              <template #prepend> Daily Maximum </template>
            </el-input>
          </div>
        </div>
      </div>
    </template>
    <el-button type="primary" round @click="addPriceElement"
      >Add price element</el-button
    >
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { Close } from "@element-plus/icons-vue";
const props = defineProps({
  facility: { type: Object, required: true },
  type: { type: String, required: true },
});
const emit = defineEmits(["input"]);

const currentPrices = ref(props.facility.pricesByClientType(props.type) || []);
watch(
  () => currentPrices,
  (prices) => {
    console.log("emitting input", currentPrices);
    emit("input", prices);
  },
  { deep: true }
);

function addPriceElement() {
  currentPrices.value.push({
    clientType: props.type,
  });
}
</script>

<style scoped>
.price-delete-btn-wrapper {
  width: 1.75rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.price-delete-btn {
  position: relative;
  flex-grow: 0;
}
.price-inner {
  padding: 0.5rem 0 0.5rem 0.75rem;
  border: 3px solid;
  border-radius: 4px;
  border-image: linear-gradient(
    to right,
    var(--el-color-primary) 1rem,
    transparent 0%
  );
  border-image-slice: 1;
  flex-grow: 1;
}
.row {
  display: flex;
  flex-direction: row;
  margin-bottom: 1rem;
}
</style>
