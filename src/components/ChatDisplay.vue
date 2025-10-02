<script setup>
import { marked } from 'marked'
import { computed } from 'vue'

const props = defineProps({
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
  return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
}

function renderMarkdown(text) {
  return marked(text, { breaks: true })
}
</script>

<template>
  <div class="chat-container">
    <div class="chat-header">
      <h2 class="chat-title">
        <span class="title-icon">💬</span>
        Conversación
      </h2>
    </div>

    <div class="messages-area">
      <div
          v-for="message in messages"
          :key="message.id"
          class="message-wrapper animate-fade-in"
          :class="message.type === 'user' ? 'user-message-wrapper' : 'bot-message-wrapper'"
      >
        <div class="message-bubble" :class="message.type === 'user' ? 'user-bubble' : 'bot-bubble'">
          <div class="message-avatar">
            {{ message.type === 'user' ? '👤' : '👨‍🍳' }}
          </div>
          <div class="message-body">
            <div
                v-if="message.type === 'bot'"
                class="message-text markdown-content"
                v-html="renderMarkdown(message.text)"
            ></div>
            <p v-else class="message-text">{{ message.text }}</p>
            <span class="message-timestamp">
              {{ formatTime(message.timestamp) }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="message-wrapper bot-message-wrapper animate-fade-in">
        <div class="message-bubble bot-bubble loading-bubble">
          <div class="message-avatar">
            👨‍🍳
          </div>
          <div class="message-body">
            <div class="loading-dots">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
            <span class="loading-text">Pensando...</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  background: white;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border);
}

.chat-header {
  background: linear-gradient(135deg, #FAFAFA 0%, #F5F5F5 100%);
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.chat-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.title-icon {
  font-size: 1.5rem;
}

.messages-area {
  padding: 1.5rem;
  max-height: 500px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  background: linear-gradient(135deg, #FAFAFA 0%, #FFFFFF 100%);
}

.message-wrapper {
  display: flex;
  animation: fadeIn 0.3s ease-out;
}

.user-message-wrapper {
  justify-content: flex-end;
}

.bot-message-wrapper {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 75%;
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.user-bubble {
  background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%);
  border: 1px solid #FF8C42;
  flex-direction: row-reverse;
  color: white;
}

.bot-bubble {
  background: white;
  border: 1px solid var(--color-border);
}

.loading-bubble {
  border: 1px dashed #4CAF50;
  background: linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 100%);
}

.message-avatar {
  font-size: 2rem;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.message-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.message-text {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--color-text);
}

.user-bubble .message-text {
  color: white;
}

.message-timestamp {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  font-weight: 500;
}

.user-bubble .message-timestamp {
  color: rgba(255, 255, 255, 0.8);
  text-align: right;
}

.loading-dots {
  display: flex;
  gap: 0.375rem;
  align-items: center;
}

.dot {
  width: 8px;
  height: 8px;
  background: #4CAF50;
  border-radius: 50%;
  animation: bounce-dot 1.4s ease-in-out infinite;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
  background: #FF8C42;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
  background: #FF6B35;
}

@keyframes bounce-dot {
  0%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-8px);
  }
}

.loading-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: #2E7D32;
  font-style: italic;
}

.messages-area::-webkit-scrollbar {
  width: 6px;
}

.messages-area::-webkit-scrollbar-track {
  background: #F5F5F5;
}

.messages-area::-webkit-scrollbar-thumb {
  background: #BDBDBD;
  border-radius: 3px;
}

.messages-area::-webkit-scrollbar-thumb:hover {
  background: #9E9E9E;
}

.markdown-content {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--color-text);
}

.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3) {
  font-weight: 700;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  color: var(--color-text);
}

.markdown-content :deep(h1) {
  font-size: 1.5rem;
}

.markdown-content :deep(h2) {
  font-size: 1.25rem;
}

.markdown-content :deep(h3) {
  font-size: 1.1rem;
}

.markdown-content :deep(p) {
  margin-bottom: 0.75rem;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin-left: 1.5rem;
  margin-bottom: 0.75rem;
}

.markdown-content :deep(li) {
  margin-bottom: 0.25rem;
}

.markdown-content :deep(code) {
  background: rgba(0, 0, 0, 0.05);
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.875em;
}

.markdown-content :deep(pre) {
  background: rgba(0, 0, 0, 0.05);
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin-bottom: 0.75rem;
}

.markdown-content :deep(pre code) {
  background: none;
  padding: 0;
}

.markdown-content :deep(strong) {
  font-weight: 700;
}

.markdown-content :deep(em) {
  font-style: italic;
}

.markdown-content :deep(a) {
  color: #FF6B35;
  text-decoration: underline;
}

.markdown-content :deep(blockquote) {
  border-left: 3px solid #FF6B35;
  padding-left: 1rem;
  margin-left: 0;
  margin-bottom: 0.75rem;
  font-style: italic;
  color: var(--color-text-muted);
}
</style>
