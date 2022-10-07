<script setup>
import sourceCloudIcon from "@/assets/source-cloud.svg";
import sourceDiskIcon from "@/assets/source-disk.svg";
import sourceSdCardIcon from "@/assets/source-sd-card.svg";
import { inject, ref, computed } from "vue";


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

<template lang="pug">
VeryBigButton(@click="selectSourceFolders")
  span Select sources
  img(:src="sourceCloudIcon")
  img(:src="sourceDiskIcon")
  img(:src="sourceSdCardIcon")
.paths
  .path(v-for="fullPath in sourceFolders" :key="fullPath" @click="removeFolder(fullPath)" )
    p Folder name: {{getFolderName(fullPath)}}
    p Full path: {{fullPath}}
</template>

<style scoped>
.full-path {
  font-size: 12px;
  word-break: break-word;
}
.paths{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  row-gap:10px;
  margin-top:20px;
}
.path{
  color:white;
  font-family: "Aclonica";
  font-size:12px;
}
img {
  max-width: 50px;
}
</style>
