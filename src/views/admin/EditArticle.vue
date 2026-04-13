<template>
  <div class="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 border border-gray-200 dark:border-gray-700">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Edit Article</h2>
      <button @click="$router.back()" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Cancel</button>
    </div>

    <form @submit.prevent="handleUpdate" class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
        <input 
          v-model="title" 
          type="text" 
          required 
          class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
        >
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content</label>
        
        <div class="sticky top-0 z-10 flex flex-wrap items-center gap-1 p-2 bg-gray-50 dark:bg-gray-900 border border-b-0 border-gray-300 dark:border-gray-600 rounded-t-md">
          <button type="button" @click="editor.chain().focus().toggleBold().run()" :class="{'bg-indigo-600 text-white': editor?.isActive('bold')}" class="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6zM6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z"></path></svg>
          </button>

          <button type="button" @click="editor.chain().focus().toggleItalic().run()" :class="{'bg-indigo-600 text-white': editor?.isActive('italic')}" class="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
          </button>

          <button type="button" @click="editor.chain().focus().toggleUnderline().run()" :class="{'bg-indigo-600 text-white': editor?.isActive('underline')}" class="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <span class="font-bold underline px-1 dark:text-white">U</span>
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

      <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
        <button type="submit" :disabled="isSaving" class="w-full py-3 bg-indigo-600 text-white rounded-md font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors">
          {{ isSaving ? 'Saving Revision...' : 'Save Changes' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { db, auth, storage } from '../../firebase';
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

// Tiptap Imports
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style'; // Named import
import Image from '@tiptap/extension-image';

import { Extension } from '@tiptap/core';

const route = useRoute();
const router = useRouter();

// State
const title = ref('');
const isSaving = ref(false);
const isUploadingInline = ref(false);
const userProfile = ref(null);
const inlineImageInput = ref(null);

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

// Initialize Editor
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
      HTMLAttributes: {
        class: 'rounded-lg shadow-md my-6 max-w-full h-auto mx-auto',
      },
    }),
  ],
  editorProps: {
    attributes: {
      class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-4 border border-gray-300 dark:border-gray-600 rounded-b-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
    },
  },
});

onMounted(async () => {
  // 1. Fetch current article data
  const docSnap = await getDoc(doc(db, 'articles', route.params.id));
  if (docSnap.exists()) {
    const data = docSnap.data();
    title.value = data.title;
    // Set Tiptap content
    if (editor.value) {
      editor.value.commands.setContent(data.content || '');
    }
  }

  // 2. Fetch editor's profile
  const user = auth.currentUser;
  if (user) {
    const profileSnap = await getDoc(doc(db, 'users', user.uid));
    if (profileSnap.exists()) userProfile.value = profileSnap.data();
  }
});

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy();
  }
});

const MAX_FILE_SIZE = 25 * 1024 * 1024;

// Inline Image Logic
const handleInlineImageUpload = async (event) => {
  const file = event.target.files[0];
  if (!file || !editor.value) return;

  // Added Size Check
  if (file.size > MAX_FILE_SIZE) {
    alert("This image is too chunky! Please keep it under 25MB.");
    event.target.value = '';
    return;
  }

  isUploadingInline.value = true;

  try {
    const fileExtension = file.name.split('.').pop();
    const uniqueFilename = `inline_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
    const fileRef = storageRef(storage, `articles/inline/${uniqueFilename}`);
    
    const snapshot = await uploadBytes(fileRef, file);
    const fileUrl = await getDownloadURL(snapshot.ref);

    // Inject Image using Tiptap command
    editor.value.chain().focus().setImage({ src: fileUrl, alt: 'Article Image' }).run();

  } catch (error) {
    console.error("Inline upload failed:", error);
    alert("Failed to upload image.");
  } finally {
    isUploadingInline.value = false;
    event.target.value = ''; 
  }
};

const handleUpdate = async () => {
  if (!editor.value) return;
  
  isSaving.value = true;
  const articleId = route.params.id;
  const editorName = userProfile.value?.nickname || 'Unknown Editor';
  const currentHTML = editor.value.getHTML();

  try {
    // 1. Update the Main Article Document
    await updateDoc(doc(db, 'articles', articleId), {
      title: title.value,
      content: currentHTML,
      status: 'Pending',         // RESET to Pending for re-approval
      rejectionReason: null,     // CLEAR the old reason
      lastEditedBy: editorName,
      lastEditedAt: serverTimestamp()
    });

    // 2. Create a Revision Entry
    await addDoc(collection(db, 'articles', articleId, 'revisions'), {
      content: currentHTML,
      editorName: editorName,
      timestamp: serverTimestamp()
    });

    // 3. Log Activity
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