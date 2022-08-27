<script setup>
import { inject } from "vue";
import { PrakStateSymbol } from "../constants.js";
const { outputResult } = inject(PrakStateSymbol);
</script>
<template>
  <div class="outputResult" v-html="outputResult"></div>
</template>
<style scoped>
p {
  font-size: 10px;
}
.outputResult {
  max-height: 300px;
  overflow-y: auto;
}
</style>
