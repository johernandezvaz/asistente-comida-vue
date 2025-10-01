<script setup>
import { ref } from 'vue'
import VoiceInput from './components/VoiceInput.vue'
import ChatDisplay from './components/ChatDisplay.vue'
import RecipeCard from './components/RecipeCard.vue'
import { searchRecipes, saveRecipe } from './services/api'
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
  // Transcript is being updated in real-time
  console.log('[v0] Transcript updated:', transcript)
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
    // Check if user wants to search for recipes
    const searchKeywords = ['receta', 'cocinar', 'preparar', 'hacer', 'ingredientes', 'comida', 'plato']
    const shouldSearchRecipes = searchKeywords.some(keyword => message.toLowerCase().includes(keyword))

    if (shouldSearchRecipes) {
      // Search recipes using Spoonacular
      const recipeResults = await searchRecipes(message)
      recipes.value = recipeResults

      // Generate AI response about the recipes
      const aiResponse = await generateAIResponse(message, recipeResults)

      messages.value.push({
        id: Date.now() + 1,
        type: 'bot',
        text: aiResponse,
        timestamp: new Date()
      })
    } else {
      // Just get AI response
      const aiResponse = await generateAIResponse(message)

      messages.value.push({
        id: Date.now() + 1,
        type: 'bot',
        text: aiResponse,
        timestamp: new Date()
      })
    }
  } catch (error) {
    console.error('[v0] Error processing message:', error)
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

const handleSaveRecipe = async (recipe) => {
  try {
    await saveRecipe(recipe)

    messages.value.push({
      id: Date.now(),
      type: 'bot',
      text: `✅ ¡Receta "${recipe.title}" guardada exitosamente!`,
      timestamp: new Date()
    })
  } catch (error) {
    console.error('[v0] Error saving recipe:', error)
    messages.value.push({
      id: Date.now(),
      type: 'bot',
      text: '❌ Hubo un error al guardar la receta. Por favor, intenta de nuevo.',
      timestamp: new Date()
    })
  }
}
</script>

<template>
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
