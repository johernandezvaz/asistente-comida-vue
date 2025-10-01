<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
const emit = defineEmits(['transcript', 'send-message'])

const isSupported = ref(false)
const isListening = ref(false)
const transcript = ref('')
const manualInput = ref('')
const error = ref('')

let recognition = null

onMounted(() => {
  // Verificar si el buscador soporta Web Speech API
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

  if (SpeechRecognition) {
    isSupported.value = true
    recognition = new SpeechRecognition()
    recognition.lang = 'es-ES'
    recognition.continuous = false
    recognition.interimResults = true

    recognition.onStart = () => {
      console.log('Voice recognition started')
      isListening.value = true
      error.value = ''
    }

    recognition.onresult = ( event ) => {
      const current = event.resultIndex
      const transcriptResult = event.results[current][0].transcript

      transcript.value = transcriptResult
      emit('transcript', transcriptResult)

      // Si es el resultado final, se envia un mensaje
      if (event.results[current].isFinal) {
        console.log('Final Transcript: ', transcriptResult)
      }
    }

    recognition.onerror = ( event ) => {
      console.error('Speech Recognition Error: ', event.error)
      isListening.value = false

      if (event.error === 'no-speech'){
        error.value = 'No se detectó ninguna voz. Por favor, intenta de nuevo'
      } else if (event.error === 'not-allowed'){
        error.value = 'Permiso de microfono denegado. Por favor, habilita el microfono'
      }else{
        error.value = `Error: ${event.error}`
      }
    }

    recognition.onend = () => {
      console.log('Voice recognition ended')
      isListening.value = false
    }
  }else{
    console.warn('Speech recognition not supported')
  }
})

onUnmounted(() => {
  if(recognition){
    recognition.stop()
  }
})

const toggleListening = () => {
  if (!recognition) return

  if( isListening.value ){
    recognition.stop()
  }else{
    transcript.value = ''
    error.value = ''
    recognition.start()
  }
}

const sendManualMessage = () => {
  if (manualInput.value.trim()) {
    emit('send-message', manualInput.value)
    manualInput.value = ''
  }
}
</script>

<template>
  <div class="bg-[var(--color-surface)] rounded-[var(--radius-xl)] shadow-[var(--shadow-md)] p-6">
    <div class="flex flex-col gap-4">
      Voice Button and Status
      <div class="flex items-center justify-center gap-4">
        <button
            @click="toggleListening"
            :disabled="!isSupported"
            class="relative w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            :class="isListening
            ? 'bg-[var(--color-primary)] text-white shadow-[var(--shadow-lg)] scale-110'
            : 'bg-gradient-to-br from-[var(--color-tomato)] to-[var(--color-orange)] text-white hover:scale-105 shadow-[var(--shadow-md)]'"
        >
          <span v-if="isListening" class="animate-pulse">🎤</span>
          <span v-else>🎙️</span>

          Listening animation rings
          <span
              v-if="isListening"
              class="absolute inset-0 rounded-full bg-[var(--color-primary)] opacity-75 animate-ping"
          ></span>
        </button>

        <div class="flex flex-col gap-1">
          <span class="text-lg font-bold text-[var(--color-text)]">
            {{ isListening ? 'Escuchando...' : 'Hablar' }}
          </span>
          <span class="text-sm text-[var(--color-text-muted)]">
            {{ isListening ? 'Toca para detener' : 'Toca para comenzar' }}
          </span>
        </div>
      </div>

      Error Message
      <div
          v-if="error"
          class="bg-red-50 border border-red-200 rounded-[var(--radius-md)] p-3 text-sm text-red-700"
      >
        {{ error }}
      </div>

      Not Supported Message
      <div
          v-if="!isSupported"
          class="bg-yellow-50 border border-yellow-200 rounded-[var(--radius-md)] p-3 text-sm text-yellow-700"
      >
        ⚠️ Tu navegador no soporta reconocimiento de voz. Por favor, usa Chrome, Edge o Safari.
      </div>

      Transcript Display
      <div
          v-if="transcript"
          class="bg-gradient-to-r from-[var(--color-cream)] to-white rounded-[var(--radius-lg)] p-4 border-2 border-[var(--color-border)]"
      >
        <p class="text-sm text-[var(--color-text-muted)] mb-1">Tu mensaje:</p>
        <p class="text-base text-[var(--color-text)] leading-relaxed">{{ transcript }}</p>
      </div>

      Manual Input
      <div class="flex gap-2">
        <input
            v-model="manualInput"
            @keyup.enter="sendManualMessage"
            type="text"
            placeholder="O escribe tu mensaje aquí..."
            class="flex-1 px-4 py-3 rounded-[var(--radius-lg)] border-2 border-[var(--color-border)] focus:border-[var(--color-primary)] focus:outline-none transition-colors"
        />
        <button
            @click="sendManualMessage"
            :disabled="!manualInput.trim()"
            class="px-6 py-3 bg-gradient-to-r from-[var(--color-avocado)] to-[var(--color-avocado-dark)] text-white rounded-[var(--radius-lg)] font-semibold hover:shadow-[var(--shadow-md)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Enviar
        </button>
      </div>
    </div>
  </div>
</template>

