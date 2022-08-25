<script setup>
import { NButton, NList, NListItem } from "naive-ui";
import { ClearFilled } from "@vicons/material";
import { ref, computed, inject } from "vue";
import { Icon } from "@vicons/utils";

import { PrakStateSymbol } from "../constants.js";
const { targetDirectory } = inject(PrakStateSymbol);

//let targetDirectory: Ref<string[]> = ref(["/home/javi/Documents/download-new"]);

async function selectMultipleFolders() {
  let paths = (await window.electronAPI.selectSingleFolder()) || [];
  targetDirectory.value = paths;
}
function removeFolder(fullPath) {
  targetDirectory.value.splice(
    targetDirectory.value.findIndex((f) => f == fullPath),
    1
  );
}

const getFolderName = computed(() => {
  return (fullPath) => fullPath.split("/")[fullPath.split("/").length - 1];
});
</script>

<template>
  <NList>
    <NListItem v-for="fullPath in targetDirectory" :key="fullPath">
      <p>{{ getFolderName(fullPath) }}</p>
      <p class="full-path">{{ fullPath }}</p>
      <template #suffix>
        <n-button @click="removeFolder(fullPath)">
          <Icon>
            <ClearFilled />
          </Icon>
        </n-button>
      </template>
    </NListItem>
    <template #footer>
      <n-button @click="selectMultipleFolders">Set destination</n-button>
    </template>
  </NList>
</template>

<style scoped>
.full-path {
  font-size: 12px;
  word-break: break-word;
}
</style>
