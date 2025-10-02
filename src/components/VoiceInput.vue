<script setup>
import { ref } from 'vue'
const emit = defineEmits(['transcript', 'send-message'])
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

const isSupported = ref(true)
const isListening = ref(false)
const isProcessing = ref(false)
const transcript = ref('')
const manualInput = ref('')
const error = ref('')



let mediaRecorder = null
let audioChunks = []

const toggleListening = async () => {
  error.value = ''
  transcript.value = ''

  if (isListening.value) {
    // Detener grabación
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop()
    }
    return
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder = new MediaRecorder(stream)
    audioChunks = []

    mediaRecorder.ondataavailable = e => audioChunks.push(e.data)

    mediaRecorder.onstart = () => {
      isListening.value = true
    }

    mediaRecorder.onstop = async () => {
      isListening.value = false
      isProcessing.value = true

      const blob = new Blob(audioChunks, { type: "audio/webm" })
      const formData = new FormData()
      formData.append("file", blob, "recording.webm")

      try {
        const res = await fetch(`${BACKEND_URL}/api/speech-to-text`, {
          method: "POST",
          body: formData
        })
        if (!res.ok) {
          throw new Error(`Error del servidor: ${res.statusText}`)
        }
        const data = await res.json()
        transcript.value = data.transcript || ''

        if (transcript.value.trim()) {
          emit('send-message', transcript.value)
        }
      } catch (err) {
        console.error(err)
        error.value = 'No se pudo transcribir el audio. Intenta de nuevo.'
      } finally {
        isProcessing.value = false
      }
    }

    mediaRecorder.start()
    // Opcional: detener automáticamente después de X segundos
    // setTimeout(() => mediaRecorder.stop(), 10000)

  } catch (err) {
    console.error(err)
    error.value = 'No se pudo acceder al micrófono. Revisa los permisos.'
  }
}

const sendManualMessage = () => {
  if (manualInput.value.trim()) {
    emit('send-message', manualInput.value.trim())
    manualInput.value = ''
  }
}
</script>

<template>
  <div class="mixing-bowl-container">
    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-center gap-4">
        <button
            @click="toggleListening"
            :disabled="!isSupported"
            class="microphone-pot"
            :class="{ 'listening-active': isListening, 'pot-disabled': !isSupported }"
        >
          <div class="pot-content">
            <span v-if="isListening" class="animate-pulse text-4xl">🎤</span>
            <span v-else class="text-4xl">🎙️</span>
          </div>
          <span
              v-if="isListening"
              class="steam-ring steam-ring-1"
          ></span>
          <span
              v-if="isListening"
              class="steam-ring steam-ring-2"
          ></span>
          <span
              v-if="isListening"
              class="steam-ring steam-ring-3"
          ></span>
        </button>

        <div class="voice-status-board">
          <span class="status-text">
            {{ isListening ? '👂 Escuchando...' : isProcessing ? '⚙️ Procesando...' : '🗣️ Habla conmigo' }}
          </span>
          <span class="status-subtext">
            {{ isListening ? 'Toca la olla para detener' : isProcessing ? 'Transcribiendo tu audio' : 'Toca la olla para comenzar' }}
          </span>
        </div>
      </div>

      <div
          v-if="error"
          class="alert-plate error-plate"
      >
        <span class="text-xl mr-2">⚠️</span>
        {{ error }}
      </div>

      <div
          v-if="!isSupported"
          class="alert-plate warning-plate"
      >
        <span class="text-xl mr-2">⚠️</span>
        Tu navegador no soporta reconocimiento de voz. Por favor, usa Chrome, Edge o Safari.
      </div>

      <div
          v-if="transcript"
          class="recipe-note-card"
      >
        <div class="note-pin">📌</div>
        <p class="note-label">Tu mensaje:</p>
        <p class="note-content">{{ transcript }}</p>
      </div>

      <div class="input-cutting-board">
        <input
            v-model="manualInput"
            @keyup.enter="sendManualMessage"
            type="text"
            placeholder="O escribe tu receta aquí... ✍️"
            class="cutting-board-input"
        />
        <button
            @click="sendManualMessage"
            :disabled="!manualInput.trim()"
            class="send-button"
        >
          <span class="button-icon">🍳</span>
          <span class="button-text">Cocinar</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mixing-bowl-container {
  background: linear-gradient(145deg, #FFFFFF 0%, #F5F5F5 100%);
  border-radius: 2rem;
  padding: 2rem;
  box-shadow:
      0 8px 24px rgba(0,0,0,0.15),
      inset 0 2px 4px rgba(255,255,255,0.9);
  border: 4px solid #E8E8E8;
  position: relative;
}

.mixing-bowl-container::before {
  content: '🥣';
  position: absolute;
  top: -25px;
  right: 20px;
  font-size: 3rem;
  transform: rotate(15deg);
}

.microphone-pot {
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, #C0C0C0 0%, #A8A8A8 50%, #909090 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 6px solid #808080;
  box-shadow:
      0 6px 20px rgba(0,0,0,0.3),
      inset 0 -4px 8px rgba(0,0,0,0.4),
      inset 0 2px 4px rgba(255,255,255,0.3);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.microphone-pot:hover:not(.pot-disabled) {
  transform: scale(1.05);
  box-shadow:
      0 8px 28px rgba(0,0,0,0.4),
      inset 0 -4px 8px rgba(0,0,0,0.4),
      inset 0 2px 4px rgba(255,255,255,0.3);
}

.microphone-pot.listening-active {
  background: radial-gradient(circle, #E74C3C 0%, #C0392B 50%, #A93226 100%);
  border-color: #922B21;
  animation: pot-bubble 1s ease-in-out infinite;
  box-shadow:
      0 0 30px rgba(231, 76, 60, 0.6),
      0 6px 20px rgba(0,0,0,0.3),
      inset 0 -4px 8px rgba(0,0,0,0.4);
}

@keyframes pot-bubble {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.pot-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pot-content {
  position: relative;
  z-index: 2;
}

.steam-ring {
  position: absolute;
  border: 3px solid rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: steam-rise 2s ease-out infinite;
}

.steam-ring-1 {
  width: 100%;
  height: 100%;
  animation-delay: 0s;
}

.steam-ring-2 {
  width: 100%;
  height: 100%;
  animation-delay: 0.5s;
}

.steam-ring-3 {
  width: 100%;
  height: 100%;
  animation-delay: 1s;
}

@keyframes steam-rise {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.8);
    opacity: 0;
  }
}

.voice-status-board {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: linear-gradient(135deg, #F5E6D3 0%, #E8D4B8 100%);
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  border: 3px solid #8B4513;
  box-shadow: 0 4px 12px rgba(139, 69, 19, 0.3);
}

.status-text {
  font-size: 1.25rem;
  font-weight: bold;
  color: #2C3E50;
}

.status-subtext {
  font-size: 0.875rem;
  color: #7F8C8D;
  font-weight: 600;
}

.alert-plate {
  padding: 1rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.error-plate {
  background: linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%);
  border: 3px solid #E74C3C;
  color: #C0392B;
}

.warning-plate {
  background: linear-gradient(135deg, #FFF9E6 0%, #FFE8B3 100%);
  border: 3px solid #FFD23F;
  color: #8B6F00;
}

.recipe-note-card {
  background: linear-gradient(135deg, #FFFACD 0%, #FFF8DC 100%);
  border: 3px dashed #FFD700;
  border-radius: 1rem;
  padding: 1.5rem;
  position: relative;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.note-pin {
  position: absolute;
  top: -10px;
  right: 20px;
  font-size: 2rem;
}

.note-label {
  font-size: 0.875rem;
  color: #7F8C8D;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.note-content {
  font-size: 1.125rem;
  color: #2C3E50;
  line-height: 1.6;
  font-weight: 600;
}

.input-cutting-board {
  display: flex;
  gap: 0.75rem;
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
  padding: 1rem;
  border-radius: 1.5rem;
  border: 4px solid #654321;
  box-shadow: 0 6px 20px rgba(139, 69, 19, 0.4);
}

.cutting-board-input {
  flex: 1;
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  border: 3px solid #654321;
  font-size: 1rem;
  font-weight: 600;
  background: #FFF9E6;
  color: #2C3E50;
  outline: none;
  transition: all 0.3s ease;
}

.cutting-board-input:focus {
  border-color: #E74C3C;
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.2);
  transform: translateY(-2px);
}

.cutting-board-input::placeholder {
  color: #95A5A6;
}

.send-button {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #4CAF50 0%, #45A049 100%);
  border: 3px solid #2E7D32;
  border-radius: 1rem;
  font-weight: bold;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.send-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.6);
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button-icon {
  font-size: 1.5rem;
}

.button-text {
  font-size: 1rem;
}
</style>

