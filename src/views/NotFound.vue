<template>
  <div class="container">
    <h1 class="title">404</h1>
    <h2 class="subtitle">Page Not Found</h2>
    <p class="description">
      Sorry, the page you are looking for doesn't exist.
    </p>
    <router-link to="/" class="home-link">
      Go back to Home
    </router-link>
  </div>
</template>


<style scoped>

.container {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  padding: 4rem 2rem;
}

.title {
  font-size: 6rem;
  font-weight: bold;
  color: #dc2626;
  margin: 0;
}

.subtitle {
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
}

.description {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.home-link {
  display: inline-block;
  background-color: #007acc;
  color: white;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.home-link:hover {
  background-color: #005a9e;
}
</style>