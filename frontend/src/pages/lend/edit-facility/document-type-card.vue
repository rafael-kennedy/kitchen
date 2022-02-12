<template>
  <el-card>
    <h3>{{ documentType.name }}</h3>
    <template v-if="isUpToDate">
      <el-icon color="success"> <CircleCheck></CircleCheck> </el-icon>
    </template>
    <document-uploads
      :current-files="documentType.files"
      :config="{
        model: 'facilities',
        id: facility._id,
        path: 'uploads_documents',
        info: { documentType: documentType.type },
      }"
    />
  </el-card>
</template>
<script setup>
// TODO: make the isUpToDate checkbox work in realtime
import { CircleCheck } from "@element-plus/icons-vue";
import { computed } from "vue";

const props = defineProps({
  documentType: { type: Object, required: true },
  facility: { type: Object, required: true },
});
const isUpToDate = computed(() => {
  if (!props.documentType.files?.length) {
    return false;
  }
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  return !!(
    props.documentType.files &&
    props.documentType.files.find((doc) => {
      return new Date(doc.createdAt) > oneYearAgo;
    })
  );
});
</script>
