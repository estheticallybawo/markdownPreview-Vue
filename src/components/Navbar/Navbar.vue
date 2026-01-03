<template>
  <nav class="navbar">
    <div class="left">
      <!-- Using Lucide Vue icon -->
      <BookText class="icon" />
      <h1 class="logo">Markdown Preview</h1>
    </div>
    <div class="right">
      <router-link to="/">
        <Button variant="ghost">Home</Button>
      </router-link>
      <router-link to="/api-demo">
        <Button variant="ghost">API Demo</Button>
      </router-link>
      <router-link to="/error-test">
        <Button variant="outline">Error Test</Button>
      </router-link>
      <ThemeToggle />
    </div>
  </nav>
</template>

<script setup lang="ts">
import { BookText } from 'lucide-vue-next';
import { Button } from '../ui'; 
import { ThemeToggle} from '../ThemeToggle';
</script>

<style scoped>

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--bg-color);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px var(--shadow);
}

.left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo {
  font-weight: 700;
  font-size: 1.2rem;
  color: var(--text-color);
  margin: 0;
  font-family: 'Inter', 'Segoe UI', 'Roboto', sans-serif;
  letter-spacing: -0.025em;
}

.icon {
  width: 20px;
  height: 20px;
  color: var(--accent-color);
}

.right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.right a {
  text-decoration: none;
  color: inherit;
}
</style>