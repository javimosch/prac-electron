<template>
  <n-drawer v-model:show="isOutputAreaVisible" placement="bottom">
    <n-drawer-content
      class="content"
      v-html="outputResult"
      :native-scrollbar="false"
    >
    </n-drawer-content>
  </n-drawer>
</template>

<script setup>
import { NDrawer, NDrawerContent } from "naive-ui";
import { inject, ref } from "vue";
import { PrakStateSymbol } from "../constants.js";
const { outputResult, isOutputAreaVisible } = inject(PrakStateSymbol);
</script>

<style scoped>
.content {
  padding: 10px;
}
</style>
