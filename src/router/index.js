import { createRouter, createWebHistory } from 'vue-router';
import { db, auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import PublicLayout from '../views/PublicLayout.vue';
import AdminLayout from '../views/AdminLayout.vue';

import { userProfile, fetchUserProfile } from '../stores/userStore';

const routes = [
  // --- PUBLIC CONTENT PAGES ---
  {
    path: '/',
    component: PublicLayout,
    children: [
      { path: '', name: 'Home', component: () => import('../views/public/Home.vue') },
      { path: 'articles', name: 'Articles', component: () => import('../views/public/Articles.vue') },
      { path: 'artworks', name: 'Artworks', component: () => import('../views/public/Artworks.vue') },
      { path: 'videos', name: 'Videos', component: () => import('../views/public/Videos.vue') },

      { path: 'login', name: 'Login', component: () => import('../views/public/Login.vue') },
      { path: 'search', name: 'Search', component: () => import('../views/public/SearchResults.vue') },
      { path: '/register', name: 'Register', component: () => import('../views/public/Register.vue') },
      { path: 'feedback', name: 'Feedback', component: () => import('../components/Feedback.vue') }
    ]
  },

  // --- CREATION / EDITING PAGES (RESTRICTED) ---
  {
    path: '/dashboard',
    component: AdminLayout,
    meta: { requiresAuth: true }, // Must be logged in
    children: [
      { path: '', name: 'DashboardHome', component: () => import('../views/admin/DashboardHome.vue') },
      { path: 'create', name: 'CreateContent', component: () => import('../views/admin/CreateContent.vue') },
      { path: 'profile', name: 'Profile', component: () => import('../views/admin/Profile.vue') },
      { 
        path: 'edit/:id', 
        name: 'EditArticle', 
        component: () => import('../views/admin/EditArticle.vue') 
      },
      // Admin Only Route
      { 
        path: 'settings', 
        name: 'GuildSettings', 
        component: () => import('../views/admin/GuildSettings.vue'),
        meta: { requiresAdmin: true } 
      },
      { 
        path: 'approval', 
        name: 'ApprovalList', 
        component: () => import('../views/admin/ApprovalQueue.vue'),
        meta: { requiresAdmin: true }
      },
      { 
        path: 'usermanagement', 
        name: 'UserManagement', 
        component: () => import('../views/admin/UserManagement.vue'),
        meta: { requiresAdmin: true }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard to protect routes (Modern Vue Router Syntax)
const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = auth.onAuthStateChanged(
      (user) => {
        removeListener();
        resolve(user);
      },
      reject
    );
  });
};

router.beforeEach(async (to) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
  
  const user = await getCurrentUser();

  if (requiresAuth && !user) return '/login';

  if (user) {
    const profile = await fetchUserProfile(user.uid);
    
    if (requiresAdmin) {
      if (profile && profile.role === 'admin') {
        return true;
      } else {
        alert("Admin access required.");
        return '/dashboard';
      }
    }
  }

  return true;
});

export default router;