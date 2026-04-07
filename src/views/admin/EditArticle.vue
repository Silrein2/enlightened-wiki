<template>
  <div class="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 border border-gray-200 dark:border-gray-700">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Edit Article</h2>
      <button @click="$router.back()" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Cancel</button>
    </div>

    <form @submit.prevent="handleUpdate" class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
        <input v-model="title" type="text" required class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white">
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
        <textarea v-model="bodyContent" required rows="15" class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white font-mono text-sm"></textarea>
      </div>

      <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
        <button type="submit" :disabled="isSaving" class="w-full py-3 bg-indigo-600 text-white rounded-md font-bold hover:bg-indigo-700 disabled:opacity-50">
          {{ isSaving ? 'Saving Revision...' : 'Save Changes' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { db, auth } from '../../firebase';
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const route = useRoute();
const router = useRouter();
const title = ref('');
const bodyContent = ref('');
const isSaving = ref(false);
const userProfile = ref(null);

onMounted(async () => {
  // 1. Fetch current article data
  const docSnap = await getDoc(doc(db, 'articles', route.params.id));
  if (docSnap.exists()) {
    const data = docSnap.data();
    title.value = data.title;
    bodyContent.value = data.content;
  }

  // 2. Fetch editor's profile
  const user = auth.currentUser;
  if (user) {
    const profileSnap = await getDoc(doc(db, 'users', user.uid));
    if (profileSnap.exists()) userProfile.value = profileSnap.data();
  }
});

const handleUpdate = async () => {
  isSaving.value = true;
  const articleId = route.params.id;
  const editorName = userProfile.value?.nickname || 'Unknown Editor';

  try {
    // 1. Update the Main Article Document
    await updateDoc(doc(db, 'articles', articleId), {
      title: title.value,
      content: bodyContent.value,
      status: 'Pending',         // RESET to Pending for re-approval
      rejectionReason: null,     // CLEAR the old reason
      lastEditedBy: editorName,
      lastEditedAt: serverTimestamp()
    });

    // 2. Create a Revision Entry (for your history log)
    await addDoc(collection(db, 'articles', articleId, 'revisions'), {
      content: bodyContent.value,
      editorName: editorName,
      timestamp: serverTimestamp()
    });

    // 3. Log Activity for the Dashboard
    await addDoc(collection(db, 'activities'), {
      userName: editorName,
      actionType: 'resubmitted',
      contentType: 'article',
      contentTitle: title.value,
      timestamp: serverTimestamp()
    });

    router.push('/dashboard');
  } catch (error) {
    console.error("Update failed:", error);
    alert("Error saving changes.");
  } finally {
    isSaving.value = false;
  }
};
</script>