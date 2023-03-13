<template lang="pug">
.root
    div.title {{title}}
    div.value {{value}}
</template>
<script setup>
import {computed} from 'vue'
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number, Boolean],
    required: true,
  },
  block:{
    type:Boolean,
    default:false
  }
});
const width = computed(()=>props.block?'100%':'140px')
</script>
<style scoped>
.root {
  width: v-bind(width);
  font-weight: 300;
  color: var(--light-dark);
  display: flex;
  flex-direction: column;
  text-align: center;
  background-color: var(--light);
}
.title {
  border: 0;
  font-weight: 400;
  text-transform: uppercase;
  color: white;
  background-color: var(--light-dark);
  padding: 5px 5px;
  font-size: 16px;
}
.value {
  font-size: 14px;
}
</style>
