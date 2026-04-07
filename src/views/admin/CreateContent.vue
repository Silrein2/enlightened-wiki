<template>
  <div class="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
    <div class="px-6 py-8">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create New Content</h2>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content Type</label>
          <div class="flex space-x-4">
            <label class="inline-flex items-center">
              <input type="radio" v-model="contentType" value="article" class="text-indigo-600 focus:ring-indigo-500 dark:bg-gray-700">
              <span class="ml-2 text-gray-700 dark:text-gray-300">Article</span>
            </label>
            <label class="inline-flex items-center">
              <input type="radio" v-model="contentType" value="artwork" class="text-indigo-600 focus:ring-indigo-500 dark:bg-gray-700">
              <span class="ml-2 text-gray-700 dark:text-gray-300">Artwork</span>
            </label>
            <label class="inline-flex items-center">
              <input type="radio" v-model="contentType" value="video" class="text-indigo-600 focus:ring-indigo-500 dark:bg-gray-700">
              <span class="ml-2 text-gray-700 dark:text-gray-300">Video</span>
            </label>
          </div>
        </div>

        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
          <input 
            type="text" 
            id="title" 
            v-model="title" 
            required 
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter title here..."
          >
        </div>

        <div v-if="contentType === 'article'" class="space-y-4">
          
          <div>
            <div class="flex justify-between items-end mb-1">
              <label for="content" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Article Content</label>
              
              <input 
                type="file" 
                ref="inlineImageInput" 
                @change="handleInlineImageUpload" 
                accept="image/*" 
                class="hidden"
              >
              <button 
                type="button" 
                @click.prevent="$refs.inlineImageInput.click()"
                :disabled="isUploadingInline"
                class="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <span v-if="isUploadingInline">Uploading...</span>
                <span v-else>+ Insert Image at Cursor</span>
              </button>
            </div>
            
            <textarea 
              id="content" 
              ref="articleTextarea"
              v-model="bodyContent" 
              required 
              rows="12" 
              class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
              placeholder="Write your article here. Use the button above to insert images..."
            ></textarea>
          </div>

          <div v-if="availableTags.length > 0" class="pt-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Tags</label>
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="tag in availableTags" 
                :key="tag"
                type="button"
                @click="toggleTag(tag)"
                :class="[
                  'px-3 py-1 rounded-full text-sm font-medium transition-colors border focus:outline-none',
                  selectedTags.includes(tag) 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                ]"
              >
                {{ tag }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="contentType !== 'article'">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Upload Main File</label>
          <input 
            type="file" 
            @change="handleFileUpload" 
            required 
            :accept="contentType === 'artwork' ? 'image/*' : 'video/*'"
            class="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900 dark:file:text-indigo-300"
          >
        </div>

        <div v-if="successMessage" class="p-4 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md">
          {{ errorMessage }}
        </div>

        <div v-if="contentType === 'article'" class="flex items-center mb-4">
          <input id="anonymous" type="checkbox" v-model="isAnonymous" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:bg-gray-700">
          <label for="anonymous" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Publish Anonymously (Hides your nickname and avatar)
          </label>
        </div>

        <div class="pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
          <button 
            type="submit" 
            :disabled="isSubmitting"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
          >
            {{ isSubmitting ? 'Publishing...' : 'Publish Content' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { db, storage, auth } from '../../firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

// Component Refs
const articleTextarea = ref(null);
const inlineImageInput = ref(null);

// Form State
const contentType = ref('article');
const title = ref('');
const bodyContent = ref('');
const selectedFile = ref(null);

// Tag State
const availableTags = ref([]);
const selectedTags = ref([]);

// UI State
const isSubmitting = ref(false);
const isUploadingInline = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

// Anonymity State
const isAnonymous = ref(false);
const currentUserProfile = ref({ nickname: 'Admin', avatarUrl: '' });

onMounted(async () => {
  // Fetch Tags
  try {
    const docSnap = await getDoc(doc(db, 'config', 'tags'));
    if (docSnap.exists()) availableTags.value = docSnap.data().list || [];
  } catch (error) { console.error("Failed to load tags:", error); }

  // Fetch User Profile
  const user = auth.currentUser;
  if (user) {
    const profileSnap = await getDoc(doc(db, 'users', user.uid));
    if (profileSnap.exists()) currentUserProfile.value = profileSnap.data();
  }
});

// Capture main file for Artworks/Videos
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) selectedFile.value = file;
};

// Toggle tags
const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag);
  if (index === -1) {
    selectedTags.value.push(tag);
  } else {
    selectedTags.value.splice(index, 1);
  }
};

// --- NEW: Handle Inline Image Injection ---
const handleInlineImageUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  isUploadingInline.value = true;
  errorMessage.value = '';

  try {
    // 1. Upload to Storage
    const fileExtension = file.name.split('.').pop();
    const uniqueFilename = `inline_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
    const fileRef = storageRef(storage, `articles/inline/${uniqueFilename}`);
    
    const snapshot = await uploadBytes(fileRef, file);
    const fileUrl = await getDownloadURL(snapshot.ref);

    // 2. Create the HTML string with Tailwind styling classes pre-applied
    const imageHtml = `\n<img src="${fileUrl}" alt="Article Image" class="w-full max-w-3xl mx-auto rounded-lg shadow-md my-6">\n`;

    // 3. Inject it into the textarea exactly where the cursor is
    const textarea = articleTextarea.value;
    if (textarea) {
      const startPos = textarea.selectionStart;
      const endPos = textarea.selectionEnd;
      
      bodyContent.value = 
        bodyContent.value.substring(0, startPos) + 
        imageHtml + 
        bodyContent.value.substring(endPos);
      
      // Move cursor to after the inserted image
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = startPos + imageHtml.length;
        textarea.focus();
      }, 10);
    } else {
      // Fallback: just append to the end
      bodyContent.value += imageHtml;
    }

  } catch (error) {
    console.error("Inline upload failed:", error);
    errorMessage.value = "Failed to upload inline image.";
  } finally {
    isUploadingInline.value = false;
    event.target.value = ''; // Reset the input
  }
};

// Main submit logic
const handleSubmit = async () => {
  isSubmitting.value = true;
  successMessage.value = '';
  errorMessage.value = '';

  try {
    const user = auth.currentUser;
    if (!user) throw new Error("You must be logged in.");

    let fileUrl = null;

    if (contentType.value !== 'article') {
      if (!selectedFile.value) throw new Error("Please select a file to upload.");
      const fileExtension = selectedFile.value.name.split('.').pop();
      const uniqueFilename = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
      const fileRef = storageRef(storage, `${contentType.value}s/${uniqueFilename}`);
      const snapshot = await uploadBytes(fileRef, selectedFile.value);
      fileUrl = await getDownloadURL(snapshot.ref);
    }

    // Force anonymity to false if it's not an article
    const isAnon = contentType.value === 'article' && isAnonymous.value;

    // const idToken = await user.getIdTokenResult();
    // const isAdmin = !!idToken.claims.admin;
    // const initialStatus = isAdmin ? 'Approved' : 'Pending';

    const role = currentUserProfile.value.role;
    const initialStatus = role === 'admin' ? 'Approved' : 'Pending';

    const contentPayload = {
        title: title.value,
        type: contentType.value,
        authorId: user.uid,
        authorName: isAnon ? 'Anonymous' : (currentUserProfile.value.nickname || 'Creator'),
        authorAvatar: isAnon ? null : currentUserProfile.value.avatarUrl,
        createdAt: serverTimestamp(),
        status: initialStatus,
    };

    if (contentType.value === 'article') {
      contentPayload.content = bodyContent.value;
      contentPayload.tags = selectedTags.value;
    } else {
      contentPayload.fileUrl = fileUrl; 
    }

    await addDoc(collection(db, `${contentType.value}s`), contentPayload);

    await addDoc(collection(db, 'activities'), {
        userName: currentUserProfile.value.nickname || 'Creator',
        // Dynamic message
        actionType: role === 'admin' ? 'published a new' : 'submitted for approval a new',
        contentType: contentType.value,
        contentTitle: title.value,
        timestamp: serverTimestamp()
    });

    // Reset Form
    title.value = '';
    bodyContent.value = '';
    selectedFile.value = null;
    selectedTags.value = [];
    const mainFileInput = document.querySelector('input[type="file"]:not(.hidden)');
    if (mainFileInput) mainFileInput.value = '';
    
    successMessage.value = `Successfully published new ${contentType.value}!`;

  } catch (error) {
    console.error("Upload error:", error);
    errorMessage.value = error.message || "An error occurred during upload.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>