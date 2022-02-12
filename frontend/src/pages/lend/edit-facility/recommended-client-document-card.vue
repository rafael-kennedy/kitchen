<template>
  <el-card>
    <h3>
      <el-checkbox v-model="toggleableDocumentType" /> &nbsp;
      {{ documentType.name }}
    </h3>
    <p>
      {{ documentType.description }}
    </p>
    <a :href="documentType.link">view</a>
  </el-card>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  facility: { type: Object, required: true },
  documentType: { type: Object, required: true },
});
const toggleableDocumentType = computed({
  get() {
    return !!props.facility.hasRecommendedClientDocument(
      props.documentType.documentType
    );
  },
  set(v) {
    if (v) {
      props.facility.addRecommendedClientDocument(
        props.documentType.documentType,
        props.documentType.name
      );
    } else {
      props.facility.removeRecommendedClientDocument(
        props.documentType.documentType
      );
    }
  },
});
</script>

<style scoped></style>
