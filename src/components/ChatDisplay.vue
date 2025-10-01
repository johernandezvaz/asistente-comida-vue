<script setup>
defineProps({
  messages: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  }
})

function formatTime(timestamp){
  if(!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleDateString([], {hour: '2-digit', minute: '2-digit'})
}
</script>

<template>
  <div class="bg-[var(--color-surface)] rounded-[var(--radius-xl)] shadow-[var(--shadow-md)] p-6">
    <h2 class="text-2xl font-bold text-[var(--color-text)] mb-4 flex items-center gap-2">
      <span>💬</span>
      <span>Conversación</span>
    </h2>

    <div class="space-y-4 max-h-[500px] overflow-y-auto pr-2">
      <div
          v-for="message in messages"
          :key="message.id"
          class="animate-fade-in"
          :class="message.type === 'user' ? 'flex justify-end' : 'flex justify-start'"
      >
        <div
            class="max-w-[80%] rounded-[var(--radius-lg)] p-4 shadow-[var(--shadow-sm)]"
            :class="message.type === 'user'
            ? 'bg-gradient-to-r from-[var(--color-tomato)] to-[var(--color-orange)] text-white'
            : 'bg-gradient-to-r from-[var(--color-cream)] to-white text-[var(--color-text)] border border-[var(--color-border)]'"
        >
          <div class="flex items-start gap-2">
            <span class="text-2xl">{{ message.type === 'user' ? '👤' : '🤖' }}</span>
            <div class="flex-1">
              <p class="leading-relaxed">{{ message.text }}</p>
              <span class="text-xs opacity-75 mt-2 block">
                {{ formatTime(message.timestamp) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      Loading indicator
      <div v-if="isLoading" class="flex justify-start animate-fade-in">
        <div class="bg-gradient-to-r from-[var(--color-cream)] to-white rounded-[var(--radius-lg)] p-4 shadow-[var(--shadow-sm)] border border-[var(--color-border)]">
          <div class="flex items-center gap-2">
            <span class="text-2xl">🤖</span>
            <div class="flex gap-1">
              <span class="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-bounce" style="animation-delay: 0ms"></span>
              <span class="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-bounce" style="animation-delay: 150ms"></span>
              <span class="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-bounce" style="animation-delay: 300ms"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

