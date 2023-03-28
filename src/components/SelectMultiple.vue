<template lang="pug">
.wrapper
  .options(v-show="!collapsed")
    .option(v-for="option in options" @click="toggleOption(option)" :class="{selected:props.modelValue.some(v=>v==option.value)}")
        .text(:title="option.tooltip") {{option.text}}
        
</template>
<script setup>
import { ref } from "vue";

const collapsed = ref(false);

const emit = defineEmits(["update:modelValue"]);
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
  modelValue: {
    type: Array,
    default: () => [],
  },
});
const selected = ref([]);

function toggleCollapse() {
  collapsed.value = !collapsed.value;
}

function toggleOption(option) {
  let selected = props.modelValue.map((v) => v);

  if (selected.includes("all") && option.value !== "all") {
    selected.length = 0;
  }

  if (selected.some((item) => item == option.value)) {
    selected.splice(
      selected.findIndex((item) => item == option.value),
      1
    );
  } else {
    selected.push(option.value);
  }
  emit("update:modelValue", selected);
}
</script>
<style scoped>
.title {
  color: white;
  font-size: 20px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid white;
  cursor: pointer;
}
.options {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  column-gap: 10px;
  row-gap: 5px;
  padding: 10px;
  
  max-height: 109px;
  min-height: 109px;
  overflow: auto;
  justify-content: space-between;
  max-width: 281px;
  margin: 0 auto;
}
.wrapper{
  background-color: var(--light);
  min-height: 143px;
}
.text {
  min-width: 50px;
  font-size: 1rem;
  border: 0px solid white;
  padding: 5px 15px;
  width: fit-content;
  display: flex;
  justify-content: center;
}
.option {
  cursor: pointer;
  max-width: 100px;
  background-color: transparent;
  background-color: var(--light-dark);
  color: var(--light);
}
.option.selected {
  background-color: white;
  color: var(--light-dark);
}
</style>
