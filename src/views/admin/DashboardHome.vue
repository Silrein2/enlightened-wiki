<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white">
        Welcome, {{ userProfile?.nickname || 'Creator' }}
      </h1>
      <p class="text-gray-500 dark:text-gray-400 mt-1">Here is the latest from the Enlightened Guild wiki.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <div class="lg:col-span-2 space-y-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Recent Activity
        </h2>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
          <div v-if="isLoading" class="p-8 text-center">
            <div class="animate-spin inline-block w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
          </div>
          
          <div v-else-if="activities.length === 0" class="p-8 text-center text-gray-500">
            No recent activity recorded yet.
          </div>

          <div v-for="act in activities" :key="act.id" class="p-4 flex items-start gap-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
            <div class="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
              <svg v-if="act.contentType === 'article'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              <svg v-else-if="act.contentType === 'artwork'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
            </div>
            <div>
              <p class="text-sm text-gray-900 dark:text-white font-medium">
                <span class="text-indigo-600 dark:text-indigo-400">{{ act.userName }}</span> 
                {{ act.actionType }} 
                <span class="italic">"{{ act.contentTitle }}"</span>
              </p>
              <p class="text-xs text-gray-500 mt-1">{{ formatRelativeTime(act.timestamp) }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Your Stats</h2>
        
        <div class="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200 dark:shadow-none">
          <p class="text-indigo-100 text-sm font-medium">Total Contributions</p>
          <p class="text-4xl font-black mt-2">{{ myTotalCount }}</p>
          
          <div class="mt-6 pt-6 border-t border-indigo-500 flex justify-between">
            <div class="text-center">
              <p class="text-xs text-indigo-200">Articles</p>
              <p class="font-bold">{{ myStats.articles }}</p>
            </div>
            <div class="text-center">
              <p class="text-xs text-indigo-200">Artworks</p>
              <p class="font-bold">{{ myStats.artworks }}</p>
            </div>
            <div class="text-center">
              <p class="text-xs text-indigo-200">Videos</p>
              <p class="font-bold">{{ myStats.videos }}</p>
            </div>
          </div>
        </div>

        <div class="mt-8">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Your Recent Submissions</h2>
            <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-900/50 text-left text-xs font-medium text-gray-500 uppercase">
                    <tr>
                    <th class="px-6 py-3">Title</th>
                    <th class="px-6 py-3">Type</th>
                    <th class="px-6 py-3">Status</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-for="item in myRecentItems" :key="item.id" class="text-sm">
                        <td class="px-6 py-4">
                            <div class="font-medium text-gray-900 dark:text-white">{{ item.title }}</div>
                            <div v-if="item.status === 'Rejected' && item.rejectionReason" class="text-xs text-red-500 mt-1 italic">
                            Reason: {{ item.rejectionReason }}
                            </div>
                        </td>
                        <td class="px-6 py-4 text-gray-500 dark:text-gray-400 capitalize">{{ item.type }}</td>
                        <td class="px-6 py-4">
                            <div class="flex items-center gap-3">
                            <span :class="[
                                'px-2.5 py-0.5 rounded-full text-xs font-bold',
                                item.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                                item.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                            ]">
                                {{ item.status }}
                            </span>

                            <router-link 
                                v-if="item.status === 'Rejected' && item.type === 'article'" 
                                :to="`/dashboard/edit/${item.id}`"
                                class="text-indigo-600 hover:text-indigo-500 font-bold text-xs underline"
                            >
                                Fix & Resubmit
                            </router-link>
                            </div>
                        </td>
                    </tr>
                </tbody>
                </table>
                <div v-if="myRecentItems.length === 0" class="p-8 text-center text-gray-500">
                No submissions found. Start creating!
                </div>
            </div>
            </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-4">Quick Shortcuts</h3>
          <div class="space-y-2">
            <router-link to="/dashboard/create" class="block w-full text-center py-2 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-indigo-600 hover:text-white rounded-lg text-sm font-bold transition-colors">
              + New Article
            </router-link>
            <router-link to="/dashboard/profile" class="block w-full text-center py-2 px-4 border border-gray-200 dark:border-gray-700 hover:border-indigo-500 rounded-lg text-sm font-medium transition-colors">
              Update Profile
            </router-link>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { db, auth } from '../../firebase';
import { collection, query, orderBy, limit, getDocs, where, doc, getDoc } from 'firebase/firestore';

const userProfile = ref(null);
const activities = ref([]);
const isLoading = ref(true);
const myStats = ref({ articles: 0, artworks: 0, videos: 0 });
const myTotalCount = ref(0);

const myRecentItems = ref([]);

onMounted(async () => {
  const user = auth.currentUser;
  if (!user) return;

  // 1. Fetch User Profile
  const profileSnap = await getDoc(doc(db, 'users', user.uid));
  if (profileSnap.exists()) userProfile.value = profileSnap.data();

  // 2. Fetch Global Activity Feed (Last 10 items)
  try {
    const actQ = query(collection(db, 'activities'), orderBy('timestamp', 'desc'), limit(10));
    const actSnap = await getDocs(actQ);
    activities.value = actSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) { console.error("Activity Error:", e); }

  // 3. Fetch "Your Contributions" Counts
  // We run these queries to count how many items belong to the current user
  const countItems = async (col) => {
    const q = query(collection(db, col), where('authorId', '==', user.uid));
    const snap = await getDocs(q);
    return snap.size;
  };

  myStats.value.articles = await countItems('articles');
  myStats.value.artworks = await countItems('artworks');
  myStats.value.videos = await countItems('videos');
  myTotalCount.value = myStats.value.articles + myStats.value.artworks + myStats.value.videos;

  const fetchMyItems = async () => {
    const collections = ['articles', 'artworks', 'videos'];
    let items = [];
    for (const col of collections) {
        const q = query(collection(db, col), where('authorId', '==', user.uid), orderBy('createdAt', 'desc'), limit(5));
        const snap = await getDocs(q);
        snap.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
    }
    // Sort the combined list by date
    myRecentItems.value = items.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis()).slice(0, 5);
    };
    await fetchMyItems();

  isLoading.value = false;
});

// Helper for human-readable time (e.g., "5 minutes ago")
const formatRelativeTime = (timestamp) => {
  if (!timestamp) return 'Just now';
  const seconds = Math.floor((new Date() - timestamp.toDate()) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return "Just now";
};
</script>