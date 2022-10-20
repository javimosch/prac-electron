<template lang="pug">
.title {{props.title}}
.options
  .option(v-for="option in options" @click="toggleOption(option)" :class="{selected:props.modelValue.some(v=>v==option.value)}")
    n-tooltip( trigger="hover")
      template(#trigger)
        .text {{option.text}}
      p {{option.tooltip}} 
</template>
<script setup>
import { NTooltip } from "naive-ui";
import { ref } from "vue";
const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  title: {
    type: String,
    default: "title",
  },
  options: {
    type: Array,
    default: () => {
      return [];
    },
  },
  modelValue:{
    type: Array,
    default:()=>([])
  }
});
const selected = ref([]);

function toggleOption(option) {
  let selected = props.modelValue.map(v=>v)

  if(selected.includes('all')&&option.value!=='all'){
    selected.length=0
  }

  if (selected.some((item) => item == option.value)) {
    selected.splice(
      selected.findIndex((item) => item == option.value),
      1
    );
  }else{
    selected.push(option.value)
  }
  emit('update:modelValue', selected);
}
</script>
<style scoped>
.title {
  color: white;
  font-family: "Aclonica";
  font-size: 20px;
}
.options {
  margin-top: 15px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  column-gap: 10px;
}
.text {
  color: white;
  font-family: "Aclonica";
  font-size: 20px;
  border: 2px solid white;
  padding: 5px 15px;
  width: fit-content;
}
.option {
  cursor: pointer;
}
.option.selected{
  background-color: darkgrey;
}
</style>
