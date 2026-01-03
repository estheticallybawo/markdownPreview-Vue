<template>
  <div class="app">
    <Navbar />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar/Navbar.vue'
</script>

<style scoped>
.app {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-color);
  color: var(--text-color);
  margin: 0;
  padding: 0;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
}
</style>
