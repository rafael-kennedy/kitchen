<template>
  <el-row justify="center">
    <h1>Welcome to Friendly.Kitchen!</h1>
  </el-row>
  <div class="bg">
    <el-card class="top-buffer">
      <el-row :gutter="20" justify="center">
        <el-link :underline="false">
          <router-link :to="{ name: 'borrow-home' }">
            <h1>Do you want to find a commercial kitchen to use?</h1>
          </router-link>
        </el-link>
      </el-row>
      <el-row :gutter="20" justify="center">
        <el-link :underline="false">
          <router-link :to="{ name: 'lend-home' }">
            <h1>Or do you want to lend out unused space?</h1>
          </router-link>
        </el-link>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
</script>

<style scoped>
.top-buffer {
  margin-top: 2rem;
}
.bg {
  background-image: url("/public/splash-1.jpg");
  background-position: center;
  background-size: cover;
  min-height: 80vh;
  margin-left: calc(var(--el-main-padding) * -1);
  padding-left: var(--el-main-padding);
  margin-right: calc(var(--el-main-padding) * -1);
  padding-right: var(--el-main-padding);
  padding-top: 2rem;
}
</style>
