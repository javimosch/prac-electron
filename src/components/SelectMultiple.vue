<template lang="pug">
.title {{props.title}}
.options
  .option(v-for="option in options" @click="toggleOption(option)" :class="{selected:selected.some(v=>v.value==option.value)}")
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
});
const selected = ref([]);

function toggleOption(option) {
  if (selected.value.some((item) => item.value == option.value)) {
    selected.value.splice(
      selected.value.findIndex((item) => item.value == option.value),
      1
    );
  }else{
    selected.value.push(option)
  }
  emit('update:modelValue', selected.value);
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
