<template lang="pug">    
.step-zero
    .button(@click="openSettingsDrawer")
      Icon(size="30" color="white")
        SettingsTwotone
    BrandLeft
    </template>
<script setup>
import { Icon } from '@vicons/utils'
import { SettingsTwotone } from '@vicons/material'
import { inject} from "vue";
import { PrakStateSymbol } from "@/constants.js";

const {
  isSettingsAreaVisible
} = inject(PrakStateSymbol);


function openSettingsDrawer(e){
  e.stopPropagation();
  isSettingsAreaVisible.value=true

}
</script>
<style scoped>
.step-zero {
  width: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--grey);
    flex-direction: column;
    padding: 30px 0px;
}
</style>
