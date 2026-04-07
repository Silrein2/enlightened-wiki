<template>
  <div class="max-w-6xl mx-auto space-y-10">
    <section class="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Invite New Creators</h2>
      <div class="flex gap-4">
        <button @click="generateToken" :disabled="isGenerating" class="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50">
          Generate Invite Token
        </button>
        <div v-if="latestToken" class="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg border border-indigo-500">
          <span class="font-mono font-bold text-indigo-600 dark:text-indigo-400">{{ latestToken }}</span>
          <p class="text-xs text-gray-500 ml-2">(One-time use)</p>
        </div>
      </div>
    </section>

    <section>
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Member Directory</h2>
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nickname</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="user in userList" :key="user.id">
              <td class="px-6 py-4 text-gray-900 dark:text-white font-medium">{{ user.nickname }}</td>
              <td class="px-6 py-4">
                <span :class="['px-2 py-1 rounded text-xs font-bold', user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800']">
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button v-if="user.role !== 'admin'" @click="promoteUser(user)" class="text-indigo-600 hover:underline text-sm font-bold">Promote to Admin</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { db } from '../../firebase';
import { collection, getDocs, addDoc, doc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const latestToken = ref('');
const isGenerating = ref(false);
const userList = ref([]);

const generateToken = async () => {
  isGenerating.value = true;
  // Create a random 6-character code
  const token = Math.random().toString(36).substring(2, 8).toUpperCase();
  try {
    await setDoc(doc(db, 'invites', token), { createdAt: serverTimestamp() });
    latestToken.value = token;
  } catch (e) { console.error(e); }
  finally { isGenerating.value = false; }
};

const fetchUsers = async () => {
  const snap = await getDocs(collection(db, 'users'));
  userList.value = snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

const promoteUser = async (user) => {
  if (confirm(`Promote ${user.nickname} to Admin? This cannot be undone.`)) {
    await updateDoc(doc(db, 'users', user.id), { role: 'admin' });
    user.role = 'admin';
  }
};

onMounted(fetchUsers);
</script>