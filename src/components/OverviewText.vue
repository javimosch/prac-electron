<template lang="pug">
.overview
    span Breadcrumbs:
    span {{targetDirectory.map(str=>getFolderName(str)).join(',')}}
    span -
    span {{sourceFolders.map(str=>getFolderName(str)).join(',')}}

</template>
<script setup>
import { PrakStateSymbol } from "../constants.js";
import { inject,computed } from "vue";
const { sourceFolders, targetDirectory, extensions } = inject(PrakStateSymbol);

const getFolderName = computed(() => {
  return (fullPath) => fullPath.split("/")[fullPath.split("/").length - 1];
});
</script>
<style scoped>
.overview {
  display: flex;
  justify-content: space-between;
  column-gap: 10px;
  font-size: 16px;
  border:2px solid black;
  padding:15px 20px;
}
</style>
