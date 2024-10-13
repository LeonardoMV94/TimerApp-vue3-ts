<template>
  <q-layout view="lHh Lpr lFf" :class="isFinished ? 'bg-negative' : 'bg-secondary'">
    <q-bar class="q-electron-drag">
      <q-icon name="timer" color="white" size="sm" />
      <div class="text-white">{{ !isFinished ? titulo :'TimerApp | PCTester.cl' }}</div>

      <q-space />

      <q-btn dense flat color="white" icon="minimize" @click="minimize" />
      <q-btn dense flat color="white" icon="crop_square" @click="maximize" />
      <q-btn dense flat color="white" icon="close" @click="close" />
    </q-bar>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import {ref,computed} from 'vue'
import { useTimerStore } from '../stores/useTimerStore';
import { storeToRefs } from 'pinia'

// Usamos el composable
const timerStore = useTimerStore()
const { isFinished, isRunning,titulo } = storeToRefs(timerStore);

// myWindowAPI configured in /src-electron/main-process/electron-preload
const minimize = () => window.myWindowAPI?.minimize()
const maximize = () => window.myWindowAPI?.toggleMaximize()
const close = () => window.myWindowAPI?.close()

defineOptions({
  name: 'MainLayout'
});

</script>
<style>
::-webkit-scrollbar {
    display: none;
}
</style>
