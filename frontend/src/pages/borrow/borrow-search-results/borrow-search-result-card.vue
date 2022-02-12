<template>
  <div class="borrow-search-result-card">
    {{ facility.name }}
  </div>
</template>

<script setup>
const props = defineProps({
  facility: { type: Object, required: true },
});
</script>

<style scoped></style>
