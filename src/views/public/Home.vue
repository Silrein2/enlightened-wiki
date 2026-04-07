<template>
  <div class="space-y-12 pb-12">
    
    <section class="text-center py-12 md:py-20 px-4">
      <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
        Welcome to the <span class="text-indigo-600 dark:text-indigo-400">Enlightened Wiki</span>
      </h1>
      <p class="max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
        Yeah. Go nuts.
      </p>
    </section>

    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <svg class="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <div v-else class="space-y-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      <section>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Latest Articles</h2>
          <router-link to="/articles" class="text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
            See all articles &rarr;
          </router-link>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <router-link 
                v-for="article in latestArticles" 
                :key="article.id" 
                :to="{ path: '/articles', query: { id: article.id } }"
                class="cursor-pointer bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow flex flex-col"
            >
                <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{{ article.title }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">{{ formatDate(article.createdAt) }}</p>
                
                <div v-if="article.tags && article.tags.length > 0" class="flex flex-wrap gap-2 mt-auto">
                <span v-for="tag in article.tags.slice(0, 3)" :key="tag" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">
                    {{ tag }}
                </span>
                <span v-if="article.tags.length > 3" class="text-xs text-gray-500">...</span>
                </div>
            </router-link>
            
            <div v-if="latestArticles.length === 0" class="col-span-3 text-center py-10 text-gray-500 dark:text-gray-400">
                No articles published yet.
            </div>
        </div>
      </section>

      <section>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Latest Artworks</h2>
          <router-link to="/artworks" class="text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
            See all artworks &rarr;
          </router-link>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <router-link 
                v-for="artwork in latestArtworks" 
                :key="artwork.id" 
                :to="{ path: '/artworks', query: { id: artwork.id } }"
                class="group cursor-pointer bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
            >
                <div class="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700 relative overflow-hidden h-48">
                <img :src="artwork.fileUrl" :alt="artwork.title" class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300">
                </div>
                <div class="p-4">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white truncate">{{ artwork.title }}</h3>
                </div>
            </router-link>
            
            <div v-if="latestArtworks.length === 0" class="col-span-3 text-center py-10 text-gray-500 dark:text-gray-400">
                No artworks uploaded yet.
            </div>
        </div>
      </section>

      <section>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Latest Videos</h2>
          <router-link to="/videos" class="text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
            See all videos &rarr;
          </router-link>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <router-link 
                v-for="video in latestVideos" 
                :key="video.id" 
                :to="{ path: '/videos', query: { id: video.id } }"
                class="group cursor-pointer bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
            >
                <div class="bg-black relative h-48 flex items-center justify-center">
                <video class="w-full h-full object-cover opacity-80" :src="video.fileUrl" muted loop onmouseover="this.play()" onmouseout="this.pause()"></video>
                <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div class="bg-black/50 rounded-full p-3">
                    <svg class="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z"></path></svg>
                    </div>
                </div>
                </div>
                <div class="p-4">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white truncate">{{ video.title }}</h3>
                </div>
            </router-link>
            
            <div v-if="latestVideos.length === 0" class="col-span-3 text-center py-10 text-gray-500 dark:text-gray-400">
                No videos uploaded yet.
            </div>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { db } from '../../firebase';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';

const isLoading = ref(true);
const latestArticles = ref([]);
const latestArtworks = ref([]);
const latestVideos = ref([]);

// Helper function to format Firebase timestamps
const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = timestamp.toDate(); // Convert Firebase Timestamp to JS Date
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};

// Generic function to fetch the latest 3 items from any collection
const fetchLatest = async (collectionName, stateRef) => {
  try {
    const q = query(
      collection(db, collectionName),
      where('status', '==', 'Approved'),
      orderBy('createdAt', 'desc'),
      limit(3)
    );
    const querySnapshot = await getDocs(q);
    const results = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });
    stateRef.value = results;
  } catch (error) {
    console.error(`Error fetching ${collectionName}:`, error);
  }
};

onMounted(async () => {
  isLoading.value = true;
  
  // Run all three queries concurrently for faster loading
  await Promise.all([
    fetchLatest('articles', latestArticles),
    fetchLatest('artworks', latestArtworks),
    fetchLatest('videos', latestVideos)
  ]);
  
  isLoading.value = false;
});
</script>