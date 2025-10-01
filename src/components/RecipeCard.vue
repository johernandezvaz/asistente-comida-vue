<script setup>
defineProps({
  recipe: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="bg-[var(--color-surface)] rounded-[var(--radius-xl)] shadow-[var(--shadow-md)] overflow-hidden hover:shadow-[var(--shadow-lg)] transition-all duration-300 hover:-translate-y-1">
    Recipe Image
    <div class="relative h-48 overflow-hidden bg-gradient-to-br from-[var(--color-orange)] to-[var(--color-tomato)]">
      <img
          v-if="recipe.image"
          :src="recipe.image"
          :alt="recipe.title"
          class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-6xl">
        🍽️
      </div>

      Ready time badge
      <div
          v-if="recipe.readyInMinutes"
          class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-[var(--color-text)] flex items-center gap-1"
      >
        <span>⏱️</span>
        <span>{{ recipe.readyInMinutes }} min</span>
      </div>
    </div>

    Recipe Content
    <div class="p-4">
      <h3 class="text-lg font-bold text-[var(--color-text)] mb-2 line-clamp-2">
        {{ recipe.title }}
      </h3>

      Recipe Stats
      <div class="flex items-center gap-4 mb-3 text-sm text-[var(--color-text-muted)]">
        <div v-if="recipe.servings" class="flex items-center gap-1">
          <span>👥</span>
          <span>{{ recipe.servings }} porciones</span>
        </div>
        <div v-if="recipe.healthScore" class="flex items-center gap-1">
          <span>💚</span>
          <span>{{ recipe.healthScore }}/100</span>
        </div>
      </div>

      Ingredients Preview
      <div v-if="recipe.usedIngredients && recipe.usedIngredients.length > 0" class="mb-4">
        <p class="text-sm font-semibold text-[var(--color-text)] mb-2">Ingredientes:</p>
        <div class="flex flex-wrap gap-2">
          <span
              v-for="(ingredient, index) in recipe.usedIngredients.slice(0, 3)"
              :key="index"
              class="text-xs bg-[var(--color-cream)] text-[var(--color-text)] px-2 py-1 rounded-full"
          >
            {{ ingredient.name }}
          </span>
          <span
              v-if="recipe.usedIngredients.length > 3"
              class="text-xs bg-[var(--color-cream)] text-[var(--color-text-muted)] px-2 py-1 rounded-full"
          >
            +{{ recipe.usedIngredients.length - 3 }} más
          </span>
        </div>
      </div>

      Action Buttons
      <div class="flex gap-2">
        <button
            @click="$emit('save', recipe)"
            class="flex-1 bg-gradient-to-r from-[var(--color-avocado)] to-[var(--color-avocado-dark)] text-white px-4 py-2 rounded-[var(--radius-lg)] font-semibold hover:shadow-[var(--shadow-md)] transition-all flex items-center justify-center gap-2"
        >
          <span>💾</span>
          <span>Guardar</span>
        </button>
        <a
            v-if="recipe.sourceUrl"
            :href="recipe.sourceUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="flex-1 bg-gradient-to-r from-[var(--color-orange)] to-[var(--color-orange-light)] text-white px-4 py-2 rounded-[var(--radius-lg)] font-semibold hover:shadow-[var(--shadow-md)] transition-all flex items-center justify-center gap-2"
        >
          <span>📖</span>
          <span>Ver Receta</span>
        </a>
      </div>
    </div>
  </div>
</template>

