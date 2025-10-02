<script setup>
import { ref } from 'vue'
import VoiceInput from './components/VoiceInput.vue'
import ChatDisplay from './components/ChatDisplay.vue'
import RecipeCard from './components/RecipeCard.vue'
import { searchRecipes } from './services/api'
import { generateAIResponse } from './services/gemini'

const messages = ref([
  {
    id: 1,
    type: 'bot',
    text: '¡Hola! 👋 Soy tu asistente de cocina virtual. Puedes hablarme para buscar recetas, obtener ideas de comida o guardar tus favoritas. ¿Qué te gustaría cocinar hoy?',
    timestamp: new Date()
  }
])

const recipes = ref([])
const isLoading = ref(false)

const handleTranscript = (transcript) => {
  console.log('Transcript updated:', transcript)
}

const handleSendMessage = async (message) => {
  if (!message.trim()) return

  // Add user message
  messages.value.push({
    id: Date.now(),
    type: 'user',
    text: message,
    timestamp: new Date()
  })

  isLoading.value = true

  try {
    // Verificar si el usuaroi quiere ver recetas
    const searchKeywords = ['receta', 'cocinar', 'preparar', 'hacer', 'ingredientes', 'comida', 'plato']
    const shouldSearchRecipes = searchKeywords.some(keyword => message.toLowerCase().includes(keyword))

    if (shouldSearchRecipes) {
      // Buscar recetas
      const recipeResults = await searchRecipes(message)
      recipes.value = recipeResults

      // Generar respuestas de las recetas
      const aiResponse = await generateAIResponse(message, recipeResults)

      messages.value.push({
        id: Date.now() + 1,
        type: 'bot',
        text: aiResponse,
        timestamp: new Date()
      })
    } else {
      // Obtener la respuesta de la IA
      const aiResponse = await generateAIResponse(message)

      messages.value.push({
        id: Date.now() + 1,
        type: 'bot',
        text: aiResponse,
        timestamp: new Date()
      })
    }
  } catch (error) {
    console.error('Error processing message:', error)
    messages.value.push({
      id: Date.now() + 1,
      type: 'bot',
      text: 'Lo siento, tuve un problema procesando tu solicitud. Por favor, intenta de nuevo.',
      timestamp: new Date()
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col relative">
    <header class="kitchen-header sticky top-0 z-50">
      <div class="kitchen-shelf">
        <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between relative z-10">
          <div class="flex items-center gap-3">
            <div class="chef-hat-logo">
              <div class="hat-top">👨‍🍳</div>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-[var(--color-dark)] kitchen-title">La Cocina del Chef</h1>
              <p class="text-sm text-[var(--color-text-muted)] font-semibold">Tu asistente culinario virtual</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="kitchen-utensils hidden sm:flex gap-2 text-2xl">
              <span class="utensil">🥄</span>
              <span class="utensil">🍴</span>
              <span class="utensil">🔪</span>
            </div>
            <div class="stove-indicator">
              <div class="flame"></div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="flex-1 max-w-6xl w-full mx-auto px-4 py-6 flex flex-col gap-6 relative z-10">
      <VoiceInput
          @transcript="handleTranscript"
          @send-message="handleSendMessage"
      />

      <ChatDisplay
          :messages="messages"
          :is-loading="isLoading"
      />

      <div v-if="recipes.length > 0" class="space-y-4">
        <div class="recipe-board-header">
          <h2 class="text-3xl font-bold text-[var(--color-dark)] flex items-center gap-3">
            <span class="text-4xl">🍳</span>
            <span>Recetas Deliciosas</span>
          </h2>
          <div class="recipe-decorations">
            <span>🧄</span>
            <span>🌶️</span>
            <span>🧅</span>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RecipeCard
              v-for="recipe in recipes"
              :key="recipe.id"
              :recipe="recipe"
          />
        </div>
      </div>
    </main>

    <footer class="kitchen-footer mt-auto relative z-10">
      <div class="cutting-board-footer">
        <div class="max-w-6xl mx-auto px-4 py-4 text-center">
          <p class="text-sm font-bold text-[var(--color-dark)]">🍽️ Cocinado con amor por tu Chef Virtual 🍽️</p>
          <p class="text-xs text-[var(--color-text-muted)] mt-1">Powered by Gemini & Spoonacular</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.kitchen-header {
  background: linear-gradient(180deg, #8B4513 0%, #A0522D 100%);
  box-shadow: 0 4px 12px rgba(139, 69, 19, 0.4);
}

.kitchen-shelf {
  position: relative;
  background: linear-gradient(180deg, #A0522D 0%, #8B4513 100%);
  border-bottom: 4px solid #654321;
}

.kitchen-shelf::before {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  right: 0;
  height: 8px;
  background: repeating-linear-gradient(90deg, #654321 0px, #654321 20px, transparent 20px, transparent 40px);
}

.chef-hat-logo {
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  border: 3px solid #E74C3C;
  position: relative;
  animation: bounce-gentle 3s ease-in-out infinite;
}

.hat-top {
  font-size: 2rem;
  animation: rotate-hat 4s ease-in-out infinite;
}

@keyframes bounce-gentle {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}

@keyframes rotate-hat {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
}

.kitchen-title {
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
  color: #FFF9E6;
}

.kitchen-utensils .utensil {
  display: inline-block;
  animation: swing 2s ease-in-out infinite;
  transform-origin: top center;
}

.kitchen-utensils .utensil:nth-child(2) {
  animation-delay: 0.3s;
}

.kitchen-utensils .utensil:nth-child(3) {
  animation-delay: 0.6s;
}

@keyframes swing {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(10deg); }
  75% { transform: rotate(-10deg); }
}

.stove-indicator {
  width: 50px;
  height: 50px;
  background: radial-gradient(circle, #2C3E50 0%, #1a252f 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 2px 8px rgba(0,0,0,0.5);
  border: 3px solid #34495e;
}

.flame {
  width: 20px;
  height: 25px;
  background: linear-gradient(to top, #FFD23F 0%, #FF6B35 50%, #FF4500 100%);
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  animation: flicker 1.5s ease-in-out infinite;
  box-shadow: 0 0 10px #FFD23F, 0 0 20px #FF6B35;
}

@keyframes flicker {
  0%, 100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
  25% {
    transform: scale(1.1) translateY(-2px);
    opacity: 0.9;
  }
  50% {
    transform: scale(0.95) translateY(1px);
    opacity: 0.95;
  }
  75% {
    transform: scale(1.05) translateY(-1px);
    opacity: 0.92;
  }
}

.recipe-board-header {
  background: linear-gradient(135deg, #F5E6D3 0%, #E8D4B8 100%);
  padding: 1.5rem;
  border-radius: 1rem;
  border: 4px solid #8B4513;
  box-shadow: 0 6px 16px rgba(139, 69, 19, 0.3);
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.recipe-board-header::before {
  content: '🔪';
  position: absolute;
  top: -15px;
  left: 20px;
  font-size: 2rem;
  transform: rotate(-45deg);
}

.recipe-decorations {
  display: flex;
  gap: 0.5rem;
  font-size: 1.5rem;
}

.recipe-decorations span {
  animation: float 3s ease-in-out infinite;
}

.recipe-decorations span:nth-child(2) {
  animation-delay: 0.5s;
}

.recipe-decorations span:nth-child(3) {
  animation-delay: 1s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.kitchen-footer {
  background: linear-gradient(180deg, #8B4513 0%, #654321 100%);
  border-top: 4px solid #A0522D;
}

.cutting-board-footer {
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #8B4513 100%);
  position: relative;
}

.cutting-board-footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
      repeating-linear-gradient(90deg, rgba(101, 67, 33, 0.3) 0px, transparent 2px, transparent 4px, rgba(101, 67, 33, 0.3) 6px);
  pointer-events: none;
}
</style>