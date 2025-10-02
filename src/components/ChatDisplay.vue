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
  <div class="kitchen-chat-board">
    <div class="board-header">
      <h2 class="board-title">
        <span class="title-icon">💬</span>
        <span>Conversación en la Cocina</span>
      </h2>
      <div class="kitchen-decoration">
        <span>🥘</span>
      </div>
    </div>

    <div class="messages-container">
      <div
          v-for="message in messages"
          :key="message.id"
          class="message-wrapper animate-fade-in"
          :class="message.type === 'user' ? 'user-side' : 'chef-side'"
      >
        <div
            class="message-bubble"
            :class="message.type === 'user' ? 'user-message' : 'chef-message'"
        >
          <div class="message-avatar">
            {{ message.type === 'user' ? '👤' : '👨‍🍳' }}
          </div>
          <div class="message-content">
            <p class="message-text">{{ message.text }}</p>
            <span class="message-time">
              {{ formatTime(message.timestamp) }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="message-wrapper chef-side animate-fade-in">
        <div class="message-bubble chef-message cooking-message">
          <div class="message-avatar cooking-avatar">
            👨‍🍳
          </div>
          <div class="message-content">
            <div class="cooking-indicator">
              <span class="cooking-dot"></span>
              <span class="cooking-dot"></span>
              <span class="cooking-dot"></span>
            </div>
            <span class="cooking-text">Cocinando tu respuesta...</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kitchen-chat-board {
  background: linear-gradient(145deg, #FFFFFF 0%, #F8F8F8 100%);
  border-radius: 2rem;
  box-shadow:
      0 8px 24px rgba(0,0,0,0.15),
      inset 0 2px 4px rgba(255,255,255,0.9);
  border: 4px solid #E8E8E8;
  overflow: hidden;
}

.board-header {
  background: linear-gradient(135deg, #F5E6D3 0%, #E8D4B8 100%);
  padding: 1.5rem;
  border-bottom: 4px solid #8B4513;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.board-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: #2C3E50;
}

.title-icon {
  font-size: 2rem;
}

.kitchen-decoration {
  font-size: 2rem;
  animation: spin-slow 10s linear infinite;
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.messages-container {
  padding: 1.5rem;
  max-height: 500px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message-wrapper {
  display: flex;
  animation: fadeIn 0.3s ease-out;
}

.user-side {
  justify-content: flex-end;
}

.chef-side {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 80%;
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.user-message {
  background: linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%);
  border: 3px solid #E65100;
  flex-direction: row-reverse;
}

.chef-message {
  background: linear-gradient(135deg, #FFFACD 0%, #FFF8DC 100%);
  border: 3px solid #FFD700;
}

.cooking-message {
  border: 3px dashed #4CAF50;
  background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%);
}

.message-avatar {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.cooking-avatar {
  animation: chef-bounce 1s ease-in-out infinite;
}

@keyframes chef-bounce {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-5px) rotate(5deg); }
}

.message-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.message-text {
  font-size: 1rem;
  line-height: 1.6;
  font-weight: 600;
  color: #2C3E50;
}

.user-message .message-text {
  color: white;
  text-align: right;
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.7;
  font-weight: 600;
  color: #7F8C8D;
}

.user-message .message-time {
  color: rgba(255,255,255,0.9);
  text-align: right;
}

.cooking-indicator {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.cooking-dot {
  width: 12px;
  height: 12px;
  background: #4CAF50;
  border-radius: 50%;
  animation: bounce-dot 1s ease-in-out infinite;
}

.cooking-dot:nth-child(2) {
  animation-delay: 0.15s;
  background: #FF8C42;
}

.cooking-dot:nth-child(3) {
  animation-delay: 0.3s;
  background: #E74C3C;
}

@keyframes bounce-dot {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.cooking-text {
  font-size: 0.875rem;
  font-weight: bold;
  color: #2E7D32;
  font-style: italic;
}

.messages-container::-webkit-scrollbar {
  width: 8px;
}

.messages-container::-webkit-scrollbar-track {
  background: #F5E6D3;
  border-radius: 10px;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #8B4513;
  border-radius: 10px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #654321;
}
</style>

