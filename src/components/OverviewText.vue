<template lang="pug">
.overview
    span.title Overview:
    
    span Source folders: {{sourceFolders.map(str=>getFolderName(str)).join(',')}}

    span Target folder: {{targetDirectory.map(str=>getFolderName(str)).join(',')}}
    .target-structure Target structure: {{targetDirectoryStructure}}
    .main-action Current action: {{mainAction}}
    .extensions Extensions: {{extensions.map(ext=>ext.toUpperCase()).join(', ')}}
    .status Status: {{formatStatus(status)}}
    .processing-percent(v-show="processingPercent!==0&&processingPercent!==100") Processing {{processingPercent}}%
    .processing-message(v-show="processingMessage" v-text="processingMessage")
</template>
<script setup>
import { PrakStateSymbol } from "../constants.js";
import { inject,computed } from "vue";
const { sourceFolders, targetDirectory, extensions, status,mainAction, targetDirectoryStructure, processingPercent, processingMessage} = inject(PrakStateSymbol);

function formatStatus(status){
  switch(status){
    case 'analysis_required':
      return 'Require analysis'
    case 'analysis_in_progress':
      return 'Analyzing...'
    case 'analysis_complete':
      return 'Analysis complete'
  }
}

const getFolderName = computed(() => {
  return (fullPath) => fullPath.split("/")[fullPath.split("/").length - 1];
});
</script>
<style scoped>
.overview {
  font-family: "Lato", sans-serif;
  display: flex;
  justify-content: space-around;
  column-gap: 10px;
  font-size: 18px;
  border:2px solid grey;
  padding:15px 20px;
  color:black;
  font-weight: 300;
  flex-direction: column;
}
.title{
  font-weight: 400;
}
</style>
