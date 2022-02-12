<template>
  <el-popover placement="top-start" :width="props.width" trigger="hover">
    <template #reference>
      <slot name="trigger"></slot>
    </template>
    <div class="nowrap">
      <slot name="popover"> </slot>
    </div>
  </el-popover>
</template>

<script setup>
const props = defineProps({
  width: { type: Number, default: 400 },
});
</script>

<style scoped>
.nowrap :deep(*) {
  word-break: normal;
}
</style>
