<template>
  <el-upload
    class="upload-demo"
    action="https://jsonplaceholder.typicode.com/posts/"
    :http-request="httpRequest"
    :file-list="allFiles"
    :on-remove="removeFile"
  >
    <el-button type="primary">Click to upload</el-button>
    <template #tip>
      <div class="el-upload__tip">
        <slot name="tip"> Upload PDF, JPG, or DOC files </slot>
      </div>
    </template>
  </el-upload>
</template>
<script setup>
import { computed, ref } from "vue";
import { asyncErrorWrapper } from "../utils/wrapper.js";
import { uploadsService } from "../services/index.js";
const props = defineProps({
  config: { type: Object, required: true },
  currentFiles: { type: Array, default: () => [] },
});

const formAction = computed(
  () =>
    `/files?model=${props.config.model}&id=${props.config.id}&path=${props.config.path}&type=document`
);

const uploadedFiles = ref([]);
const allFiles = computed(() => {
  return [...uploadedFiles.value, ...props.currentFiles].map((v) => ({
    ...v,
    name: v.name || v.filename,
  }));
});

async function httpRequest(fileEntry) {
  const { file } = fileEntry;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("info", JSON.stringify(props.config.info));
  const uploaded = await asyncErrorWrapper(
    {
      title: "Error uploading document",
      messageFn(message) {
        return "There was an error uploading the document: " + message;
      },
    },
    uploadsService.post(formAction.value, formData)
  );
  const newFiles = uploaded.data || [];
  if (newFiles.length) {
    uploadedFiles.value.splice(uploadedFiles.value.length, 0, ...newFiles);
  }
}

async function removeFile(file) {
  await asyncErrorWrapper(
      {
        title: "Error removing image",
        messageFn(message) {
          return "There was an error removing the image: " + message;
        },
      },
      uploadsService
          .post(`/remove-file?hash=${file.hash}`, {
            _id: file._id,
          })
          .then(() => {
            console.log("deleted file");
          })
  );
}
</script>
