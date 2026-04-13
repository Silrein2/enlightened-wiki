<template>
  <div class="max-w-2xl mx-auto px-4 py-12 sm:px-6 lg:px-8 min-h-[60vh] flex flex-col justify-center">
    
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div class="px-6 py-8 sm:p-10">
        
        <div class="text-center mb-8">
          <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Send Feedback</h2>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Found a bug? Have an idea? Let the developer know! All submissions are completely anonymous.
          </p>
        </div>

        <form @submit.prevent="submitFeedback" class="space-y-6">
          
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Category</label>
            <div class="grid grid-cols-2 gap-4">
              <label 
                :class="[
                  'relative border rounded-lg p-4 flex cursor-pointer focus:outline-none transition-colors',
                  feedbackType === 'Suggestion' ? 'bg-indigo-50 border-indigo-500 dark:bg-indigo-900/30 dark:border-indigo-500' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                ]"
              >
                <input type="radio" v-model="feedbackType" value="Suggestion" class="sr-only">
                <div class="flex flex-col">
                  <span class="block text-sm font-bold" :class="feedbackType === 'Suggestion' ? 'text-indigo-900 dark:text-indigo-300' : 'text-gray-900 dark:text-white'">💡 Suggestion</span>
                </div>
              </label>

              <label 
                :class="[
                  'relative border rounded-lg p-4 flex cursor-pointer focus:outline-none transition-colors',
                  feedbackType === 'Bug Report' ? 'bg-red-50 border-red-500 dark:bg-red-900/30 dark:border-red-500' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                ]"
              >
                <input type="radio" v-model="feedbackType" value="Bug Report" class="sr-only">
                <div class="flex flex-col">
                  <span class="block text-sm font-bold" :class="feedbackType === 'Bug Report' ? 'text-red-900 dark:text-red-300' : 'text-gray-900 dark:text-white'">🐛 Bug Report</span>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label for="message" class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Your Message</label>
            <textarea 
              id="message" 
              v-model="message" 
              rows="5" 
              required 
              placeholder="Describe the bug or explain your idea in detail..."
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            ></textarea>
          </div>

          <div v-if="submitStatus" :class="{'text-green-600 dark:text-green-400': isSuccess, 'text-red-600 dark:text-red-400': !isSuccess}" class="text-sm font-bold text-center bg-gray-50 dark:bg-gray-900/50 p-3 rounded-md">
            {{ submitStatus }}
          </div>

          <button 
            type="submit" 
            :disabled="isSubmitting || !message.trim()"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-gray-900 hover:bg-black focus:outline-none disabled:opacity-50 transition-colors dark:bg-indigo-600 dark:hover:bg-indigo-700"
          >
            {{ isSubmitting ? 'Sending to Developer...' : 'Submit Feedback' }}
          </button>
        </form>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { db } from '../firebase'; // Adjust this path to your firebase config
import { doc, getDoc } from 'firebase/firestore';

const feedbackType = ref('Suggestion');
const message = ref('');
const isSubmitting = ref(false);
const submitStatus = ref('');
const isSuccess = ref(false);

const submitFeedback = async () => {
  if (!message.value.trim()) return;
  
  isSubmitting.value = true;
  submitStatus.value = '';
  isSuccess.value = false;

  try {
    // 1. Fetch Webhook URL securely from Firestore
    let webhookUrl = 'https://discord.com/api/webhooks/YOUR_DEFAULT_FALLBACK'; // Safety fallback
    
    const settingsSnap = await getDoc(doc(db, 'settings', 'guild'));
    if (settingsSnap.exists() && settingsSnap.data().feedbackWebhook) {
      webhookUrl = settingsSnap.data().feedbackWebhook;
    }

    // 2. Build Discord Payload
    // Suggestion = Blue (3447003), Bug = Red (15158332)
    const embedColor = feedbackType.value === 'Suggestion' ? 3447003 : 15158332;
    const emoji = feedbackType.value === 'Suggestion' ? '💡' : '🐛';

    const discordPayload = {
      username: "Feedback Bot",
      embeds: [{
        title: `${emoji} New ${feedbackType.value}`,
        description: message.value,
        color: embedColor,
        timestamp: new Date().toISOString()
      }]
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordPayload)
    });

    if (!response.ok) throw new Error('Discord rejected the payload.');

    // Success state
    isSuccess.value = true;
    submitStatus.value = "Thank you! Your feedback has been sent directly to the developer.";
    
    // Reset form
    message.value = '';
    setTimeout(() => { submitStatus.value = ''; }, 5000);

  } catch (error) {
    console.error("Feedback error:", error);
    isSuccess.value = false;
    submitStatus.value = "Oops! Something went wrong. The webhook might not be configured correctly.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>