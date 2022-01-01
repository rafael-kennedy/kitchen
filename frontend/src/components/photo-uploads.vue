<template>
  <el-upload
    :action="formAction"
    list-type="picture-card"
    :auto-upload="true"
    ref="upload"
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
          <span class="el-upload-list__item-delete" @click="handleRemove(file)">
            <el-icon>
              <delete />
            </el-icon>
          </span>
        </span>
      </div>
    </template>
  </el-upload>
  <!--  <el-dialog v-model="dialogVisible">-->
  <!--    <img width="100%" :src="dialogImageUrl" alt="" />-->
  <!--  </el-dialog>-->
</template>

<script setup>
import { Plus, ZoomIn, Download, Delete } from "@element-plus/icons-vue";
import { computed, ref } from "vue";
const upload = ref();
const props = defineProps({
  id: { type: String, required: true },
  model: { type: String, required: true },
});
const formAction = computed(
  () => `/uploads/files?model=${props.model}&id=${props.id}&path=images`
);
function handleRemove(file) {
  console.log(file);
}
const submitUpload = () => {
  uploadRef.value?.submit();
};
</script>

<style scoped></style>
