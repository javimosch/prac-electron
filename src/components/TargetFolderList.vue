<script setup>
import {  inject } from "vue";

import sourceCloudIcon from "@/assets/source-cloud.svg";
import sourceDiskIcon from "@/assets/source-disk.svg";
import sourceSdCardIcon from "@/assets/source-sd-card.svg";
import { PrakStateSymbol } from "../constants.js";


const { targetDirectory } = inject(PrakStateSymbol);

async function selectSingleFolder() {
  let paths = (await window.electronAPI.selectSingleFolder()) || [];
  targetDirectory.value = paths;
}
function removeFolder(fullPath) {
  targetDirectory.value.splice(
    targetDirectory.value.findIndex((f) => f == fullPath),
    1
  );
}


</script>

<template lang="pug">
VeryBigButton(@click="selectSingleFolder")
  span Select Target
  img(:src="sourceCloudIcon")
  img(:src="sourceDiskIcon")
  img(:src="sourceSdCardIcon")
.paths
  FolderListItem(v-for="fullPath in targetDirectory" :key="fullPath" :fullPath="fullPath" @remove="fullPath => removeFolder(fullPath)")
</template>

<style scoped>

.paths {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  row-gap: 10px;
  margin-top: 20px;
}

img {
  max-width: 50px;
}
</style>
