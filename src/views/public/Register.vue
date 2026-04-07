<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
    <div class="max-w-md w-full space-y-8 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
      <h2 class="text-center text-3xl font-extrabold text-gray-900 dark:text-white">Join the Wiki</h2>
      
      <form @submit.prevent="handleRegister" class="mt-8 space-y-6">
        <div class="rounded-md shadow-sm -space-y-px">
          <input v-model="email" type="email" required placeholder="Email Address" class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 sm:text-sm">
          <input v-model="password" type="password" required placeholder="Password" class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 sm:text-sm">
          <input v-model="token" type="text" required placeholder="Invitation Token" class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 sm:text-sm">
        </div>

        <button type="submit" :disabled="isLoading" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">
          {{ isLoading ? 'Validating...' : 'Register as Creator' }}
        </button>
        <p v-if="error" class="text-red-500 text-xs text-center">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';

import { userProfile } from '../../stores/userStore';

const email = ref('');
const password = ref('');
const token = ref('');
const error = ref('');
const isLoading = ref(false);
const router = useRouter();

const handleRegister = async () => {
  error.value = '';
  isLoading.value = true;

  try {
    // 1. Validate Token FIRST
    const tokenRef = doc(db, 'invites', token.value.toUpperCase());
    const tokenSnap = await getDoc(tokenRef);

    if (!tokenSnap.exists()) {
      error.value = "Invalid or expired invitation token.";
      isLoading.value = false;
      return;
    }

    // 2. Create Auth User
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;

    // 3. Create Firestore Profile (Await this completely!)
    const newUserProfile = {
      nickname: email.value.split('@')[0],
      role: 'creator',
      avatarUrl: null
    };
    
    await setDoc(doc(db, 'users', user.uid), newUserProfile);

    // 4. IMPORTANT: Manually update the store now
    // This prevents the Router Guard from having to fetch it from the DB again
    userProfile.value = { uid: user.uid, ...newUserProfile };

    // 5. Burn the Token (with a safety net)
    try {
      await deleteDoc(tokenRef);
    } catch (tokenError) {
      // We log this but don't stop the user. 
      // The account is already made, so let them in!
      console.warn("Token was not deleted, but account is ready:", tokenError);
    }

    // 6. Now redirect
    router.push('/dashboard');
    
  } catch (e) {
    console.error("Registration error:", e);
    // If we fail at step 2, the user might exist but no doc. 
    // This is why we handle the error specifically.
    error.value = e.message;
  } finally {
    isLoading.value = false;
  }
};
</script>