<template>
  <div class="max-w-6xl mx-auto space-y-8">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Approval Queue</h2>
      <span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-bold">
        {{ pendingItems.length }} Items Pending
      </span>
    </div>

    <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-900/50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="item in pendingItems" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-900/30">
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="capitalize text-xs font-bold px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                {{ item.type }}
              </span>
            </td>
            <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">{{ item.title }}</td>
            <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{{ item.authorName }}</td>
            <td class="px-6 py-4 text-right space-x-3">
              <button @click="approve(item)" class="text-green-600 hover:text-green-500 font-bold text-sm">Approve</button>
              <button @click="rejectItem(item)" class="text-red-600 hover:text-red-500 font-bold text-sm">Reject</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="pendingItems.length === 0" class="p-12 text-center text-gray-500">
        The queue is currently empty. Good work!
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { db } from '../../firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';

const pendingItems = ref([]);

const fetchQueue = async () => {
  const collections = ['articles', 'artworks', 'videos'];
  let allPending = [];

  for (const colName of collections) {
    const q = query(collection(db, colName), where('status', '==', 'Pending'));
    const snap = await getDocs(q);
    snap.forEach(doc => allPending.push({ id: doc.id, collection: colName, ...doc.data() }));
  }
  pendingItems.value = allPending;
};

const approve = async (item) => {
  try {
    // 1. Update status
    await updateDoc(doc(db, item.collection, item.id), { status: 'Approved' });
    
    // 2. Log Activity
    await addDoc(collection(db, 'activities'), {
      userName: 'Admin', // Or fetch admin's nickname
      actionType: 'approved the submission',
      contentType: item.type,
      contentTitle: item.title,
      timestamp: serverTimestamp()
    });

    pendingItems.value = pendingItems.value.filter(i => i.id !== item.id);
    alert(`${item.title} is now live!`);
  } catch (e) {
    console.error(e);
  }
};

const rejectItem = async (item) => {
  if (item.type === 'article') {
    const reason = prompt(`Why are you rejecting "${item.title}"? (This will be shown to the author)`);
    if (reason === null) return; // User cancelled

    try {
      await updateDoc(doc(db, 'articles', item.id), {
        status: 'Rejected',
        rejectionReason: reason,
        lastEditedAt: serverTimestamp()
      });

      // Log the rejection so it shows on the dashboard feed
      await addDoc(collection(db, 'activities'), {
        userName: 'Admin',
        actionType: 'requested changes on',
        contentType: 'article',
        contentTitle: item.title,
        timestamp: serverTimestamp()
      });

      pendingItems.value = pendingItems.value.filter(i => i.id !== item.id);
    } catch (e) {
      console.error("Rejection error:", e);
    }
  } else {
    // Media (Art/Video) remains "Delete on Rejection" as requested
    if (confirm(`Rejecting media will permanently delete it. Continue?`)) {
      await deleteDoc(doc(db, item.collection, item.id));
      pendingItems.value = pendingItems.value.filter(i => i.id !== item.id);
    }
  }
};

onMounted(fetchQueue);
</script>