<script setup>
import sourceCloudIcon from "@/assets/source-cloud.svg";
import sourceDiskIcon from "@/assets/source-disk.svg";
import sourceSdCardIcon from "@/assets/source-sd-card.svg";
import { inject } from "vue";

import { PrakStateSymbol } from "@/constants.js";
const { sourceFolders } = inject(PrakStateSymbol);

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


</script>

<template lang="pug">
VeryBigButton(@click="selectSourceFolders")
  span Select sources
  img(:src="sourceCloudIcon")
  img(:src="sourceDiskIcon")
  img(:src="sourceSdCardIcon")
.paths
  FolderListItem(v-for="fullPath in sourceFolders" :key="fullPath" :fullPath="fullPath" @remove="fullPath => removeFolder(fullPath)")
</template>

<style scoped>

.paths{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  row-gap:10px;
  margin-top:20px;
}

img {
  max-width: 50px;
}
</style>
