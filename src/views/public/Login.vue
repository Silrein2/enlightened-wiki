<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
    <div class="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
      
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Admin Login</h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Sign in to access the creation dashboard.
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
            <input 
              id="email" 
              v-model="email" 
              type="email" 
              required 
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            >
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input 
              id="password" 
              v-model="password" 
              type="password" 
              required 
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            >
          </div>
        </div>

        <div v-if="errorMessage" class="text-red-500 text-sm text-center font-medium">
          {{ errorMessage }}
        </div>

        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
        >
          {{ isLoading ? 'Signing in...' : 'Sign In' }}
        </button>

        <div class="mt-6 text-center text-sm">
            <p class="text-gray-600 dark:text-gray-400">
                Have an invitation token? 
                <router-link to="/register" class="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 underline">
                Register as a Creator
                </router-link>
            </p>
            
            <p class="mt-2 text-gray-600 dark:text-gray-400">
              Need a token? 
              <button type="button" @click="showRequestForm = !showRequestForm" class="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 underline">
                Request one here
              </button>
            </p>
        </div>
      </form>

      <div v-if="showRequestForm" class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 animate-fade-in">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">Request Invitation Token</h3>
        
        <form @submit.prevent="submitTokenRequest" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">In-Game Nickname <span class="text-red-500">*</span></label>
            <input 
              v-model="requestData.nickname" 
              type="text" 
              required 
              placeholder="e.g. Silrein"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-sm"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address <span class="text-xs text-gray-500 font-normal">(Optional)</span></label>
            <input 
              v-model="requestData.email" 
              type="email" 
              placeholder="For receiving the token"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-sm"
            >
          </div>

          <div v-if="requestStatus" :class="{'text-green-600 dark:text-green-400': requestSuccess, 'text-red-600 dark:text-red-400': !requestSuccess}" class="text-sm font-medium text-center">
            {{ requestStatus }}
          </div>

          <button 
            type="submit" 
            :disabled="isRequesting || !requestData.nickname.trim()"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-gray-800 hover:bg-gray-900 disabled:opacity-50 transition-colors dark:bg-gray-600 dark:hover:bg-gray-500"
          >
            {{ isRequesting ? 'Sending Request...' : 'Submit Request' }}
          </button>
        </form>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase'; // Added db import
import { doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore'; // Added Firestore imports

const router = useRouter();

// Login State
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

// Token Request State
const showRequestForm = ref(false);
const isRequesting = ref(false);
const requestSuccess = ref(false);
const requestStatus = ref('');
const requestData = ref({
  nickname: '',
  email: ''
});

// --- LOGIN LOGIC ---
const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = ''; 

  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push({ name: 'DashboardHome' });
  } catch (error) {
    console.error("Login Error:", error.code);
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      errorMessage.value = 'Invalid email or password.';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage.value = 'Too many failed attempts. Please try again later.';
    } else {
      errorMessage.value = 'An error occurred during login.';
    }
  } finally {
    isLoading.value = false;
  }
};

// --- TOKEN REQUEST LOGIC ---
const submitTokenRequest = async () => {
  // Extra safety check just in case
  if (!requestData.value.nickname.trim()) return;

  isRequesting.value = true;
  requestStatus.value = '';
  
  try {
    // 1. Save backup to Firebase (Excellent for admins to view a list in the dashboard later)
    await addDoc(collection(db, 'tokenRequests'), {
      nickname: requestData.value.nickname,
      email: requestData.value.email || 'None provided',
      timestamp: serverTimestamp(),
      status: 'Pending'
    });

    // 2. Fetch Webhook URL from Guild Settings
    // Default fallback if nothing is set in the DB
    let webhookUrl = 'https://discord.com/api/webhooks/YOUR_EXAMPLE_WEBHOOK_ID/YOUR_EXAMPLE_TOKEN'; 
    const settingsSnap = await getDoc(doc(db, 'settings', 'guild'));
    
    if (settingsSnap.exists() && settingsSnap.data().discordWebhook) {
      webhookUrl = settingsSnap.data().discordWebhook;
    }

    // 3. Construct and send the Discord Payload
    const discordPayload = {
      username: "Guild Portal Bot",
      avatar_url: "https://i.imgur.com/AfFp7pu.png", // Optional: Add a custom bot icon URL
      embeds: [{
        title: "🎟️ New Creator Token Request",
        description: "A user has requested an invitation token from the login page.",
        color: 5814783, // Indigo color
        fields: [
          { name: "In-Game Nickname", value: requestData.value.nickname, inline: true },
          { name: "Email", value: requestData.value.email || "*Not provided*", inline: true }
        ],
        timestamp: new Date().toISOString()
      }]
    };

    // We don't await the fetch so a Discord API failure doesn't crash the user experience
    fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordPayload)
    }).catch(err => console.error("Discord Webhook silent error:", err));

    // 4. Success UI Update
    requestSuccess.value = true;
    requestStatus.value = "Request sent successfully! We'll be in touch.";
    
    // 5. Reset form after 3 seconds
    setTimeout(() => { 
      showRequestForm.value = false; 
      requestData.value = { nickname: '', email: '' };
      requestStatus.value = '';
    }, 3000);

  } catch (error) {
    console.error("Token request failed:", error);
    requestSuccess.value = false;
    requestStatus.value = "Failed to send request. Please try again.";
  } finally {
    isRequesting.value = false;
  }
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>