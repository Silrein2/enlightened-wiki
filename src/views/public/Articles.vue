<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    
    <div v-if="selectedArticle" class="animate-fade-in pb-16">
      
      <button 
        @click="closeArticle" 
        class="mb-8 group flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
      >
        <svg class="mr-2 w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back to Articles
      </button>

      <header class="mb-10 border-b border-gray-200 dark:border-gray-800 pb-8">
        <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
            {{ selectedArticle.title }}
        </h1>
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mt-6 gap-6">
            <div class="flex items-center">
              <div class="shrink-0 mr-3">
                  <img v-if="selectedArticle.authorAvatar" :src="selectedArticle.authorAvatar" class="h-10 w-10 rounded-full object-cover border border-gray-200 dark:border-gray-700" alt="Author Avatar">
                  <div v-else class="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  </div>
              </div>
              
              <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                  Written by {{ selectedArticle.authorName || 'Unknown' }}
                  </p>
                  
                  <div class="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <time>{{ formatDate(selectedArticle.createdAt) }}</time>
                  
                  <template v-if="selectedArticle.lastEditedBy">
                      <span class="hidden sm:inline">&bull;</span>
                      <button 
                      @click="fetchHistory"
                      class="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                      >
                      Last edited by {{ selectedArticle.lastEditedBy }}
                      </button>
                  </template>
                  </div>
              </div>
            </div>

            <div class="flex items-center gap-3"> 
              
              <button 
                @click="copyShareLink"
                :class="[
                  'inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-xs font-bold transition-all',
                  copyStatus === 'copied' 
                    ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700'
                ]"
              >
                <svg v-if="copyStatus !== 'copied'" class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                <svg v-else class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                {{ copyStatus === 'copied' ? 'Link Copied!' : 'Share Link' }}
              </button>

              <router-link 
                v-if="isLoggedIn"
                :to="`/dashboard/edit/${selectedArticle.id}`"
                class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-xs font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 transition-all"
              >
                <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                Edit Article
              </router-link>

            </div>
        </div>

        <div class="mt-6 flex flex-wrap gap-2" v-if="selectedArticle.tags && selectedArticle.tags.length > 0">
            <span 
            v-for="tag in selectedArticle.tags" 
            :key="tag" 
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800"
            >
            {{ tag }}
            </span>
        </div>
        </header>

      <div 
        class="prose dark:prose-invert max-w-none text-gray-900 dark:text-gray-100" 
        v-html="selectedArticle.content"
      >
      </div>

      <div class="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <template v-if="userProfile && (userProfile.role === 'admin' || userProfile.role === 'creator')">
            <button 
              @click="toggleReaction('heart')"
              :class="[
                'flex items-center gap-2 px-4 py-2 rounded-full border transition-all',
                userReaction === 'heart' ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-900/30 dark:border-red-800' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'
              ]"
            >
              <span class="text-xl">❤️</span>
              <span class="font-bold">{{ heartCount }}</span>
            </button>

            <button 
              @click="toggleReaction('laugh')"
              :class="[
                'flex items-center gap-2 px-4 py-2 rounded-full border transition-all',
                userReaction === 'laugh' ? 'bg-yellow-50 border-yellow-200 text-yellow-600 dark:bg-yellow-900/30 dark:border-yellow-800' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'
              ]"
            >
              <span class="text-xl">😂</span>
              <span class="font-bold">{{ laughCount }}</span>
            </button>
          </template>
          
          <template v-else>
            <div class="flex items-center gap-4 text-gray-500 dark:text-gray-400">
              <span class="flex items-center gap-1"><span class="text-xl">❤️</span> {{ heartCount }}</span>
              <span class="flex items-center gap-1"><span class="text-xl">😂</span> {{ laughCount }}</span>
            </div>
          </template>
        </div>
      </div>
      </div>

    <div v-else>
      
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white">Guild Articles</h1>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Read the latest lore, strategies, and announcements.</p>
        </div>

        <div class="flex items-center gap-2">
          <label for="sort" class="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Sort by:</label>
          <select 
            id="sort" 
            v-model="sortBy"
            class="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-800 dark:text-white transition-colors"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="name-asc">Title (A-Z)</option>
            <option value="name-desc">Title (Z-A)</option>
            <option value="likes-desc">Most Likes</option>
            <option value="likes-asc">Least Likes</option>
            </select>
        </div>
      </div>

      <div v-if="activeTags.length > 0" class="mb-8 pb-4 border-b border-gray-200 dark:border-gray-800 overflow-x-auto whitespace-nowrap">
        <button 
          @click="selectedFilterTag = ''"
          :class="[
            'mr-2 inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium transition-colors border',
            selectedFilterTag === '' 
              ? 'bg-gray-900 border-gray-900 text-white dark:bg-white dark:border-white dark:text-gray-900' 
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
          ]"
        >
          All Articles
        </button>
        <button 
          v-for="tag in activeTags" 
          :key="tag"
          @click="selectedFilterTag = tag"
          :class="[
            'mr-2 inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium transition-colors border',
            selectedFilterTag === tag 
              ? 'bg-indigo-600 border-indigo-600 text-white' 
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
          ]"
        >
          {{ tag }}
        </button>
      </div>

      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <svg class="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="article in sortedAndFilteredArticles" 
          :key="article.id" 
          @click="openArticle(article)"
          class="cursor-pointer bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 flex flex-col group"
        >
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {{ article.title }}
          </h3>
          
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {{ formatDate(article.createdAt) }}
          </p>
          
          <div class="mt-auto flex items-center justify-between">
            <div v-if="article.tags && article.tags.length > 0" class="flex flex-wrap gap-2">
              <span 
                v-for="tag in article.tags.slice(0, 3)" 
                :key="tag" 
                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
              >
                {{ tag }}
              </span>
              <span v-if="article.tags.length > 3" class="text-xs text-gray-500">...</span>
            </div>
            
            <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
              <span v-if="(article.reactionCount || 0) > 0">
                 {{ article.reactionCount }} Likes
              </span>
            </div>
          </div>
          </div>
      </div>

      <div v-if="!isLoading && sortedAndFilteredArticles.length === 0" class="text-center py-20">
        <p class="text-gray-500 dark:text-gray-400 text-lg">No articles found.</p>
        <button v-if="selectedFilterTag !== ''" @click="selectedFilterTag = ''" class="mt-4 text-indigo-600 hover:underline">
          Clear tag filter
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { db, auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
// 🌟 NEW: Added doc, getDoc, updateDoc to imports
import { collection, getDocs, query, orderBy, limit, where, doc, getDoc, updateDoc } from 'firebase/firestore'; 

const route = useRoute();
const router = useRouter();

const articles = ref([]);
const isLoading = ref(true);
const sortBy = ref('date-desc');
const selectedFilterTag = ref('');
const selectedArticle = ref(null);

const isLoggedIn = ref(false);
const showHistory = ref(false);
const history = ref([]);

// 🌟 NEW: Auth & Reaction Refs
const userProfile = ref(null); 
const currentUserId = ref(null);

const copyStatus = ref(null);

// 🌟 NEW: The Clipboard logic
const copyShareLink = async () => {
  if (!selectedArticle.value) return;
  
  // Construct the full URL using the current domain + path + the article's ID
  const url = `${window.location.origin}/articles?id=${selectedArticle.value.id}`;
  
  try {
    await navigator.clipboard.writeText(url);
    copyStatus.value = 'copied';
    
    // Reset the button text after 2 seconds
    setTimeout(() => {
      copyStatus.value = null;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy!', err);
    alert("Failed to copy link. Please copy the URL from your browser.");
  }
};

// 🌟 NEW: Computed properties for Reactions
const userReaction = computed(() => {
  if (!selectedArticle.value || !currentUserId.value) return null;
  return selectedArticle.value.reactions?.[currentUserId.value] || null;
});

const heartCount = computed(() => {
  if (!selectedArticle.value?.reactions) return 0;
  return Object.values(selectedArticle.value.reactions).filter(r => r === 'heart').length;
});

const laughCount = computed(() => {
  if (!selectedArticle.value?.reactions) return 0;
  return Object.values(selectedArticle.value.reactions).filter(r => r === 'laugh').length;
});
// 🌟 END NEW: Computed properties

onMounted(async () => {
  try {
    const q = query(
        collection(db, 'articles'), 
        where('status', '==', 'Approved'),
        orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const results = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });
    
    articles.value = results;

    if (route.query.id) {
      const target = articles.value.find(a => a.id === route.query.id);
      if (target) {
        selectedArticle.value = target;
      }
    }

  } catch (error) {
    console.error("Error fetching articles:", error);
  } finally {
    isLoading.value = false;
  }

  // 🌟 NEW: Updated Auth Listener to fetch profile data
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
  // 🌟 END NEW: Auth Listener
});

const fetchHistory = async () => {
  showHistory.value = true;
  if (history.value.length > 0) return; 

  const q = query(
    collection(db, 'articles', selectedArticle.value.id, 'revisions'),
    orderBy('timestamp', 'desc'),
    limit(10)
  );
  
  const snap = await getDocs(q);
  history.value = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// 🌟 NEW: Reaction Toggle Function
const toggleReaction = async (type) => {
  if (!selectedArticle.value || !currentUserId.value) return;

  const articleId = selectedArticle.value.id;
  const currentReactions = selectedArticle.value.reactions || {};
  let newReactions = { ...currentReactions };

  if (newReactions[currentUserId.value] === type) {
    delete newReactions[currentUserId.value];
  } else {
    newReactions[currentUserId.value] = type;
  }

  const totalCount = Object.keys(newReactions).length;

  // Optimistic UI Update
  selectedArticle.value.reactions = newReactions;
  selectedArticle.value.reactionCount = totalCount;

  const articleIndex = articles.value.findIndex(a => a.id === articleId);
  if (articleIndex !== -1) {
    articles.value[articleIndex].reactions = newReactions;
    articles.value[articleIndex].reactionCount = totalCount;
  }

  // Sync to Database
  try {
    await updateDoc(doc(db, 'articles', articleId), {
      reactions: newReactions,
      reactionCount: totalCount
    });
  } catch (error) {
    console.error("Failed to save reaction:", error);
  }
};
// 🌟 END NEW: Reaction Function

const activeTags = computed(() => {
  const tags = new Set();
  articles.value.forEach(article => {
    if (article.tags) {
      article.tags.forEach(tag => tags.add(tag));
    }
  });
  return Array.from(tags).sort();
});

const sortedAndFilteredArticles = computed(() => {
  let filtered = [...articles.value];
  if (selectedFilterTag.value !== '') {
    filtered = filtered.filter(article => 
      article.tags && article.tags.includes(selectedFilterTag.value)
    );
  }

  return filtered.sort((a, b) => {
    const timeA = a.createdAt ? a.createdAt.toMillis() : 0;
    const timeB = b.createdAt ? b.createdAt.toMillis() : 0;
    const titleA = a.title.toLowerCase();
    const titleB = b.title.toLowerCase();
    
    // 🌟 NEW: Variables for sorting logic
    const likesA = a.reactionCount || 0; 
    const likesB = b.reactionCount || 0;

    if (sortBy.value === 'date-desc') return timeB - timeA;
    if (sortBy.value === 'date-asc') return timeA - timeB;
    if (sortBy.value === 'name-asc') return titleA.localeCompare(titleB);
    if (sortBy.value === 'name-desc') return titleB.localeCompare(titleA);
    
    // 🌟 NEW: Likes Sorting Logic
    if (sortBy.value === 'likes-desc') {
      if (likesB === likesA) return timeB - timeA; // Fallback to newest
      return likesB - likesA;
    }
    if (sortBy.value === 'likes-asc') {
      if (likesA === likesB) return timeB - timeA; 
      return likesA - likesB;
    }
    // 🌟 END NEW: Likes Sorting
    
    return 0;
  });
});

const openArticle = (article) => {
  selectedArticle.value = article;
  window.scrollTo(0, 0); 
  router.push({ path: '/articles', query: { id: article.id } });
};

const closeArticle = () => {
  selectedArticle.value = null;
  router.push({ path: '/articles' });
};

const formatDate = (timestamp) => {
  if (!timestamp) return 'Just now';
  const date = timestamp.toDate();
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

article img {
  max-width: 100%;
  height: auto;
}
</style>