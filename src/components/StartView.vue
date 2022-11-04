<template lang="pug">
.step-one
    .center
        BrandCenter
        .btn-group
            BigButton(@click="selectAction('dedupe')") Dedupe
            BigButton(@click="selectAction('copy')") Copy
            BigButton(@click="selectAction('clean')") Clean
</template>

<script setup>
import { inject } from "vue";
import { PrakStateSymbol } from "@/constants.js";
const emit = defineEmits(['click'])
const {
  mainAction,
} = inject(PrakStateSymbol);

function selectAction(name){
  mainAction.value = name
  emit('click')
}
</script>
<style scoped>
.step-one {
  background-color: var(--grey);
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh);
}
.center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.btn-group {
  margin-top: calc(5%);
  display: flex;
  column-gap: 20px;
}
</style>
