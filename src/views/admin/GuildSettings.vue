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

    </div>
  </div>

  <!-- <div class="mt-12 pt-8 border-t border-red-200 dark:border-red-900/30">
    <h3 class="text-lg font-bold text-red-600 dark:text-red-400">Danger Zone</h3>
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Ready to go live? This will wipe all test data and media for a clean start. 
        User accounts in Authentication will remain, but their profiles will be reset.
    </p>
    
    <button 
        @click="nukeSystem" 
        :disabled="isNuking"
        class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-black rounded-lg shadow-lg shadow-red-200 dark:shadow-none transition-all transform active:scale-95 disabled:opacity-50"
    >
        {{ isNuking ? 'PURGING SYSTEM...' : 'RESET TO CLEAN SLATE' }}
    </button>
    </div> -->
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

onMounted(async () => {
  // 1. Fetch current tags
  const docSnap = await getDoc(tagsDocRef);
  if (docSnap.exists()) {
    currentTags.value = docSnap.data().list || [];
  }

  // 2. Fetch admin profile for activity logging
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