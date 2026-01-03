import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import './index.css'
import App from './App.vue'

// Import components
import Home from './views/Home.vue'
import ErrorTest from './views/ErrorTest.vue'
import ApiDemo from './views/ApiDemo.vue' 
import NotFound from './views/NotFound.vue' 

// Create Pinia store
const pinia = createPinia()

// Create Vue Router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home, name: 'Home'},
    { path: '/error-test', component: ErrorTest, name: 'ErrorTest' },
    { path: '/api-demo', component: ApiDemo, name:'ApiDemo'},
    { path: '/:pathMatch(.*)*', component: NotFound, name: 'NotFound' },
  ],
})

// Create Vue app
const app = createApp(App)

// Use plugins
app.use(pinia)
app.use(router)

// Mount the app
app.mount('#app')
