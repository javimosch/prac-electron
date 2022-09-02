<script setup>
import { NButton, NList, NListItem } from "naive-ui";
import { ClearFilled } from "@vicons/material";
import { inject, ref, computed } from "vue";

import { Icon } from "@vicons/utils";
import { PrakStateSymbol } from "../constants.js";
const { sourceFolders } = inject(PrakStateSymbol);

//let sourceFolders: Ref<string[]> = ref(["/home/javi/Downloads"]);

async function selectSourceFolders() {
  let paths = (await window.electronAPI.selectMultipleFolders()) || [];
  sourceFolders.value = [...sourceFolders.value, ...paths];
}
function removeFolder(fullPath) {
  sourceFolders.value.splice(
    sourceFolders.value.findIndex((f) => f == fullPath),
    1
  );
}

const getFolderName = computed(() => {
  return (fullPath) => fullPath.split("/")[fullPath.split("/").length - 1];
});
</script>

<template>
  <NList class="my-panel">
    <NListItem v-for="fullPath in sourceFolders" :key="fullPath">
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
      <n-button @click="selectSourceFolders">Add sources</n-button>
    </template>
  </NList>
</template>

<style scoped>
.full-path {
  font-size: 12px;
  word-break: break-word;
}
</style>
