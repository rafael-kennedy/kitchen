<script setup>
import { getUser } from "./state.js";
const user = getUser();
</script>

<template>
  <el-header>
    <el-row :gutter="20">
      <el-col :span="6">
        <router-link to="/">Home</router-link>
      </el-col>
      <el-col :span="10"> <div></div></el-col>
      <el-col :span="8">
        <el-container :style="{ justifyContent: 'end' }">
          <el-space>
            <template v-if="user">
              <el-link href="/auth/logout">Log out {{ user.name }}</el-link>
            </template>
            <template v-else>
              <el-link href="/auth/login">Log In</el-link>
            </template>
          </el-space>
        </el-container>
      </el-col>
    </el-row>
  </el-header>
  <el-main class="main-wrapper">
    <router-view></router-view>
  </el-main>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
body {
  margin: unset;
}
</style>
<style scoped>
.main-wrapper {
  min-height: calc(100vh - var(--el-header-height));
}
</style>
