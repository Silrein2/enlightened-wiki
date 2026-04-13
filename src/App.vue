<template>
  <div id="app" class="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
    
    <router-view />

    <div class="fixed bottom-4 left-4 z-50 pointer-events-none select-none">
      <span class="text-[10px] font-mono font-bold tracking-widest text-gray-400/60 dark:text-gray-600/50 uppercase">
        Enlightened Wiki v1.0.2-P2-silrein
      </span>
    </div>

  </div>
</template>

<script setup>
// We don't need any script logic here right now
</script>

<style>
/* If you are using Tailwind CSS, you likely don't need scoped styles here.
   Make sure your Tailwind directives (@tailwind base; etc.) are in your src/style.css */
</style>