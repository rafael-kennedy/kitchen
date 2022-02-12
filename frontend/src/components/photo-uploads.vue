<template>
  <el-upload
    :action="formAction"
    list-type="picture-card"
    :auto-upload="true"
    ref="upload"
    :file-list="fileList"
    :http-request="httpRequest"
  >
    <template #default>
      <el-icon>
        <plus />
      </el-icon>
    </template>
    <template #file="{ file }">
      <div>
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-delete" @click="removeFile(file)">
            <el-icon>
              <delete />
            </el-icon>
          </span>
        </span>
      </div>
    </template>
  </el-upload>
</template>

<script setup>
import { uploadsService } from "../services/index.js";
import { Plus, Delete } from "@element-plus/icons-vue";
import { computed, ref } from "vue";
import { asyncErrorWrapper } from "../utils/wrapper.js";
const upload = ref();
const props = defineProps({
  id: { type: String, required: true },
  model: { type: String, required: true },
  existingUploads: { type: Array, default: () => [] },
});
const emit = defineEmits(["change"]);
const fileList = ref(props.existingUploads);

const formAction = computed(
  () => `/images?model=${props.model}&id=${props.id}&path=uploads_images`
);

async function httpRequest(fileEntry) {
  const { action, file } = fileEntry;
  const formData = new FormData();
  formData.append("file", file);
  const uploaded = await asyncErrorWrapper(
    {
      title: "Error uploading image",
      messageFn(message) {
        return "There was an error uploading the image: " + message;
      },
    },
    uploadsService.post(action, formData)
  );
  const newFiles = uploaded.data || [];
  if (newFiles.length) {
    const [{ _id, hash }] = newFiles;
    // this is an annoying hack. We need to not rerender the whole list, so can't mutate fileList,
    // and we need to add the new _id and hash values so the file can be removed before the page is
    // refreshed.
    const fileListEntry = upload.value.uploadFiles.find(
      (v) => v.raw === fileEntry.file
    );
    fileListEntry._id = _id;
    fileListEntry.hash = hash;
  }
}

async function removeFile(file) {
  const fileListEntryIndex = upload.value.uploadFiles.findIndex(
    (v) => v._id === file._id
  );
  upload.value.uploadFiles.splice(fileListEntryIndex, 1);
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

<style scoped></style>
