<script setup>
defineProps({
  recipe: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="recipe-cookbook-card">
    <div class="recipe-image-plate">
      <img
          v-if="recipe.image"
          :src="recipe.image"
          :alt="recipe.title"
          class="plate-image"
      />
      <div v-else class="plate-empty">
        🍽️
      </div>

      <div
          v-if="recipe.readyInMinutes"
          class="timer-badge"
      >
        <span class="timer-icon">⏱️</span>
        <span class="timer-text">{{ recipe.readyInMinutes }} min</span>
      </div>

      <div class="recipe-steam">
        <span class="steam">💨</span>
      </div>
    </div>

    <div class="recipe-content-page">
      <h3 class="recipe-title">
        {{ recipe.title }}
      </h3>

      <div class="recipe-stats-shelf">
        <div v-if="recipe.servings" class="stat-jar">
          <span class="jar-icon">👥</span>
          <span class="jar-label">{{ recipe.servings }} porciones</span>
        </div>
        <div v-if="recipe.healthScore" class="stat-jar health-jar">
          <span class="jar-icon">💚</span>
          <span class="jar-label">{{ recipe.healthScore }}/100</span>
        </div>
      </div>

      <div v-if="recipe.usedIngredients && recipe.usedIngredients.length > 0" class="ingredients-basket">
        <p class="basket-label">🧺 Ingredientes:</p>
        <div class="ingredient-tags">
          <span
              v-for="(ingredient, index) in recipe.usedIngredients.slice(0, 3)"
              :key="index"
              class="ingredient-tag"
          >
            {{ ingredient.name }}
          </span>
          <span
              v-if="recipe.usedIngredients.length > 3"
              class="ingredient-tag more-tag"
          >
            +{{ recipe.usedIngredients.length - 3 }} más
          </span>
        </div>
      </div>

      <div class="recipe-action-buttons">
        <button
            @click="$emit('save', recipe)"
            class="action-btn save-btn"
        >
          <span class="btn-icon">💾</span>
          <span class="btn-label">Guardar</span>
        </button>
        <a
            v-if="recipe.sourceUrl"
            :href="recipe.sourceUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="action-btn view-btn"
        >
          <span class="btn-icon">📖</span>
          <span class="btn-label">Ver Receta</span>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recipe-cookbook-card {
  background: linear-gradient(145deg, #FFFFFF 0%, #FFFBF5 100%);
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow:
      0 8px 24px rgba(0,0,0,0.15),
      0 0 0 4px #8B4513;
  transition: all 0.3s ease;
  position: relative;
}

.recipe-cookbook-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 8px;
  background: repeating-linear-gradient(
      90deg,
      #654321 0px,
      #654321 10px,
      #8B4513 10px,
      #8B4513 20px
  );
}

.recipe-cookbook-card:hover {
  transform: translateY(-8px) rotate(-1deg);
  box-shadow:
      0 12px 32px rgba(0,0,0,0.25),
      0 0 0 4px #654321;
}

.recipe-image-plate {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, #F5E6D3 0%, #E8D4B8 100%);
  border-bottom: 4px solid #8B4513;
}

.plate-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.recipe-cookbook-card:hover .plate-image {
  transform: scale(1.1);
}

.plate-empty {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 5rem;
}

.timer-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #FFD23F 0%, #FFA94D 100%);
  border: 3px solid #FF8C42;
  border-radius: 2rem;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  font-weight: bold;
}

.timer-icon {
  font-size: 1.25rem;
}

.timer-text {
  font-size: 0.875rem;
  color: #654321;
}

.recipe-steam {
  position: absolute;
  top: 10px;
  left: 10px;
  animation: steam-float 3s ease-in-out infinite;
}

.steam {
  font-size: 1.5rem;
  opacity: 0.7;
}

@keyframes steam-float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-10px) rotate(10deg);
    opacity: 0.4;
  }
}

.recipe-content-page {
  padding: 1.5rem;
  background: linear-gradient(to bottom, #FFFBF5 0%, #FFF5E6 100%);
}

.recipe-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #2C3E50;
  margin-bottom: 1rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

.recipe-stats-shelf {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.stat-jar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%);
  border: 2px solid #4CAF50;
  padding: 0.5rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #2E7D32;
}

.health-jar {
  background: linear-gradient(135deg, #FFF9E6 0%, #FFE8B3 100%);
  border-color: #FFD23F;
  color: #8B6F00;
}

.jar-icon {
  font-size: 1.25rem;
}

.ingredients-basket {
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #FFF5E6 0%, #FFE8CC 100%);
  border: 3px dashed #FF8C42;
  border-radius: 1rem;
  padding: 1rem;
}

.basket-label {
  font-size: 0.875rem;
  font-weight: bold;
  color: #8B4513;
  margin-bottom: 0.75rem;
}

.ingredient-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.ingredient-tag {
  background: #FFFFFF;
  border: 2px solid #FF8C42;
  color: #654321;
  padding: 0.375rem 0.75rem;
  border-radius: 1.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.more-tag {
  background: #FFE8CC;
  color: #8B6F00;
  border-color: #FFD23F;
}

.recipe-action-buttons {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  flex: 1;
  padding: 0.875rem 1rem;
  border-radius: 1rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 3px solid;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.save-btn {
  background: linear-gradient(135deg, #4CAF50 0%, #45A049 100%);
  border-color: #2E7D32;
  color: white;
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
}

.view-btn {
  background: linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%);
  border-color: #E65100;
  color: white;
}

.view-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
}

.btn-icon {
  font-size: 1.25rem;
}

.btn-label {
  font-size: 0.875rem;
}
</style>

