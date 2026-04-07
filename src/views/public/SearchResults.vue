<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
    
    <div class="border-b border-gray-200 dark:border-gray-800 pb-5">
      <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white">
        Search Results for "<span class="text-indigo-600 dark:text-indigo-400">{{ currentQuery }}</span>"
      </h1>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Found {{ totalResults }} total results across the wiki.
      </p>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <svg class="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <div v-else class="space-y-12 pb-12">
      
      <div v-if="totalResults === 0" class="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900 dark:text-white">No results found</h3>
        <p class="mt-1 text-gray-500 dark:text-gray-400">We couldn't find anything matching "{{ currentQuery }}". Try adjusting your search terms.</p>
      </div>

      <section v-if="filteredArticles.length > 0">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <span class="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 py-1 px-3 rounded-full text-sm">{{ filteredArticles.length }}</span>
          Articles
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <router-link 
            v-for="article in filteredArticles" :key="article.id" 
            :to="{ path: '/articles', query: { id: article.id } }"
            class="block bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
          >
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">{{ article.title }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{{ article.content.replace(/<[^>]*>?/gm, '') }}</p>
          </router-link>
        </div>
      </section>

      <section v-if="filteredArtworks.length > 0">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <span class="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 py-1 px-3 rounded-full text-sm">{{ filteredArtworks.length }}</span>
          Artworks
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <router-link 
            v-for="artwork in filteredArtworks" :key="artwork.id" 
            :to="{ path: '/artworks', query: { id: artwork.id } }"
            class="group block bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all"
          >
            <div class="aspect-square bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
              <img :src="artwork.fileUrl" :alt="artwork.title" class="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500">
            </div>
            <div class="p-3">
              <h3 class="text-sm font-bold text-gray-900 dark:text-white truncate">{{ artwork.title }}</h3>
            </div>
          </router-link>
        </div>
      </section>

      <section v-if="filteredVideos.length > 0">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <span class="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 py-1 px-3 rounded-full text-sm">{{ filteredVideos.length }}</span>
          Videos
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <router-link 
            v-for="video in filteredVideos" :key="video.id" 
            :to="{ path: '/videos', query: { id: video.id } }"
            class="group block bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all"
          >
            <div class="aspect-video bg-black relative flex items-center justify-center">
              <video :src="video.fileUrl" class="object-cover w-full h-full opacity-60"></video>
              <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div class="bg-black/50 rounded-full p-2">
                  <svg class="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z"></path></svg>
                </div>
              </div>
            </div>
            <div class="p-3">
              <h3 class="text-sm font-bold text-gray-900 dark:text-white truncate">{{ video.title }}</h3>
            </div>
          </router-link>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { db } from '../../firebase';
import { collection, getDocs, where, query } from 'firebase/firestore';

const route = useRoute();
const currentQuery = ref('');
const isLoading = ref(true);

// Raw Data Arrays
const allArticles = ref([]);
const allArtworks = ref([]);
const allVideos = ref([]);

// Filtered Result Arrays
const filteredArticles = ref([]);
const filteredArtworks = ref([]);
const filteredVideos = ref([]);

const totalResults = computed(() => {
  return filteredArticles.value.length + filteredArtworks.value.length + filteredVideos.value.length;
});

// The core search function
const executeSearch = () => {
  const q = route.query.q ? route.query.q.toLowerCase() : '';
  currentQuery.value = route.query.q || '';
  
  if (!q) {
    filteredArticles.value = [];
    filteredArtworks.value = [];
    filteredVideos.value = [];
    return;
  }

  // Articles: Search Title OR Body Content OR Tags
  filteredArticles.value = allArticles.value.filter(article => {
    const titleMatch = article.title.toLowerCase().includes(q);
    // const contentMatch = article.content && article.content.toLowerCase().includes(q);
    const contentMatch = article.content && article.content.replace(/<[^>]*>?/gm, '').toLowerCase().includes(q);
    const tagsMatch = article.tags && article.tags.some(tag => tag.toLowerCase().includes(q));
    
    return titleMatch || contentMatch || tagsMatch;
  });

  // Artworks: Search Title Only
  filteredArtworks.value = allArtworks.value.filter(artwork => {
    return artwork.title.toLowerCase().includes(q);
  });

  // Videos: Search Title Only
  filteredVideos.value = allVideos.value.filter(video => {
    return video.title.toLowerCase().includes(q);
  });
};

// Fetch everything once on load, then run the search
onMounted(async () => {
  isLoading.value = true;
  try {
    // We create queries to only fetch 'Approved' content
    const articlesQuery = query(collection(db, 'articles'), where('status', '==', 'Approved'));
    const artworksQuery = query(collection(db, 'artworks'), where('status', '==', 'Approved'));
    const videosQuery = query(collection(db, 'videos'), where('status', '==', 'Approved'));

    const [articlesSnap, artworksSnap, videosSnap] = await Promise.all([
      getDocs(articlesQuery),
      getDocs(artworksQuery),
      getDocs(videosQuery)
    ]);

    allArticles.value = articlesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    allArtworks.value = artworksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    allVideos.value = videosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    executeSearch();
  } catch (error) {
    console.error("Search fetch error:", error);
  } finally {
    isLoading.value = false;
  }
});

// Watch the URL. If the user uses the search bar again while on this page, re-run the search instantly!
watch(
  () => route.query.q,
  () => {
    executeSearch();
  }
);
</script>