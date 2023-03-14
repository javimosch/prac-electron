<script setup>
import sourceCloudIcon from "@/assets/source-cloud.svg";
import sourceDiskIcon from "@/assets/source-disk.svg";
import sourceSdCardIcon from "@/assets/source-sd-card.svg";
import { inject, watchEffect } from "vue";
import { Icon } from "@vicons/utils";
import { ArrowDropDownFilled } from "@vicons/material";
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

function onOrderChange(e) {
  // Remove item from old index
  let item = sourceFolders.value.splice(e.oldIndex, 1)[0];

  // Insert at new index
  sourceFolders.value.splice(e.newIndex, 0, item);
}

watchEffect(()=>{
  window.electronAPI.customAction({
    actionName: 'saveSourceItems',
    sourceItems: [...sourceFolders.value]
  })
})
</script>

<template lang="pug">
VeryBigButton(@click="selectSourceFolders")
  .button-content
    //img(:src="sourceDiskIcon")
    //simple-svg(
        :src="sourceDiskIcon"
        fill-class-name="fill"
        fill="var(--light-dark)"
        customClassName="svg-maxw-50"
      )
    //img(:src="sourceCloudIcon")
    span Select sources
    //img(:src="sourceSdCardIcon")
    Icon(size="30" color="var(--light-dark)")
      ArrowDropDownFilled
.paths(v-sortable @end="onOrderChange")
  FolderListItem(v-for="fullPath in sourceFolders" :key="fullPath" :fullPath="fullPath" @remove="fullPath => removeFolder(fullPath)")
</template>

<style scoped>
.button-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}
.paths {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  row-gap: 10px;
  margin-top: 20px;
  max-height: 273px;
  overflow: auto;
}

img {
  max-width: 50px;
}
</style>
