<template>
  <div class="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
    <div class="px-6 py-8">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Guild Settings</h2>

      <div class="space-y-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Manage Article Tags</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">Add or remove tags that Creators can assign to articles.</p>
        
        <form @submit.prevent="addTag" class="flex gap-2">
          <input 
            v-model="newTag" 
            type="text" 
            placeholder="e.g., Guide, Lore, Build" 
            class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          >
          <button 
            type="submit" 
            :disabled="!newTag.trim() || isSaving"
            class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            Add Tag
          </button>
        </form>

        <div class="mt-4 flex flex-wrap gap-2">
          <span 
            v-for="tag in currentTags" 
            :key="tag" 
            class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
          >
            {{ tag }}
            <button @click="removeTag(tag)" class="ml-2 text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-200 focus:outline-none">
              &times;
            </button>
          </span>
          <span v-if="currentTags.length === 0" class="text-sm text-gray-500 italic">No tags created yet.</span>
        </div>
      </div>

      <div class="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700 space-y-6">
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Discord Webhook Integrations</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Set up Discord routing for automated notifications.
          </p>
        </div>
        
        <form @submit.prevent="saveWebhooks" class="space-y-5">
          <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Creator Token Requests</label>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">Alerts Admins when someone requests a creator account.</p>
            <input v-model="tokenWebhookUrl" type="url" placeholder="https://discord.com/api/webhooks/..." class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white text-sm">
          </div>

          <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Public User Feedback</label>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">Routes bug reports and suggestions straight to the developer.</p>
            <input v-model="feedbackWebhookUrl" type="url" placeholder="https://discord.com/api/webhooks/..." class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white text-sm">
          </div>

          <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">New Content Announcements</label>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">Alerts the server when an Article, Artwork, or Video is officially approved and published.</p>
            <input v-model="contentWebhookUrl" type="url" placeholder="https://discord.com/api/webhooks/..." class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white text-sm">
          </div>

          <div class="flex items-center gap-4 pt-2">
            <button type="submit" :disabled="isSavingWebhooks" class="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors font-bold text-sm shadow-sm">
              {{ isSavingWebhooks ? 'Saving...' : 'Save All Webhooks' }}
            </button>
            <span v-if="webhooksSaveStatus" class="text-sm font-bold text-green-600 dark:text-green-400 transition-opacity">
              {{ webhooksSaveStatus }}
            </span>
          </div>
        </form>
        <div class="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700 space-y-6">
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Weekly Schedule</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Add multiple events to the draft below, then click "Save Entire Schedule" to update the public calendar.
            </p>
          </div>

          <div class="bg-gray-50 dark:bg-gray-900 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
            
            <div class="flex flex-wrap items-end gap-4 mb-6">
              <div class="flex-1 min-w-[200px]">
                <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Event Title</label>
                <input v-model="newScheduleTitle" type="text" placeholder="e.g. Guild Raid" class="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm">
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Day</label>
                <select v-model="newScheduleDay" class="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm">
                  <option v-for="day in daysOfWeek" :key="day.value" :value="day.value">{{ day.label }}</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Time (Local)</label>
                <input v-model="newScheduleTime" type="time" class="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm">
              </div>
              <button type="button" @click="addToScheduleList" :disabled="!newScheduleTitle" class="px-4 py-2 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 rounded-md font-bold text-sm hover:bg-indigo-200 dark:hover:bg-indigo-800 disabled:opacity-50 h-[38px] transition-colors">
                + Add to Draft
              </button>
            </div>

            <div class="space-y-2 mb-6">
              <div v-for="event in scheduleEvents" :key="event.id" class="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
                <div>
                  <span class="font-bold text-gray-900 dark:text-white text-sm">{{ event.title }}</span>
                  <span class="text-xs text-gray-500 ml-2">(UTC Day {{ event.utcDay }}, {{ String(event.utcHours).padStart(2, '0') }}:{{ String(event.utcMinutes).padStart(2, '0') }})</span>
                </div>
                <button type="button" @click="removeFromScheduleList(event.id)" class="text-red-500 hover:text-red-700 text-sm font-bold">Remove</button>
              </div>
              <p v-if="scheduleEvents.length === 0" class="text-sm text-gray-500 italic">No events currently in schedule.</p>
            </div>

            <div class="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button type="button" @click="saveScheduleToDatabase" :disabled="isSavingSchedule" class="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors font-bold text-sm shadow-sm">
                {{ isSavingSchedule ? 'Saving to Database...' : 'Save Entire Schedule' }}
              </button>
              <span v-if="scheduleSaveStatus" class="text-sm font-bold text-green-600 dark:text-green-400 transition-opacity">
                {{ scheduleSaveStatus }}
              </span>
            </div>
          </div>
        </div>

        <!-- <div class="mt-12 pt-8 border-t border-red-200 dark:border-red-900/50 space-y-6">
        <div>
          <h3 class="text-lg font-extrabold text-red-600 dark:text-red-500 flex items-center gap-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            Danger Zone
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Destructive actions that cannot be reversed. Proceed with extreme caution.
          </p>
        </div>

        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-5">
          <h4 class="text-base font-bold text-red-800 dark:text-red-400 mb-2">Factory Reset (Nuke Database)</h4>
          <p class="text-sm text-red-700 dark:text-red-300 mb-4">
            This will permanently delete ALL Articles, Artworks, Videos, and Activities. It will NOT delete Users or Settings. <strong>This action cannot be undone.</strong>
          </p>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-bold text-red-800 dark:text-red-400 mb-1">
                Type <span class="font-mono bg-red-200 dark:bg-red-900/50 px-1 py-0.5 rounded text-red-900 dark:text-red-200 select-all">NUKE</span> to confirm:
              </label>
              <input 
                v-model="nukeConfirmText" 
                type="text" 
                placeholder="Type NUKE here..." 
                class="w-full max-w-xs px-3 py-2 border border-red-300 dark:border-red-700 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 dark:bg-gray-800 dark:text-white sm:text-sm transition-colors"
              >
            </div>

            <div class="flex items-center gap-4">
              <button 
                @click.prevent="executeNuke"
                :disabled="nukeConfirmText !== 'NUKE' || isNuking"
                :class="[
                  'px-6 py-2 rounded-md font-bold text-sm shadow-sm transition-all',
                  nukeConfirmText === 'NUKE' && !isNuking
                    ? 'bg-red-600 text-white hover:bg-red-700 cursor-pointer animate-pulse' 
                    : 'bg-red-200 text-red-400 dark:bg-red-900/50 dark:text-red-800 cursor-not-allowed'
                ]"
              >
                {{ isNuking ? 'Nuking Database...' : 'INITIATE NUKE' }}
              </button>
              
              <span v-if="nukeStatus" :class="nukeSuccess ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'" class="text-sm font-bold">
                {{ nukeStatus }}
              </span>
            </div>
          </div>
        </div>
      </div> -->

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { db, storage, auth } from '../../firebase';
import { 
  doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, 
  collection, addDoc, serverTimestamp, writeBatch, getDocs, deleteDoc
} from 'firebase/firestore';

import { 
  ref as storageRef, listAll, deleteObject 
} from 'firebase/storage';

const newTag = ref('');
const currentTags = ref([]);
const isSaving = ref(false);
const userProfile = ref(null);

const tagsDocRef = doc(db, 'config', 'tags');

const tokenWebhookUrl = ref('');     
const feedbackWebhookUrl = ref('');  
const contentWebhookUrl = ref('');

const isSavingWebhooks = ref(false);
const webhooksSaveStatus = ref('');
const guildSettingsRef = doc(db, 'settings', 'guild');

const scheduleEvents = ref([]);
const newScheduleDay = ref(1); // Default to Monday (1)
const newScheduleTime = ref('19:00');
const newScheduleTitle = ref('');
const isSavingSchedule = ref(false);

const daysOfWeek = [
  { value: 0, label: 'Sunday' }, { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' }, { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' }, { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' }
];

onMounted(async () => {
  // 1. Fetch current tags
  const docSnap = await getDoc(tagsDocRef);
  if (docSnap.exists()) {
    currentTags.value = docSnap.data().list || [];
  }

  const settingsSnap = await getDoc(guildSettingsRef);
  if (settingsSnap.exists()) {
    const data = settingsSnap.data();
    if (data.discordWebhook) tokenWebhookUrl.value = data.discordWebhook;
    if (data.feedbackWebhook) feedbackWebhookUrl.value = data.feedbackWebhook;
    if (data.contentWebhook) contentWebhookUrl.value = data.contentWebhook;
    if (data.schedule) scheduleEvents.value = data.schedule;
  }

  const user = auth.currentUser;
  if (user) {
    const profileSnap = await getDoc(doc(db, 'users', user.uid));
    if (profileSnap.exists()) userProfile.value = profileSnap.data();
  }
});

const addTag = async () => {
  const tagToAdd = newTag.value.trim();
  if (!tagToAdd || currentTags.value.includes(tagToAdd)) return;
  
  isSaving.value = true;
  try {
    // Update the tag list
    await setDoc(tagsDocRef, {
      list: arrayUnion(tagToAdd)
    }, { merge: true });
    
    // LOG ACTIVITY
    await addDoc(collection(db, 'activities'), {
      userName: userProfile.value?.nickname || 'Admin',
      actionType: 'added a new tag',
      contentType: 'tag',
      contentTitle: tagToAdd,
      timestamp: serverTimestamp()
    });

    currentTags.value.push(tagToAdd);
    newTag.value = '';
  } catch (error) {
    console.error("Error adding tag:", error);
  } finally {
    isSaving.value = false;
  }
};

const removeTag = async (tagToRemove) => {
  if (!confirm(`Are you sure you want to remove the tag "${tagToRemove}"?`)) return;

  try {
    // Update the tag list
    await updateDoc(tagsDocRef, {
      list: arrayRemove(tagToRemove)
    });

    // LOG ACTIVITY
    await addDoc(collection(db, 'activities'), {
      userName: userProfile.value?.nickname || 'Admin',
      actionType: 'removed the tag',
      contentType: 'tag',
      contentTitle: tagToRemove,
      timestamp: serverTimestamp()
    });

    currentTags.value = currentTags.value.filter(t => t !== tagToRemove);
  } catch (error) {
    console.error("Error removing tag:", error);
  }
};

const saveWebhooks = async () => {
  isSavingWebhooks.value = true;
  webhooksSaveStatus.value = '';

  try {
    await setDoc(guildSettingsRef, {
      discordWebhook: tokenWebhookUrl.value.trim(),  // Keeping original DB key to not break Login.vue
      feedbackWebhook: feedbackWebhookUrl.value.trim(), // New DB key
      contentWebhook: contentWebhookUrl.value.trim()
    }, { merge: true });

    await addDoc(collection(db, 'activities'), {
      userName: userProfile.value?.nickname || 'Admin',
      actionType: 'updated the Guild Settings',
      contentType: 'setting',
      contentTitle: 'Discord Webhooks',
      timestamp: serverTimestamp()
    });

    webhooksSaveStatus.value = 'Webhooks updated successfully!';
    setTimeout(() => { webhooksSaveStatus.value = ''; }, 3000);

  } catch (error) {
    console.error("Error saving webhooks:", error);
    webhooksSaveStatus.value = 'Failed to save webhooks.';
  } finally {
    isSavingWebhooks.value = false;
  }
};

const scheduleSaveStatus = ref('');

const addToScheduleList = () => {
  if (!newScheduleTitle.value.trim() || !newScheduleTime.value) return;

  const [hours, minutes] = newScheduleTime.value.split(':');
  
  // Creates Date object in local time
  const localDate = new Date(2024, 0, 7 + newScheduleDay.value, parseInt(hours), parseInt(minutes));
  
  const newEvent = {
    id: Date.now().toString(),
    title: newScheduleTitle.value.trim(),
    utcDay: localDate.getUTCDay(),
    utcHours: localDate.getUTCHours(),
    utcMinutes: localDate.getUTCMinutes()
  };

  // Push to local array (NOT saved to database yet)
  scheduleEvents.value.push(newEvent);
  newScheduleTitle.value = ''; 
};

const removeFromScheduleList = (id) => {
  // Remove from local array
  scheduleEvents.value = scheduleEvents.value.filter(e => e.id !== id);
};

const saveScheduleToDatabase = async () => {
  isSavingSchedule.value = true;
  scheduleSaveStatus.value = '';

  try {
    // Save the entire array to Firestore at once
    await setDoc(guildSettingsRef, { schedule: scheduleEvents.value }, { merge: true });
    
    await addDoc(collection(db, 'activities'), {
      userName: userProfile.value?.nickname || 'Admin',
      actionType: 'updated the',
      contentType: 'setting',
      contentTitle: 'Guild Schedule',
      timestamp: serverTimestamp()
    });

    scheduleSaveStatus.value = 'Schedule successfully saved!';
    setTimeout(() => { scheduleSaveStatus.value = ''; }, 3000);
  } catch (error) {
    console.error("Failed to save schedule:", error);
    scheduleSaveStatus.value = 'Error saving schedule.';
  } finally {
    isSavingSchedule.value = false;
  }
};

//THIS IS A NUKE BUTTON!

const isNuking = ref(false);

const nukeSystem = async () => {
  const confirm1 = confirm("DANGER: This will delete ALL content, images, and videos. This cannot be undone.");
  if (!confirm1) return;
  
  const confirm2 = prompt("Type 'PURGE' to confirm the total system reset:");
  if (confirm2 !== 'PURGE') return;

  isNuking.value = true;

  try {
    // --- STAGE 1: WIPE STORAGE ---
    console.log("Cleaning Storage...");
    const folders = ['artworks', 'videos', 'avatars'];
    
    for (const folder of folders) {
      const folderRef = storageRef(storage, folder);
      const fileList = await listAll(folderRef);
      
      const deletePromises = fileList.items.map((file) => deleteObject(file));
      await Promise.all(deletePromises);
    }

    // --- STAGE 2: WIPE FIRESTORE ---
    console.log("Cleaning Firestore...");
    const collections = ['articles', 'artworks', 'videos', 'activities', 'users'];
    
    for (const colName of collections) {
      const querySnapshot = await getDocs(collection(db, colName));
      
      const batch = writeBatch(db);
      
      for (const document of querySnapshot.docs) {
        if (colName === 'articles') {
          const revs = await getDocs(collection(db, 'articles', document.id, 'revisions'));
          revs.forEach(revDoc => batch.delete(revDoc.ref));
        }
        batch.delete(document.ref);
      }
      await batch.commit();
    }

    await deleteDoc(doc(db, 'config', 'tags'));

    alert("System has been reset to a clean slate. Please refresh the page.");
    window.location.reload();

  } catch (error) {
    console.error("Nuke failed:", error);
    alert("An error occurred during the purge. Some data may still remain.");
  } finally {
    isNuking.value = false;
  }
};
</script>