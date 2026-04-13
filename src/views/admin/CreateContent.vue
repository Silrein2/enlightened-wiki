<template>
  <div class="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-200 dark:border-gray-700">
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
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Article Content</label>
            
            <div class="sticky top-0 z-10 flex flex-wrap items-center gap-1 p-2 bg-gray-50 dark:bg-gray-900 border border-b-0 border-gray-300 dark:border-gray-600 rounded-t-md">
              <button type="button" @click="editor.chain().focus().toggleBold().run()" :class="{'bg-indigo-600 text-white': editor?.isActive('bold')}" class="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6zM6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z"></path></svg>
              </button>

              <button type="button" @click="editor.chain().focus().toggleItalic().run()" :class="{'bg-indigo-600 text-white': editor?.isActive('italic')}" class="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
              </button>

              <button type="button" @click="editor.chain().focus().toggleUnderline().run()" :class="{'bg-indigo-600 text-white': editor?.isActive('underline')}" class="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <span class="font-bold underline px-1">U</span>
              </button>

              <button type="button" @click="editor.chain().focus().setHorizontalRule().run()" class="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <span class="text-xs font-bold">— Line</span>
              </button>

              <button type="button" @click="editor.chain().focus().toggleBulletList().run()" :class="{'bg-indigo-600 text-white': editor?.isActive('bulletList')}" class="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" title="Bullet List">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"></path></svg>
              </button>

              <button type="button" @click="editor.chain().focus().toggleOrderedList().run()" :class="{'bg-indigo-600 text-white': editor?.isActive('orderedList')}" class="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" title="Numbered List">
                <span class="font-bold px-1 text-sm dark:text-white">1.</span>
              </button>

              <div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

              <input 
                type="color" 
                @input="editor.chain().focus().setColor($event.target.value).run()"
                class="w-6 h-6 p-0 border-none bg-transparent cursor-pointer"
                :value="editor?.getAttributes('textStyle').color || '#000000'"
              >

              <div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

              <select 
                :value="editor?.getAttributes('textStyle').fontSize || ''"
                @change="editor.chain().focus().setFontSize($event.target.value).run()"
                class="bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                title="Font Size"
              >
                <option value="">Default Size</option>
                <option value="12px">12px (Small)</option>
                <option value="16px">16px (Normal)</option>
                <option value="20px">20px (Large)</option>
                <option value="24px">24px (Title)</option>
                <option value="32px">32px (Huge)</option>
              </select>

              <div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

              <input type="file" ref="inlineImageInput" @change="handleInlineImageUpload" accept="image/*" class="hidden">
              <button 
                type="button" 
                @click.prevent="inlineImageInput.click()"
                :disabled="isUploadingInline"
                class="flex items-center gap-2 px-3 py-1 text-xs font-bold bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-indigo-600 hover:text-white transition-colors disabled:opacity-50"
              >
                <span v-if="isUploadingInline">Uploading...</span>
                <span v-else>+ Add Image</span>
              </button>
            </div>

            <editor-content :editor="editor" />
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
import { ref, onMounted, onBeforeUnmount } from 'vue'; // Added onBeforeUnmount
import { db, storage, auth } from '../../firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

// --- TIPTAP IMPORTS ---
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style'
import Image from '@tiptap/extension-image'

import { Extension } from '@tiptap/core';

// Component Refs
const inlineImageInput = ref(null);

// Form State
const contentType = ref('article');
const title = ref('');
const bodyContent = ref(''); // This will store the HTML string from Tiptap
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

const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return { types: ['textStyle'] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize || null,
            renderHTML: attributes => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize: fontSize => ({ chain }) => {
        return chain().setMark('textStyle', { fontSize }).run();
      },
      unsetFontSize: () => ({ chain }) => {
        return chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run();
      },
    };
  },
});

// --- INITIALIZE TIPTAP ---
const editor = useEditor({
  content: '',
  extensions: [
    StarterKit.configure({
      horizontalRule: {
        HTMLAttributes: {
          // The '!' forces Tailwind to override the prose defaults
          class: 'my-8 !border-t-[3px] !border-gray-400 dark:!border-gray-500 !opacity-100',
        },
      },
    }), 
    Underline, 
    TextStyle, 
    Color,
    FontSize,
    Image.configure({
      allowBase64: true, // Optional: if you ever use base64
      HTMLAttributes: {
        class: 'rounded-lg shadow-md my-6 max-w-full h-auto mx-auto', // Default classes for saved images
      },
    }),
  ],
  // Sync editor HTML to our bodyContent ref
  onUpdate: ({ editor }) => {
    bodyContent.value = editor.getHTML();
  },
  editorProps: {
    attributes: {
      class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[300px] p-4 border border-gray-300 dark:border-gray-600 rounded-b-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
    },
  },
});

onBeforeUnmount(() => {
  editor.value.destroy();
});

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

const MAX_FILE_SIZE = 25 * 1024 * 1024;

// Capture main file for Artworks/Videos
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (file.size > MAX_FILE_SIZE) {
    errorMessage.value = "File is too large! Maximum size allowed is 25MB.";
    event.target.value = ''; // Reset the input
    selectedFile.value = null;
    return;
  }

  errorMessage.value = ''; // Clear error if size is okay
  selectedFile.value = file;
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

// --- UPDATED: Handle Inline Image Injection for Tiptap ---
const handleInlineImageUpload = async (event) => {
  const file = event.target.files[0];
  if (!file || !editor.value) return;

  if (file.size > MAX_FILE_SIZE) {
    errorMessage.value = "Image too large! Inline images must be under 25MB.";
    event.target.value = '';
    return;
  }

  isUploadingInline.value = true;
  errorMessage.value = '';

  try {
    const fileExtension = file.name.split('.').pop();
    const uniqueFilename = `inline_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
    const fileRef = storageRef(storage, `articles/inline/${uniqueFilename}`);
    
    const snapshot = await uploadBytes(fileRef, file);
    const fileUrl = await getDownloadURL(snapshot.ref);

    // Inject into Tiptap
    editor.value.chain().focus().insertContent(
      `<img src="${fileUrl}" alt="Article Image" class="w-full max-w-3xl mx-auto rounded-lg shadow-md my-6">`
    ).run();

  } catch (error) {
    console.error("Inline upload failed:", error);
    errorMessage.value = "Failed to upload inline image.";
  } finally {
    isUploadingInline.value = false;
    event.target.value = ''; 
  }
};

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

    const isAnon = contentType.value === 'article' && isAnonymous.value;
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
        actionType: role === 'admin' ? 'published a new' : 'submitted for approval a new',
        contentType: contentType.value,
        contentTitle: title.value,
        timestamp: serverTimestamp()
    });

    // Reset Form
    title.value = '';
    bodyContent.value = '';
    editor.value.commands.setContent(''); // CLEAR THE EDITOR
    selectedFile.value = null;
    selectedTags.value = [];
    
    successMessage.value = `Successfully published new ${contentType.value}!`;

  } catch (error) {
    console.error("Upload error:", error);
    errorMessage.value = error.message || "An error occurred during upload.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>