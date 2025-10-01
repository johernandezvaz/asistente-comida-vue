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
  <div class="min-h-screen bg-[var(--color-background)] flex flex-col">
    Header
    <header class="bg-[var(--color-surface)] shadow-[var(--shadow-sm)] sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-gradient-to-br from-[var(--color-tomato)] to-[var(--color-orange)] rounded-2xl flex items-center justify-center text-2xl">
            🍽️
          </div>
          <div>
            <h1 class="text-xl font-bold text-[var(--color-text)]">Chef Virtual</h1>
            <p class="text-xs text-[var(--color-text-muted)]">Tu asistente de cocina</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-[var(--color-text-muted)] hidden sm:inline">Habla y descubre recetas</span>
          <div class="w-2 h-2 bg-[var(--color-avocado)] rounded-full animate-pulse"></div>
        </div>
      </div>
    </header>

    Main Content
    <main class="flex-1 max-w-6xl w-full mx-auto px-4 py-6 flex flex-col gap-6">
      Voice Input Component
      <VoiceInput
          @transcript="handleTranscript"
          @send-message="handleSendMessage"
      />

      Chat Display Component
      <ChatDisplay
          :messages="messages"
          :is-loading="isLoading"
      />

      Recipe Results
      <div v-if="recipes.length > 0" class="space-y-4">
        <h2 class="text-2xl font-bold text-[var(--color-text)] flex items-center gap-2">
          <span>🍳</span>
          <span>Recetas Encontradas</span>
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <RecipeCard
              v-for="recipe in recipes"
              :key="recipe.id"
              :recipe="recipe"
          />
        </div>
      </div>
    </main>

    Footer
    <footer class="bg-[var(--color-surface)] border-t border-[var(--color-border)] py-4 mt-auto">
      <div class="max-w-6xl mx-auto px-4 text-center text-sm text-[var(--color-text-muted)]">
        <p>Asistente de Comida con IA • Powered by Gemini & Spoonacular</p>
      </div>
    </footer>
  </div>
</template>

