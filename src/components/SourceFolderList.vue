<script setup lang="ts">
import { NButton, NList, NListItem } from "naive-ui";
import { ClearFilled } from "@vicons/material";
import { ref, computed } from "vue";
import type { Ref } from "vue";
import { Icon } from "@vicons/utils";

let sourceFolders: Ref<string[]> = ref(["/home/javi/Downloads"]);

async function selectSourceFolders() {
  let paths: string[] = (await window.electronAPI.selectSourceFolders()) || [];
  sourceFolders.value = [...sourceFolders.value, ...paths];
}
function removeFolder(fullPath: String) {
  sourceFolders.value.splice(
    sourceFolders.value.findIndex((f) => f == fullPath),
    1
  );
}

const getFolderName = computed(() => {
  return (fullPath: string) =>
    <string>fullPath.split("/")[fullPath.split("/").length - 1];
});
</script>

<template>
  <NList>
    <NListItem v-for="fullPath in sourceFolders" :key="fullPath">
      <p>{{ getFolderName(fullPath) }}</p>
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
