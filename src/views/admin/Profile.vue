<template>
  <div class="max-w-4xl mx-auto space-y-8">
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Your Profile</h2>

    <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
      <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Public Information</h3>
      <form @submit.prevent="updateProfile" class="space-y-6">
        
        <div class="flex items-center space-x-6">
          <div class="shrink-0">
            <img class="h-24 w-24 object-cover rounded-full bg-gray-200 dark:bg-gray-700" :src="profileData.avatarUrl || 'https://via.placeholder.com/150'" alt="Avatar">
          </div>
          <label class="block">
            <span class="sr-only">Choose profile photo</span>
            <input type="file" @change="handleAvatarSelect" accept="image/*" class="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900/50 dark:file:text-indigo-300">
          </label>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nickname</label>
          <input type="text" v-model="profileData.nickname" required class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white max-w-md">
        </div>

        <button type="submit" :disabled="isSavingProfile" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors">
          {{ isSavingProfile ? 'Saving...' : 'Save Profile' }}
        </button>
      </form>
    </div>

    <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
      <h3 class="text-lg font-bold text-red-600 dark:text-red-400 mb-4">Account Security</h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">Changing your email or password requires you to enter your current password.</p>
      
      <form @submit.prevent="updateSecurity" class="space-y-6 max-w-md">
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Password (Required)</label>
          <input type="password" v-model="currentPassword" required class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white">
        </div>

        <div class="border-t border-gray-200 dark:border-gray-700 my-4"></div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">New Email Address</label>
          <input type="email" v-model="newEmail" placeholder="Leave blank to keep current" class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
          <input type="password" v-model="newPassword" placeholder="Leave blank to keep current" class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white">
        </div>

        <div v-if="newPassword">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
          <input type="password" v-model="confirmPassword" required class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white">
        </div>

        <div v-if="securityMessage" class="text-sm font-medium text-green-600 dark:text-green-400">{{ securityMessage }}</div>
        <div v-if="securityError" class="text-sm font-medium text-red-600 dark:text-red-400">{{ securityError }}</div>

        <button type="submit" :disabled="isSavingSecurity" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors">
          {{ isSavingSecurity ? 'Updating...' : 'Update Security Settings' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { db, storage, auth } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword, updateEmail } from 'firebase/auth';

// Profile Refs
const profileData = ref({ nickname: '', avatarUrl: '' });
const newAvatarFile = ref(null);
const isSavingProfile = ref(false);

// Security Refs
const currentPassword = ref('');
const newEmail = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const isSavingSecurity = ref(false);
const securityMessage = ref('');
const securityError = ref('');

// Load Profile on mount
onMounted(async () => {
  const user = auth.currentUser;
  if (user) {
    const docSnap = await getDoc(doc(db, 'users', user.uid));
    if (docSnap.exists()) {
      profileData.value = docSnap.data();
    }
  }
});

const handleAvatarSelect = (e) => {
  if (e.target.files[0]) newAvatarFile.value = e.target.files[0];
};

const updateProfile = async () => {
  isSavingProfile.value = true;
  const user = auth.currentUser;
  
  try {
    let finalAvatarUrl = profileData.value.avatarUrl;
    
    // Upload new image if selected
    if (newAvatarFile.value) {
      const fileExt = newAvatarFile.value.name.split('.').pop();
      const sRef = storageRef(storage, `avatars/${user.uid}.${fileExt}`);
      await uploadBytes(sRef, newAvatarFile.value);
      finalAvatarUrl = await getDownloadURL(sRef);
    }

    // Save to Firestore users collection
    await setDoc(doc(db, 'users', user.uid), {
      nickname: profileData.value.nickname,
      avatarUrl: finalAvatarUrl
    }, { merge: true });

    profileData.value.avatarUrl = finalAvatarUrl;
    alert("Profile saved successfully!");
  } catch (error) {
    console.error("Profile error:", error);
    alert("Failed to save profile.");
  } finally {
    isSavingProfile.value = false;
  }
};

const updateSecurity = async () => {
  securityMessage.value = '';
  securityError.value = '';
  const user = auth.currentUser;

  if (newPassword.value && newPassword.value !== confirmPassword.value) {
    securityError.value = "New passwords do not match!";
    return;
  }

  isSavingSecurity.value = true;
  try {
    // 1. Re-authenticate
    const credential = EmailAuthProvider.credential(user.email, currentPassword.value);
    await reauthenticateWithCredential(user, credential);

    // 2. Update Password if provided
    if (newPassword.value) {
      await updatePassword(user, newPassword.value);
    }

    // 3. Update Email if provided
    if (newEmail.value && newEmail.value !== user.email) {
      await updateEmail(user, newEmail.value);
    }

    securityMessage.value = "Security settings updated successfully!";
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
    newEmail.value = '';
  } catch (error) {
    console.error(error);
    securityError.value = error.message || "Failed to update security settings.";
  } finally {
    isSavingSecurity.value = false;
  }
};
</script>