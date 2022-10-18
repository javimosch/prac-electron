<template lang="pug">
SelectMultiple(title="FIND DUPLICATES BY EXTENSIONS" :options="options" v-model="selected")
</template>
<script setup>
import { ref, watchEffect, inject, onMounted } from "vue";

import { PrakStateSymbol } from "@/constants.js";
const { extensions } = inject(PrakStateSymbol);

const props = defineProps({});
const options = ref(
  ["jpg", "pdf", "png", "git", "tiff", "ALL"].map((ext) => ({
    text: ext.toUpperCase(),
    tooltip: `${ext.toUpperCase()} files`,
    value: ext.toLowerCase(),
  }))
);
const selected = ref([options.value[0]]);

watchEffect(() => {
  
  if(selected.value.find(v=>v.value==='all')&&selected.value.length>1){
    selected.value = [
      options.value.find(v=>v.value==='all')
    ]
  }

  extensions.value = [...selected.value];
  
});

onMounted(()=>{
  extensions.value = [...selected.value];
  console.log('extensions.value')
})
</script>
<style scoped></style>
