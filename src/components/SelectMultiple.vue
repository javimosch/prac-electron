<template lang="pug">
//.title(@click="toggleCollapse") 
  span {{props.title}}
  Icon(size="30" color="white")
    ArrowDropDownFilled
.options(v-show="!collapsed")
  .option(v-for="option in options" @click="toggleOption(option)" :class="{selected:props.modelValue.some(v=>v==option.value)}")
    n-tooltip( trigger="hover")
      template(#trigger)
        .text {{option.text}}
      p {{option.tooltip}} 
</template>
<script setup>
import { NTooltip } from "naive-ui";
import { ref } from "vue";
import { Icon } from "@vicons/utils";
import { ArrowDropDownFilled } from "@vicons/material";

const collapsed = ref(false)

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

function toggleCollapse(){
  collapsed.value=!collapsed.value
}

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
  font-size: 20px;
  display:flex;
  justify-content: space-between;
  border-bottom: 1px solid white;
  cursor:pointer;
}
.options {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  column-gap: 10px;
  padding:10px;
  background-color: var(--light);
}
.text {
  min-width:50px;
  font-size: 20px;
  border: 0px solid white;
  padding: 5px 15px;
  width: fit-content;
  
}
.option {
  cursor: pointer;
  margin:10px 0px;
  background-color: transparent;
  background-color: var(--light-dark);
  color: var(--light);
}
.option.selected{
  background-color: white;
  color:var(--light-dark)
}
</style>
