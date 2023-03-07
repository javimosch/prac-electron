<script setup>
import ProvidePrakContext from "./components/ProvidePrakContext.vue";
import {storeToRefs} from 'pinia'
import { useAppStore } from '@/stores/app'
const appStore = useAppStore()
const { currentViewName, appVersion } = storeToRefs(appStore)
function gotoView(viewNameParam) {
  currentViewName.value = viewNameParam;
}
</script>
<template>
    <ProvidePrakContext>
      <router-view></router-view>
      <div class="appVersion">{{ appVersion }}</div>
    </ProvidePrakContext>
</template>
<style lang="scss" scoped>
.appVersion{
  position:fixed;
  bottom:5px;
  right:5px;
}
</style>


