<template lang="pug">
.analysis-stat
    div.title {{title}}
    div.value {{value}}
</template>
<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number, Boolean],
    required: true,
  },
});
</script>
<style scoped>
.analysis-stat {
  
  font-size: 25px;
  font-weight: 300;
  border: 2px solid grey;
  padding: 5px 15px;
  display: flex;
  column-gap: 10px;
  justify-content: space-between;
}
</style>
