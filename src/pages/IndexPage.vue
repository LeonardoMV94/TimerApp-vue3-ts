<template>
  <q-page padding>
    <div id="temporizador" class="row justify-center fixed-center">
      <div class="q-mb-md text-center">
        <div v-if="!isFinished">
          <q-banner inline-actions :class="isFinished ? 'bg-negative text-white' : 'bg-secondary text-white'">
            <span id="time" class="text-bold ">{{ formatTime(minutos) }}:{{ formatTime(segundos)}}:{{ formatTimeMilisegundos(milisegundos) }}</span>
              <ul id="lista">
                <li v-if="overTime != 0" class="text-white q-py-lg" style="font-size: 4rem;" > + {{ overTime }} segundos</li>
              </ul>
          </q-banner>
        </div>
        <div v-else>
          <span class="text-bold text-white " style="font-size: 8rem;">¡ TIEMPO !</span>
        </div>

      </div>
    </div>
    <div  class="fixed-bottom ">

      <q-list id="acciones" bordered :class="'rounded-borders ' +  colorFondo2">
        <q-expansion-item v-model="listOculto" expand-separator expand-icon-class="text-white">
          <q-card>
            <q-card-section :class="colorFondo2">

              <div class="row justify-center q-gutter-md q-mb-md">
                <q-btn label="Iniciar" color="green" @click="startTimer" :disable="isRunning || isFinished" />
                <q-btn label="Detener" color="red" @click="stopTimer" :disable="!isRunning" />
                <q-btn label="Reiniciar" color="orange" @click="resetTimer" />
              </div>
              <div class="row justify-center q-gutter-md q-mb-md">
                <q-btn color="grey" @click="() => dialog = true"><q-icon name="settings"></q-icon></q-btn>
                <q-btn v-for="(seg, index) of listadoSegundosDefault" :label="`+${seg} segundos`" color="blue" @click="timerStore.addTime(seg, 'segundos')" />
                <!-- <q-btn label="+60 segundos" color="blue" @click="timerStore.addTime(60, 'segundos')" />
                <q-btn label="+30 Segundos" color="blue" @click="timerStore.addTime(30, 'segundos')" /> -->
                <!-- <span class="text-white">{{ formatTime(horas) }}:{{ formatTime(minutos) }}:{{ formatTime(segundos)}}</span> -->
              </div>
              <div v-if="isDisableCustom" class="row justify-center q-gutter-md">
                <q-input color="blue" bg-color="blue" class="text-white" label-color="white" filled v-model.number="tiempoAddBtn" label="segundos" />

                <q-btn color="blue" @click="handleBtn" :disable="isDisableBtn"><q-icon name="add" /></q-btn>
                <span class="text-white">{{ tiempoAddBtn }}</span>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
    </div>
    <q-dialog v-model="dialog" backdrop-filter="blur(4px)">
      <q-card class="q-pa-md">
        <q-card-section class="row items-center q-pb-none text-h6">
          Configuración botones
        </q-card-section>

        <q-card-section>
          <q-checkbox v-model="isDisableCustom" label="Activar input de segundos personalizado" color="blue" />
          <q-select v-model="cantidadNumeros" :options="[1,2,3,4,5]" label="Cantidad de botones" />
          <q-input v-for="(seg, index) in cantidadNumeros" :key="index" label="Segundos" v-model.number="listadoSegundosDefault[index]"></q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script lang="ts" setup>
import { ref,computed, onMounted } from 'vue'
import { useTimerStore } from '../stores/useTimerStore';
import { storeToRefs } from 'pinia';

const tiempoAddBtn = ref<number>(0)
const listOculto = ref<boolean>(true)
const isDisableBtn = ref<boolean>(false)
const listadoSegundosDefault = ref<number[]>([90,60,30])
const dialog = ref()
const cantidadNumeros = ref<number[]>()
const isDisableCustom = ref<boolean>(false)

// Usamos el composable
const timerStore = useTimerStore()
const {
  startTimer,
  stopTimer,
  resetTimer,
  addTime,
  formatTime
} = timerStore;
const {
  milisegundos,
  segundos,
  minutos,
  horas,
  isRunning,
  isFinished,
  overTime } = storeToRefs(timerStore)

const colorFondo2 = computed(() => timerStore.isFinished ? 'bg-negative' : 'bg-secondary')
const formatTimeMilisegundos = (value: number) => {
  return String(Math.floor(value / 10)).padStart(2, '0');
};
const handleBtn = () => {
  timerStore.addTime(tiempoAddBtn.value, 'segundos')
  isDisableBtn.value = true
  setTimeout(() => {
    isDisableBtn.value = false
  },1500)
}
onMounted(() => {
  document.querySelector('#acciones')?.addEventListener('mouseleave', (event) => {
    listOculto.value = false
  console.log('listOculto ', listOculto.value)
},false)
})
</script>

<style scoped>
.q-banner {
  font-size: 2rem;
}

#time {
  font-size: 10rem;
}
ul {
  list-style: none;
}

</style>
