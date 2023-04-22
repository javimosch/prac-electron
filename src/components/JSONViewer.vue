<template>
    <div>
      <vue-json-pretty :data="modelValue" />
    </div>
  </template>
  
  <script setup>
  import VueJsonPretty from 'vue-json-pretty';
  import 'vue-json-pretty/lib/styles.css';
  const props = defineProps({
    modelValue:{
        type:Object,
        default:()=>({})
    }
  })
 
  </script>