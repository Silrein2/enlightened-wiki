<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white">Guild Videos</h1>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Gameplay clips, boss guides, and cinematic moments.</p>
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
          <option value="likes-desc">Most Likes</option>
          <option value="likes-asc">Least Likes</option>
        </select>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <svg class="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="video in sortedVideos" 
        :key="video.id" 
        @click="openModal(video)"
        class="group cursor-pointer bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
      >
        <div class="relative aspect-video bg-black overflow-hidden flex items-center justify-center">
          <video :src="video.fileUrl" muted loop class="object-cover w-full h-full opacity-60 group-hover:opacity-100 transition-opacity duration-300" onmouseover="this.play()" onmouseout="this.pause(); this.currentTime = 0;"></video>
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div class="bg-indigo-600/80 group-hover:bg-indigo-600 rounded-full p-4 transition-colors shadow-xl">
              <svg class="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z"></path></svg>
            </div>
          </div>
        </div>
        <div class="p-4 mt-auto">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white truncate" :title="video.title">{{ video.title }}</h3>
          
          <div class="flex items-center justify-between mt-1">
            <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
              By {{ video.authorName || 'Unknown' }} &bull; {{ formatDate(video.createdAt) }}
            </p>
            <span v-if="(video.reactionCount || 0) > 0" class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
               ❤️ {{ video.reactionCount }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!isLoading && sortedVideos.length === 0" class="text-center py-20">
      <p class="text-gray-500 dark:text-gray-400 text-lg">No videos have been uploaded yet.</p>
    </div>

    <Teleport to="body">
      <div v-if="selectedVideo" class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 md:p-12 backdrop-blur-md" @click.self="closeModal">
        <button @click="closeModal" class="absolute top-6 right-6 text-white hover:text-gray-400 p-2 focus:outline-none transition-colors z-[60]">
          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div class="max-w-6xl w-full flex flex-col items-center">
          <div class="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-white/10">
            <video :src="selectedVideo.fileUrl" controls autoplay class="w-full h-full"></video>
          </div>
          
          <div class="w-full flex flex-col lg:flex-row lg:items-center justify-between mt-6 gap-4 bg-gray-900/80 p-6 rounded-xl border border-gray-700">
            <div class="flex items-center gap-4">
              <img v-if="selectedVideo.authorAvatar" :src="selectedVideo.authorAvatar" class="h-14 w-14 rounded-full object-cover border-2 border-gray-600 bg-gray-800">
              <div v-else class="h-14 w-14 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 border-2 border-gray-600">
                <svg class="h-8 w-8" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              
              <div class="text-white">
                <h2 class="text-2xl font-bold">{{ selectedVideo.title }}</h2>
                <p class="text-sm text-gray-400 mt-1">Uploaded by <span class="text-indigo-400">{{ selectedVideo.authorName || 'Unknown' }}</span> on {{ formatDate(selectedVideo.createdAt) }}</p>
              </div>
            </div>
            
            <div class="flex items-center flex-wrap gap-4">
              <div class="flex items-center gap-2 border-r border-gray-700 pr-4 mr-2">
                <template v-if="userProfile && (userProfile.role === 'admin' || userProfile.role === 'creator')">
                  <button 
                    @click="toggleReaction('heart')"
                    :class="[
                      'flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-sm',
                      userReaction === 'heart' ? 'bg-red-900/30 border-red-800 text-red-500' : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
                    ]"
                  >
                    <span>❤️</span> <span class="font-bold">{{ heartCount }}</span>
                  </button>

                  <button 
                    @click="toggleReaction('laugh')"
                    :class="[
                      'flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-sm',
                      userReaction === 'laugh' ? 'bg-yellow-900/30 border-yellow-800 text-yellow-500' : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
                    ]"
                  >
                    <span>😂</span> <span class="font-bold">{{ laughCount }}</span>
                  </button>
                </template>
                
                <template v-else>
                  <div class="flex items-center gap-4 text-gray-400 text-sm">
                    <span class="flex items-center gap-1">❤️ {{ heartCount }}</span>
                    <span class="flex items-center gap-1">😂 {{ laughCount }}</span>
                  </div>
                </template>
              </div>

              <a :href="selectedVideo.fileUrl" target="_blank" download class="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg font-bold transition-all transform hover:scale-105 active:scale-95 shadow-xl text-sm">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Download Video
              </a>
            </div>
            </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
// 🌟 FIX: Added missing auth imports
import { db, auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, orderBy, limit, where, doc, getDoc, updateDoc } from 'firebase/firestore'; 

const videos = ref([]);
const isLoading = ref(true);
const sortBy = ref('date-desc');
const selectedVideo = ref(null);
const route = useRoute();

const userProfile = ref(null); 
const currentUserId = ref(null);
const isLoggedIn = ref(false); // 🌟 FIX: Added missing ref

const userReaction = computed(() => {
  if (!selectedVideo.value || !currentUserId.value) return null;
  return selectedVideo.value.reactions?.[currentUserId.value] || null;
});

const heartCount = computed(() => {
  if (!selectedVideo.value?.reactions) return 0;
  return Object.values(selectedVideo.value.reactions).filter(r => r === 'heart').length;
});

const laughCount = computed(() => {
  if (!selectedVideo.value?.reactions) return 0;
  return Object.values(selectedVideo.value.reactions).filter(r => r === 'laugh').length;
});

onMounted(async () => {
  try {
    const q = query(
        collection(db, 'videos'),
        where('status', '==', 'Approved'),
        orderBy('createdAt', 'desc'),   
    );
    const querySnapshot = await getDocs(q);
    const results = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });
    videos.value = results;
  } catch (error) {
    console.error("Error fetching videos:", error);
  } finally {
    isLoading.value = false;
  }
  if (route.query.id) {
      const targetVideo = videos.value.find(v => v.id === route.query.id);
      if (targetVideo) {
        openModal(targetVideo);
      }
    }

  onAuthStateChanged(auth, async (user) => {
    isLoggedIn.value = !!user;
    if (user) {
      currentUserId.value = user.uid;
      const profileSnap = await getDoc(doc(db, 'users', user.uid));
      if (profileSnap.exists()) {
        userProfile.value = profileSnap.data();
      }
    } else {
      currentUserId.value = null;
      userProfile.value = null;
    }
  });
});

const sortedVideos = computed(() => {
  return [...videos.value].sort((a, b) => {
    const timeA = a.createdAt ? a.createdAt.toMillis() : 0;
    const timeB = b.createdAt ? b.createdAt.toMillis() : 0;
    const titleA = a.title.toLowerCase();
    const titleB = b.title.toLowerCase();

    const likesA = a.reactionCount || 0; 
    const likesB = b.reactionCount || 0;

    if (sortBy.value === 'date-desc') return timeB - timeA;
    if (sortBy.value === 'date-asc') return timeA - timeB;
    if (sortBy.value === 'name-asc') return titleA.localeCompare(titleB);
    if (sortBy.value === 'name-desc') return titleB.localeCompare(titleA);

    if (sortBy.value === 'likes-desc') {
      if (likesB === likesA) return timeB - timeA; 
      return likesB - likesA;
    }
    if (sortBy.value === 'likes-asc') {
      if (likesA === likesB) return timeB - timeA; 
      return likesA - likesB;
    }

    return 0;
  });
});

const toggleReaction = async (type) => {
  if (!selectedVideo.value || !currentUserId.value) return;

  const videoId = selectedVideo.value.id;
  const currentReactions = selectedVideo.value.reactions || {};
  let newReactions = { ...currentReactions };

  if (newReactions[currentUserId.value] === type) {
    delete newReactions[currentUserId.value];
  } else {
    newReactions[currentUserId.value] = type;
  }

  const totalCount = Object.keys(newReactions).length;

  selectedVideo.value.reactions = newReactions;
  selectedVideo.value.reactionCount = totalCount;

  const videoIndex = videos.value.findIndex(a => a.id === videoId);
  if (videoIndex !== -1) {
    videos.value[videoIndex].reactions = newReactions;
    videos.value[videoIndex].reactionCount = totalCount;
  }

  try {
    // 🌟 FIX: Changed 'videosId' to 'videoId'
    await updateDoc(doc(db, 'videos', videoId), {
      reactions: newReactions,
      reactionCount: totalCount
    });
  } catch (error) {
    console.error("Failed to save reaction:", error);
  }
};

const openModal = (video) => {
  selectedVideo.value = video;
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  selectedVideo.value = null;
  document.body.style.overflow = 'auto';
};

const formatDate = (timestamp) => {
  if (!timestamp) return 'Just now';
  const date = timestamp.toDate();
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
};
</script>