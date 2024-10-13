import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useTimerStore = defineStore('timer', () => {
  const milisegundos = ref(0);
  const segundos = ref(0);
  const minutos = ref(0);
  const horas = ref(0);
  const isRunning = ref(false);
  const isFinished = ref(false);
  let intervalId: number | null = null;
  const overTime = ref<number>(0)
  const titulo = ref<string>('')

  // Función para iniciar el temporizador
  const startTimer = () => {
    if (isRunning.value || isFinished.value) return;

    isRunning.value = true;
    intervalId = window.setInterval(() => {
      if (milisegundos.value > 0) {
        milisegundos.value -= 10;
      } else if (segundos.value > 0) {
        milisegundos.value = 990;
        segundos.value--;
      } else if (minutos.value > 0) {
        milisegundos.value = 990;
        segundos.value = 59;
        minutos.value--;
      } else if (horas.value > 0) {
        milisegundos.value = 990;
        segundos.value = 59;
        minutos.value = 59;
        horas.value--;
      } else {
        stopTimer();
        isFinished.value = true;
      }
    }, 10); // Cada 10ms
  };

  // Función para detener el temporizador
  const stopTimer = () => {
    isRunning.value = false;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  // Función para reiniciar el temporizador
  const resetTimer = () => {
    stopTimer();
    milisegundos.value = 0;
    segundos.value = 0;
    minutos.value = 0;
    horas.value = 0;
    isFinished.value = false;
    overTime.value = 0
  };

  // Función para añadir tiempo
  const addTime = (amount: number, unit: 'milisegundos' | 'segundos' | 'minutos' | 'horas') => {
    switch (unit) {
      case 'milisegundos':
        milisegundos.value += amount;
        break;
      case 'segundos':
        segundos.value += amount;
        if (segundos.value >= 60) {
          minutos.value += Math.floor(segundos.value / 60);
          segundos.value %= 60;
        }
        break;
      case 'minutos':
        minutos.value += amount;
        if (minutos.value >= 60) {
          horas.value += Math.floor(minutos.value / 60);
          minutos.value %= 60;
        }
        break;
      case 'horas':
        horas.value += amount;
        break;
    }
    if (isRunning.value) {
      stopTimer(); // Detener el temporizador actual
      startTimer(); // Reiniciar el temporizador
      overTime.value += amount
    }
  };

  // Función para formatear el tiempo con 2 dígitos
  const formatTime = (value: number) => String(value).padStart(2, '0');

  return {
    titulo,
    milisegundos,
    segundos,
    minutos,
    horas,
    isRunning,
    isFinished,
    overTime,
    startTimer,
    stopTimer,
    resetTimer,
    addTime,
    formatTime
  };
});
