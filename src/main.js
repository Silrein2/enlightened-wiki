// src/main.js
import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

let app;

// Wait for Firebase Auth to initialize before mounting Vue
onAuthStateChanged(auth, () => {
  if (!app) {
    app = createApp(App).use(router).mount('#app');
  }
});

// import { nukeCache } from './firebase';
// nukeCache();