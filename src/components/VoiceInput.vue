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
Ñ
</template>

<style scoped>

</style>