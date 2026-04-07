<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white">Guild Artworks</h1>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Community screenshots, fan art, and visual guides.</p>
      </div>

      <div class="flex items-center gap-2">
        <label for="sort" class="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</label>
        <select 
          id="sort" 
          v-model="sortBy"
          class="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-800 dark:text-white transition-colors"
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
        </select>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <svg class="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      <div 
        v-for="artwork in sortedArtworks" 
        :key="artwork.id" 
        @click="openModal(artwork)"
        class="group cursor-pointer bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
      >
        <div class="relative aspect-square overflow-hidden bg-gray-200 dark:bg-gray-700">
          <img :src="artwork.fileUrl" :alt="artwork.title" class="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" loading="lazy">
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <svg class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
          </div>
        </div>
        <div class="p-3 mt-auto">
          <h3 class="text-sm font-bold text-gray-900 dark:text-white truncate" :title="artwork.title">{{ artwork.title }}</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
            By {{ artwork.authorName || 'Unknown' }} &bull; {{ formatDate(artwork.createdAt) }}
          </p>
        </div>
      </div>
    </div>

    <div v-if="!isLoading && sortedArtworks.length === 0" class="text-center py-20">
      <p class="text-gray-500 dark:text-gray-400 text-lg">No artworks have been uploaded yet.</p>
    </div>

    <Teleport to="body">
      <div v-if="selectedArtwork" class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-8 backdrop-blur-sm" @click.self="closeModal">
        <button @click="closeModal" class="absolute top-4 right-4 text-white hover:text-gray-300 p-2 focus:outline-none transition-colors">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div class="max-w-5xl w-full flex flex-col items-center">
          <img :src="selectedArtwork.fileUrl" :alt="selectedArtwork.title" class="max-h-[80vh] w-auto object-contain rounded shadow-2xl">
          
          <div class="w-full flex items-center justify-between mt-6 bg-gray-900/80 p-4 rounded-lg border border-gray-700">
            <div class="flex items-center gap-4">
              <img v-if="selectedArtwork.authorAvatar" :src="selectedArtwork.authorAvatar" class="h-12 w-12 rounded-full object-cover border-2 border-gray-600 bg-gray-800">
              <div v-else class="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 border-2 border-gray-600">
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              
              <div class="text-white">
                <h2 class="text-xl font-bold">{{ selectedArtwork.title }}</h2>
                <p class="text-sm text-gray-400 mt-1">Uploaded by <span class="text-indigo-400">{{ selectedArtwork.authorName || 'Unknown' }}</span> on {{ formatDate(selectedArtwork.createdAt) }}</p>
              </div>
            </div>
            
            <a :href="selectedArtwork.fileUrl" target="_blank" download class="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-lg">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              Download
            </a>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { db } from '../../firebase';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';

const artworks = ref([]);
const isLoading = ref(true);
const sortBy = ref('date-desc'); // Default sort
const selectedArtwork = ref(null); // Holds the currently viewed artwork
const route = useRoute();

// Fetch all artworks once on load
onMounted(async () => {
  try {
    const q = query(
      collection(db, 'artworks'), 
      where('status', '==', 'Approved'), 
      orderBy('createdAt', 'desc')       
    );
    
    const querySnapshot = await getDocs(q);
    
    const results = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });
    
    artworks.value = results;

    // --- NEW DEEP LINK LOGIC ---
    // If the URL has ?id=something, find it and open the modal
    if (route.query.id) {
      const targetArtwork = artworks.value.find(a => a.id === route.query.id);
      if (targetArtwork) {
        openModal(targetArtwork);
      }
    }
    // ---------------------------

  } catch (error) {
    console.error("Error fetching artworks:", error);
  } finally {
    isLoading.value = false;
  }
});

// The Sorting Engine (Runs instantly in the browser)
const sortedArtworks = computed(() => {
  // Create a copy of the array so we don't mutate the original
  return [...artworks.value].sort((a, b) => {
    // Handle cases where createdAt might be missing or pending
    const timeA = a.createdAt ? a.createdAt.toMillis() : 0;
    const timeB = b.createdAt ? b.createdAt.toMillis() : 0;
    const titleA = a.title.toLowerCase();
    const titleB = b.title.toLowerCase();

    if (sortBy.value === 'date-desc') return timeB - timeA;
    if (sortBy.value === 'date-asc') return timeA - timeB;
    if (sortBy.value === 'name-asc') return titleA.localeCompare(titleB);
    if (sortBy.value === 'name-desc') return titleB.localeCompare(titleA);
    return 0;
  });
});

// Modal Logic
const openModal = (artwork) => {
  selectedArtwork.value = artwork;
  document.body.style.overflow = 'hidden'; // Prevent background scrolling when modal is open
};

const closeModal = () => {
  selectedArtwork.value = null;
  document.body.style.overflow = 'auto'; // Restore scrolling
};

// Date Formatter
const formatDate = (timestamp) => {
  if (!timestamp) return 'Just now';
  const date = timestamp.toDate();
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};
</script>